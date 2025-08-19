import React from 'react'
import {
  Header,
  SpaceBetween,
  Box,
  Badge,
  Button,
  Alert,
  ProgressBar
} from '@cloudscape-design/components'
import { useExamTimer } from '@/hooks/useExams'
import type { ExamSession } from '@/types'

interface ExamHeaderProps {
  examSession: ExamSession
  currentQuestionIndex: number
  onEndExam: () => void
  onReviewMode?: () => void
  showReviewButton?: boolean
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
  examSession,
  currentQuestionIndex,
  onEndExam,
  onReviewMode,
  showReviewButton = false
}) => {
  const { data: timer } = useExamTimer(
    examSession.startTime,
    examSession.timeLimit,
    onEndExam // Auto-submit when time is up
  )

  const getExamTypeBadge = (type: string) => {
    const colorMap = {
      MOCK: 'blue',
      PRACTICE: 'green',
      CUSTOM: 'purple'
    }
    return (
      <Badge color={colorMap[type as keyof typeof colorMap] || 'grey'}>
        {type} EXAM
      </Badge>
    )
  }

  const getTimerColor = () => {
    if (!timer) return 'blue'
    if (timer.isCritical) return 'red'
    if (timer.isWarning) return 'orange'
    return 'blue'
  }

  const progress = examSession.questions.length > 0 
    ? ((currentQuestionIndex + 1) / examSession.questions.length) * 100 
    : 0

  return (
    <div className="exam-header">
      <Header
        variant="h2"
        description={`${examSession.certification} - ${examSession.examType} Mode`}
        actions={
          <SpaceBetween direction="horizontal" size="s">
            {showReviewButton && (
              <Button variant="normal" onClick={onReviewMode}>
                Review Questions
              </Button>
            )}
            <Button variant="primary" onClick={onEndExam}>
              End Exam
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween direction="horizontal" size="m">
          <Box>AWS Certification Practice</Box>
          {getExamTypeBadge(examSession.examType)}
        </SpaceBetween>
      </Header>

      <SpaceBetween direction="vertical" size="s">
        {/* Timer and Progress */}
        <SpaceBetween direction="horizontal" size="l">
          {/* Timer */}
          <Box>
            <SpaceBetween direction="horizontal" size="s">
              <Box variant="awsui-key-label">Time Remaining:</Box>
              <Box 
                className={`exam-timer ${timer?.isWarning ? 'warning' : ''} ${timer?.isCritical ? 'critical' : ''}`}
                color={timer?.isCritical ? 'text-status-error' : timer?.isWarning ? 'text-status-warning' : 'inherit'}
              >
                {timer?.formattedTime || '00:00'}
              </Box>
            </SpaceBetween>
          </Box>

          {/* Question Progress */}
          <Box>
            <SpaceBetween direction="horizontal" size="s">
              <Box variant="awsui-key-label">Question:</Box>
              <Box>
                {currentQuestionIndex + 1} of {examSession.questions.length}
              </Box>
            </SpaceBetween>
          </Box>

          {/* Answered Count */}
          <Box>
            <SpaceBetween direction="horizontal" size="s">
              <Box variant="awsui-key-label">Answered:</Box>
              <Box>
                {Object.keys(examSession.answers).length} of {examSession.questions.length}
              </Box>
            </SpaceBetween>
          </Box>

          {/* Marked for Review */}
          {examSession.markedForReview.length > 0 && (
            <Box>
              <SpaceBetween direction="horizontal" size="s">
                <Box variant="awsui-key-label">Marked for Review:</Box>
                <Badge color="orange">{examSession.markedForReview.length}</Badge>
              </SpaceBetween>
            </Box>
          )}
        </SpaceBetween>

        {/* Progress Bar */}
        <ProgressBar
          value={progress}
          additionalInfo={`${Math.round(progress)}% complete`}
          description="Exam progress"
          variant={timer?.isCritical ? 'error' : timer?.isWarning ? 'warning' : undefined}
        />

        {/* Time Warnings */}
        {timer?.isWarning && !timer.isCritical && (
          <Alert type="warning" header="Time Warning">
            You have less than 10 minutes remaining. Please manage your time carefully.
          </Alert>
        )}

        {timer?.isCritical && (
          <Alert type="error" header="Critical Time Warning">
            You have less than 5 minutes remaining! The exam will auto-submit when time expires.
          </Alert>
        )}

        {/* Exam Instructions for Mock Mode */}
        {examSession.examType === 'MOCK' && currentQuestionIndex === 0 && (
          <Alert type="info" header="Mock Exam Instructions">
            <SpaceBetween direction="vertical" size="s">
              <Box>• This is a timed mock exam simulating the real AWS certification experience</Box>
              <Box>• You have {examSession.timeLimit} minutes to complete {examSession.questions.length} questions</Box>
              <Box>• You can mark questions for review and return to them later</Box>
              <Box>• Correct answers and explanations will be shown after submission</Box>
              <Box>• The exam will auto-submit when time expires</Box>
            </SpaceBetween>
          </Alert>
        )}

        {/* Practice Mode Info */}
        {examSession.examType === 'PRACTICE' && (
          <Alert type="success" header="Practice Mode">
            Take your time to learn. Explanations and references are available after each question.
          </Alert>
        )}
      </SpaceBetween>
    </div>
  )
}

export default ExamHeader