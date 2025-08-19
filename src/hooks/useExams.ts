// React hooks for exam management

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExamAPI, ResultAPI } from '@/services/api'
import type { ExamSession, ExamResult, StartExamInput, SaveProgressInput } from '@/types'

// Query keys
export const examKeys = {
  all: ['exams'] as const,
  sessions: () => [...examKeys.all, 'sessions'] as const,
  session: (id: string) => [...examKeys.sessions(), id] as const,
  results: () => [...examKeys.all, 'results'] as const,
  result: (id: string) => [...examKeys.results(), id] as const,
  userResults: (userId: string) => [...examKeys.results(), 'user', userId] as const,
}

// Get exam session
export const useExamSession = (sessionId: string) => {
  return useQuery({
    queryKey: examKeys.session(sessionId),
    queryFn: () => ExamAPI.getExamSession(sessionId),
    enabled: !!sessionId,
    staleTime: 30 * 1000, // 30 seconds - exam data should be relatively fresh
    refetchInterval: (data) => {
      // Auto-refresh if exam is in progress
      return data?.status === 'IN_PROGRESS' ? 30 * 1000 : false
    },
  })
}

// Get exam result
export const useExamResult = (resultId: string) => {
  return useQuery({
    queryKey: examKeys.result(resultId),
    queryFn: () => ResultAPI.getExamResult(resultId),
    enabled: !!resultId,
    staleTime: 10 * 60 * 1000, // 10 minutes - results don't change
  })
}

// Start exam mutation
export const useStartExam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: StartExamInput) => ExamAPI.startExam(input),
    onSuccess: (examSession) => {
      // Cache the new exam session
      queryClient.setQueryData(
        examKeys.session(examSession.sessionId),
        examSession
      )
    },
    onError: (error) => {
      console.error('Failed to start exam:', error)
    },
  })
}

// Save exam progress mutation
export const useSaveExamProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SaveProgressInput) => ExamAPI.saveExamProgress(input),
    onSuccess: (examSession) => {
      // Update the exam session in cache
      queryClient.setQueryData(
        examKeys.session(examSession.sessionId),
        examSession
      )
    },
    onError: (error) => {
      console.error('Failed to save exam progress:', error)
    },
  })
}

// Submit exam mutation
export const useSubmitExam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => ExamAPI.submitExam(sessionId),
    onSuccess: (result, sessionId) => {
      // Cache the exam result
      queryClient.setQueryData(
        examKeys.result(result.resultId),
        result
      )

      // Update the exam session status
      queryClient.setQueryData(
        examKeys.session(sessionId),
        (oldData: ExamSession | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              status: 'COMPLETED' as const,
              endTime: result.completedAt
            }
          }
          return oldData
        }
      )

      // Invalidate user results to include the new result
      queryClient.invalidateQueries({ 
        queryKey: examKeys.userResults(result.userId) 
      })
    },
    onError: (error) => {
      console.error('Failed to submit exam:', error)
    },
  })
}

// Auto-save hook for exam progress
export const useAutoSaveExamProgress = (
  sessionId: string,
  answers: Record<string, any>,
  markedForReview: string[],
  enabled = true,
  interval = 30000 // 30 seconds
) => {
  const saveProgressMutation = useSaveExamProgress()

  return useQuery({
    queryKey: ['autoSave', sessionId, answers, markedForReview],
    queryFn: async () => {
      if (!sessionId || !enabled) return null
      
      await saveProgressMutation.mutateAsync({
        sessionId,
        answers,
        markedForReview
      })
      
      return { savedAt: new Date().toISOString() }
    },
    enabled: enabled && !!sessionId,
    refetchInterval: interval,
    refetchIntervalInBackground: true,
    staleTime: 0,
  })
}

// Exam timer hook
export const useExamTimer = (
  startTime: string,
  timeLimit: number, // in minutes
  onTimeUp?: () => void
) => {
  const startTimeMs = new Date(startTime).getTime()
  const timeLimitMs = timeLimit * 60 * 1000
  const endTimeMs = startTimeMs + timeLimitMs

  return useQuery({
    queryKey: ['examTimer', startTime, timeLimit],
    queryFn: () => {
      const now = Date.now()
      const remainingMs = Math.max(0, endTimeMs - now)
      const remainingMinutes = Math.floor(remainingMs / (60 * 1000))
      const remainingSeconds = Math.floor((remainingMs % (60 * 1000)) / 1000)
      
      const isTimeUp = remainingMs === 0
      const isWarning = remainingMs <= 10 * 60 * 1000 // 10 minutes warning
      const isCritical = remainingMs <= 5 * 60 * 1000 // 5 minutes critical
      
      if (isTimeUp && onTimeUp) {
        onTimeUp()
      }
      
      return {
        remainingMs,
        remainingMinutes,
        remainingSeconds,
        isTimeUp,
        isWarning,
        isCritical,
        formattedTime: `${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
      }
    },
    refetchInterval: 1000, // Update every second
    refetchIntervalInBackground: true,
    staleTime: 0,
  })
}

// Exam validation hook
export const useExamValidation = (examSession: ExamSession | null) => {
  return useQuery({
    queryKey: ['examValidation', examSession?.sessionId],
    queryFn: () => {
      if (!examSession) return null

      const totalQuestions = examSession.questions.length
      const answeredQuestions = Object.keys(examSession.answers).length
      const markedForReview = examSession.markedForReview.length
      const unansweredQuestions = totalQuestions - answeredQuestions

      const canSubmit = answeredQuestions > 0 // At least one question answered
      const allAnswered = answeredQuestions === totalQuestions
      const hasMarkedQuestions = markedForReview > 0

      return {
        totalQuestions,
        answeredQuestions,
        unansweredQuestions,
        markedForReview,
        canSubmit,
        allAnswered,
        hasMarkedQuestions,
        completionPercentage: Math.round((answeredQuestions / totalQuestions) * 100)
      }
    },
    enabled: !!examSession,
    staleTime: 0, // Always recalculate
  })
}

// Practice mode hook
export const usePracticeMode = () => {
  const queryClient = useQueryClient()

  const startPracticeSession = (certification: string, domains: string[]) => {
    // Create a practice session in local state
    const practiceSession = {
      sessionId: `practice-${Date.now()}`,
      certification,
      domains,
      currentQuestionIndex: 0,
      answeredQuestions: [] as string[],
      correctAnswers: 0,
      startTime: new Date().toISOString()
    }

    queryClient.setQueryData(['practiceSession'], practiceSession)
    return practiceSession
  }

  const updatePracticeSession = (updates: any) => {
    queryClient.setQueryData(['practiceSession'], (old: any) => ({
      ...old,
      ...updates
    }))
  }

  const endPracticeSession = () => {
    queryClient.removeQueries({ queryKey: ['practiceSession'] })
  }

  const practiceSession = queryClient.getQueryData(['practiceSession'])

  return {
    practiceSession,
    startPracticeSession,
    updatePracticeSession,
    endPracticeSession
  }
}

// Exam statistics hook
export const useExamStats = (userId: string) => {
  return useQuery({
    queryKey: examKeys.userResults(userId),
    queryFn: async () => {
      // This would typically call a dedicated analytics API
      // For now, we'll simulate with a placeholder
      return {
        totalExams: 0,
        averageScore: 0,
        bestScore: 0,
        passRate: 0,
        recentExams: [],
        certificationProgress: {},
        domainStrengths: {},
        improvementTrend: []
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}