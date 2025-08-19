import React from 'react'
import {
  Modal,
  Box,
  SpaceBetween,
  Button,
  Alert,
  Table,
  Badge,
  Header
} from '@cloudscape-design/components'
import { useExamValidation } from '@/hooks/useExams'
import type { ExamSession } from '@/types'

interface ExamReviewModalProps {
  visible: boolean
  examSession: ExamSession
  onDismiss: () => void
  onSubmit: () => void
  onGoToQuestion: (index: number) => void
}

const ExamReviewModal: React.FC<ExamReviewModalProps> = ({
  visible,
  examSession,
  onDismiss,
  onSubmit,
  onGoToQuestion
}) => {
  const { data: validation } = useExamValidation(examSession)

  if (!validation) return null

  const getQuestionStatus = (questionIndex: number) => {
    const questionId = examSession.questions[questionIndex]
    const isAnswered = !!examSession.answers[questionId]
    const isMarked = examSession.markedForReview.includes(questionId)

    if (isMarked && isAnswered) return 'marked-answered'
    if (isMarked) return 'marked'
    if (isAnswered) return 'answered'
    return 'unanswered'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'answered':
        return <Badge color="green">Answered</Badge>
      case 'marked':
        return <Badge color="orange">Marked for Review</Badge>
      case 'marked-answered':
        return (
          <SpaceBetween direction="horizontal" size="xs">
            <Badge color="green">Answered</Badge>
            <Badge color="orange">Marked</Badge>
          </SpaceBetween>
        )
      default:
        return <Badge color="red">Not Answered</Badge>
    }
  }

  const reviewItems = examSession.questions.map((questionId, index) => ({
    questionNumber: index + 1,
    questionId,
    status: getQuestionStatus(index),
    index
  }))

  const columnDefinitions = [
    {
      id: 'questionNumber',
      header: 'Question',
      cell: (item: any) => (
        <Button
          variant="link"
          onClick={() => {
            onGoToQuestion(item.index)
            onDismiss()
          }}
        >
          Question {item.questionNumber}
        </Button>
      ),
      sortingField: 'questionNumber'
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item: any) => getStatusBadge(item.status),
      sortingField: 'status'
    }
  ]

  const getAlertType = () => {
    if (validation.unansweredQuestions === 0) return 'success'
    if (validation.unansweredQuestions <= 5) return 'warning'
    return 'error'
  }

  const getAlertHeader = () => {
    if (validation.unansweredQuestions === 0) return 'Ready to Submit'
    return 'Review Required'
  }

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      header="Review Your Exam"
      size="large"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Continue Exam
            </Button>
            <Button
              variant="primary"
              onClick={onSubmit}
              disabled={!validation.canSubmit}
            >
              Submit Exam
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Summary Alert */}
        <Alert type={getAlertType()} header={getAlertHeader()}>
          <SpaceBetween direction="vertical" size="s">
            <Box>
              <strong>Progress:</strong> {validation.completionPercentage}% complete 
              ({validation.answeredQuestions} of {validation.totalQuestions} questions answered)
            </Box>
            
            {validation.unansweredQuestions > 0 && (
              <Box>
                <strong>Unanswered Questions:</strong> {validation.unansweredQuestions} questions still need answers
              </Box>
            )}
            
            {validation.hasMarkedQuestions && (
              <Box>
                <strong>Marked for Review:</strong> {validation.markedForReview} questions marked for review
              </Box>
            )}

            {validation.unansweredQuestions === 0 && (
              <Box color="text-status-success">
                All questions have been answered. You can submit your exam now.
              </Box>
            )}

            {validation.unansweredQuestions > 0 && examSession.examType === 'MOCK' && (
              <Box color="text-status-warning">
                You can submit with unanswered questions, but they will be marked as incorrect.
              </Box>
            )}
          </SpaceBetween>
        </Alert>

        {/* Question Review Table */}
        <Table
          columnDefinitions={columnDefinitions}
          items={reviewItems}
          loadingText="Loading questions..."
          empty={
            <Box textAlign="center" color="inherit">
              <b>No questions found</b>
            </Box>
          }
          header={
            <Header
              counter={`(${validation.totalQuestions})`}
              description="Click on a question to navigate to it"
            >
              Question Status
            </Header>
          }
          sortingDisabled
        />

        {/* Submission Warning */}
        {examSession.examType === 'MOCK' && (
          <Alert type="warning" header="Important Notice">
            <SpaceBetween direction="vertical" size="s">
              <Box>
                • Once you submit this mock exam, you cannot make any changes
              </Box>
              <Box>
                • Unanswered questions will be marked as incorrect
              </Box>
              <Box>
                • Your results will be calculated and displayed immediately
              </Box>
              <Box>
                • Make sure you have reviewed all questions before submitting
              </Box>
            </SpaceBetween>
          </Alert>
        )}

        {/* Practice Mode Info */}
        {examSession.examType === 'PRACTICE' && (
          <Alert type="info" header="Practice Mode">
            In practice mode, you can review explanations and continue learning after submission.
          </Alert>
        )}
      </SpaceBetween>
    </Modal>
  )
}

export default ExamReviewModal