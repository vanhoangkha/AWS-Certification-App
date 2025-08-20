// Simple exam hooks for demo
import { useMutation, useQuery } from '@tanstack/react-query'
import { DemoAPI } from '@/services/demo-simple'
import type { ExamSession, ExamResult, StartExamInput, SaveProgressInput } from '@/types'

export const useExams = () => {
  const startExam = useMutation({
    mutationFn: (input: StartExamInput) => DemoAPI.Exam.startExam(input)
  })

  const saveExamProgress = useMutation({
    mutationFn: (input: SaveProgressInput) => DemoAPI.Exam.saveExamProgress(input)
  })

  const submitExam = useMutation({
    mutationFn: (sessionId: string) => DemoAPI.Exam.submitExam(sessionId)
  })

  const getExamSession = (sessionId: string) => {
    return DemoAPI.Exam.getExamSession(sessionId)
  }

  return {
    startExam: startExam.mutateAsync,
    saveExamProgress: saveExamProgress.mutateAsync,
    submitExam: submitExam.mutateAsync,
    getExamSession,
    isLoading: startExam.isPending || saveExamProgress.isPending || submitExam.isPending
  }
}