import React, { useState, useEffect, useCallback } from 'react'
import {
  AppLayout,
  Alert,
  Box,
  SpaceBetween,
  Modal,
  Button
} from '@cloudscape-design/components'
import { useParams, useNavigate } from 'react-router-dom'
import { useExamSession, useSaveExamProgress, useSubmitExam, useAutoSaveExamProgress } from '@/hooks/useExams'
import ExamHeader from './ExamHeader'
import QuestionDisplay from './QuestionDisplay'
import ExamNavigator from './ExamNavigator'
import ExamControls from './ExamControls'
import ExamReviewModal from './ExamReviewModal'
import type { Answer } from '@/types'

const ExamInterface: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [markedForReview, setMarkedForReview] = useState<string[]>([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showEndExamModal, setShowEndExamModal] = useState(false)
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<number, number>>({})

  // Hooks
  const { data: examSession, isLoading, error } = useExamSession(sessionId!)
  const saveProgressMutation = useSaveExamProgress()
  const submitExamMutation = useSubmitExam()

  // Auto-save progress every 30 seconds
  useAutoSaveExamProgress(
    sessionId!,
    answers,
    markedForReview,
    !!examSession && examSession.status === 'IN_PROGRESS'
  )

  // Initialize state from exam session
  useEffect(() => {
    if (examSession) {
      setAnswers(examSession.answers)
      setMarkedForReview(examSession.markedForReview)
      setQuestionStartTimes({ [currentQuestionIndex]: Date.now() })
    }
  }, [examSession, currentQuestionIndex])

  // Track time spent on each question
  useEffect(() => {
    setQuestionStartTimes(prev => ({
      ...prev,
      [currentQuestionIndex]: Date.now()
    }))
  }, [currentQuestionIndex])

  const handleAnswerChange = useCallback((answer: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [answer.questionId]: answer
    }))
  }, [])

  const handleQuestionSelect = useCallback((index: number) => {
    setCurrentQuestionIndex(index)
  }, [])

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex])

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < (examSession?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }, [currentQuestionIndex, examSession])

  const handleMarkForReview = useCallback((questionId: string) => {
    setMarkedForReview(prev => [...prev, questionId])
  }, [])

  const handleUnmarkForReview = useCallback((questionId: string) => {
    setMarkedForReview(prev => prev.filter(id => id !== questionId))
  }, [])

  const handleEndExam = useCallback(() => {
    setShowEndExamModal(true)
  }, [])

  const handleSubmitExam = useCallback(async () => {
    if (!sessionId) return

    try {
      // Save final progress before submitting
      await saveProgressMutation.mutateAsync({
        sessionId,
        answers,
        markedForReview
      })

      // Submit exam
      const result = await submitExamMutation.mutateAsync(sessionId)
      
      // Navigate to results page
      navigate(`/results/${result.resultId}`)
    } catch (error) {
      console.error('Failed to submit exam:', error)
    }
  }, [sessionId, answers, markedForReview, saveProgressMutation, submitExamMutation, navigate])

  const handleAutoSubmit = useCallback(() => {
    // Auto-submit when time expires
    handleSubmitExam()
  }, [handleSubmitExam])

  if (isLoading) {
    return (
      <div className="flex-center full-height">
        <Box>Loading exam...</Box>
      </div>
    )
  }

  if (error || !examSession) {
    return (
      <div className="flex-center full-height">
        <Alert type="error" header="Error Loading Exam">
          {error?.message || 'Exam session not found'}
        </Alert>
      </div>
    )
  }

  if (examSession.status !== 'IN_PROGRESS') {
    return (
      <div className="flex-center full-height">
        <Alert type="warning" header="Exam Not Available">
          This exam session is no longer active.
        </Alert>
      </div>
    )
  }

  const currentQuestion = examSession.questions[currentQuestionIndex]
  const currentQuestionData = examSession.questions.find(q => q.questionId === currentQuestion)
  const currentAnswer = answers[currentQuestion]
  const isCurrentMarked = markedForReview.includes(currentQuestion)
  const timeSpentOnQuestion = questionStartTimes[currentQuestionIndex] 
    ? Math.floor((Date.now() - questionStartTimes[currentQuestionIndex]) / 1000)
    : 0

  // Create updated exam session for components
  const updatedExamSession = {
    ...examSession,
    answers,
    markedForReview
  }

  return (
    <div className="exam-container">
      {/* Exam Header */}
      <ExamHeader
        examSession={updatedExamSession}
        currentQuestionIndex={currentQuestionIndex}
        onEndExam={handleEndExam}
        onReviewMode={() => setShowReviewModal(true)}
        showReviewButton={examSession.examType === 'MOCK'}
      />

      {/* Main Exam Content */}
      <div className="exam-content">
        <AppLayout
          navigationHide={false}
          navigation={
            <ExamNavigator
              examSession={updatedExamSession}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              onMarkForReview={handleMarkForReview}
              onUnmarkForReview={handleUnmarkForReview}
            />
          }
          content={
            <div className="exam-main">
              <SpaceBetween direction="vertical" size="l">
                {/* Question Display */}
                {currentQuestionData && (
                  <QuestionDisplay
                    question={currentQuestionData}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={examSession.questions.length}
                    currentAnswer={currentAnswer}
                    onAnswerChange={handleAnswerChange}
                    showExplanation={examSession.examType === 'PRACTICE'}
                    showCorrectAnswer={false}
                    timeSpentOnQuestion={timeSpentOnQuestion}
                  />
                )}

                {/* Exam Controls */}
                <ExamControls
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={examSession.questions.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onMarkForReview={() => handleMarkForReview(currentQuestion)}
                  onUnmarkForReview={() => handleUnmarkForReview(currentQuestion)}
                  onEndExam={handleEndExam}
                  isMarkedForReview={isCurrentMarked}
                  hasAnswer={!!currentAnswer}
                  isFirstQuestion={currentQuestionIndex === 0}
                  isLastQuestion={currentQuestionIndex === examSession.questions.length - 1}
                  disabled={saveProgressMutation.isPending || submitExamMutation.isPending}
                />
              </SpaceBetween>
            </div>
          }
          toolsHide={true}
        />
      </div>

      {/* Review Modal */}
      <ExamReviewModal
        visible={showReviewModal}
        examSession={updatedExamSession}
        onDismiss={() => setShowReviewModal(false)}
        onSubmit={() => {
          setShowReviewModal(false)
          handleSubmitExam()
        }}
        onGoToQuestion={(index) => {
          setCurrentQuestionIndex(index)
          setShowReviewModal(false)
        }}
      />

      {/* End Exam Confirmation Modal */}
      <Modal
        visible={showEndExamModal}
        onDismiss={() => setShowEndExamModal(false)}
        header="End Exam"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowEndExamModal(false)}>
                Continue Exam
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowEndExamModal(false)
                  if (examSession.examType === 'MOCK') {
                    setShowReviewModal(true)
                  } else {
                    handleSubmitExam()
                  }
                }}
                loading={submitExamMutation.isPending}
              >
                {examSession.examType === 'MOCK' ? 'Review & Submit' : 'Submit Exam'}
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          <Alert type="warning" header="Are you sure you want to end this exam?">
            <SpaceBetween direction="vertical" size="s">
              <Box>
                • You have answered {Object.keys(answers).length} of {examSession.questions.length} questions
              </Box>
              {markedForReview.length > 0 && (
                <Box>
                  • You have {markedForReview.length} questions marked for review
                </Box>
              )}
              <Box>
                • Once submitted, you cannot make any changes to your answers
              </Box>
              {examSession.examType === 'MOCK' && (
                <Box>
                  • Unanswered questions will be marked as incorrect
                </Box>
              )}
            </SpaceBetween>
          </Alert>
        </SpaceBetween>
      </Modal>
    </div>
  )
}

export default ExamInterface