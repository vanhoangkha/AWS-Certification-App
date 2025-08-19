// React hooks for question management

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QuestionAPI } from '@/services/api'
import type { Question, QuestionInput, QuestionFilters } from '@/types'

// Query keys
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (filters: QuestionFilters) => [...questionKeys.lists(), filters] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
  practice: () => [...questionKeys.all, 'practice'] as const,
  practiceNext: (certification: string, domains: string[], difficulty?: string, excludeQuestions?: string[]) => 
    [...questionKeys.practice(), certification, domains, difficulty, excludeQuestions] as const,
}

// Get single question
export const useQuestion = (questionId: string) => {
  return useQuery({
    queryKey: questionKeys.detail(questionId),
    queryFn: () => QuestionAPI.getQuestion(questionId),
    enabled: !!questionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get questions with filters
export const useQuestions = (filters: QuestionFilters) => {
  return useQuery({
    queryKey: questionKeys.list(filters),
    queryFn: () => QuestionAPI.getQuestionsByFilters(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  })
}

// Get next practice question
export const useNextPracticeQuestion = (
  certification: string,
  domains: string[],
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD',
  excludeQuestions: string[] = []
) => {
  return useQuery({
    queryKey: questionKeys.practiceNext(certification, domains, difficulty, excludeQuestions),
    queryFn: () => QuestionAPI.getNextPracticeQuestion(certification, domains, difficulty, excludeQuestions),
    enabled: !!certification && domains.length > 0,
    staleTime: 0, // Always fresh for practice questions
  })
}

// Create question mutation
export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: QuestionInput) => QuestionAPI.createQuestion(input),
    onSuccess: (newQuestion) => {
      // Invalidate and refetch questions lists
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() })
      
      // Add the new question to the cache
      queryClient.setQueryData(
        questionKeys.detail(newQuestion.questionId),
        newQuestion
      )
    },
    onError: (error) => {
      console.error('Failed to create question:', error)
    },
  })
}

// Update question mutation
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Partial<Question> & { questionId: string }) => 
      QuestionAPI.updateQuestion(input),
    onSuccess: (updatedQuestion) => {
      // Update the question in cache
      queryClient.setQueryData(
        questionKeys.detail(updatedQuestion.questionId),
        updatedQuestion
      )
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to update question:', error)
    },
  })
}

// Delete question mutation
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionId: string) => QuestionAPI.deleteQuestion(questionId),
    onSuccess: (_, questionId) => {
      // Remove the question from cache
      queryClient.removeQueries({ queryKey: questionKeys.detail(questionId) })
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to delete question:', error)
    },
  })
}

// Prefetch questions for better UX
export const usePrefetchQuestions = () => {
  const queryClient = useQueryClient()

  const prefetchQuestions = (filters: QuestionFilters) => {
    queryClient.prefetchQuery({
      queryKey: questionKeys.list(filters),
      queryFn: () => QuestionAPI.getQuestionsByFilters(filters),
      staleTime: 2 * 60 * 1000,
    })
  }

  const prefetchQuestion = (questionId: string) => {
    queryClient.prefetchQuery({
      queryKey: questionKeys.detail(questionId),
      queryFn: () => QuestionAPI.getQuestion(questionId),
      staleTime: 5 * 60 * 1000,
    })
  }

  return { prefetchQuestions, prefetchQuestion }
}

// Infinite query for large question lists
export const useInfiniteQuestions = (filters: Omit<QuestionFilters, 'nextToken'>) => {
  return useQuery({
    queryKey: [...questionKeys.list(filters), 'infinite'],
    queryFn: async ({ pageParam = undefined }) => {
      return QuestionAPI.getQuestionsByFilters({
        ...filters,
        nextToken: pageParam
      })
    },
    // getNextPageParam: (lastPage) => lastPage.nextToken,
    staleTime: 2 * 60 * 1000,
  })
}

// Custom hook for question statistics
export const useQuestionStats = (filters: QuestionFilters) => {
  return useQuery({
    queryKey: [...questionKeys.list(filters), 'stats'],
    queryFn: async () => {
      const result = await QuestionAPI.getQuestionsByFilters({
        ...filters,
        limit: 1000 // Get more for accurate stats
      })
      
      const stats = {
        total: result.total || result.questions.length,
        byDifficulty: {
          EASY: 0,
          MEDIUM: 0,
          HARD: 0
        },
        byDomain: {} as Record<string, number>,
        byCertification: {} as Record<string, number>
      }

      result.questions.forEach(question => {
        stats.byDifficulty[question.difficulty]++
        stats.byDomain[question.domain] = (stats.byDomain[question.domain] || 0) + 1
        stats.byCertification[question.certification] = (stats.byCertification[question.certification] || 0) + 1
      })

      return stats
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for stats
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