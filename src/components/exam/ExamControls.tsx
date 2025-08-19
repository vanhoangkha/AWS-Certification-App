import React from 'react'
import {
  SpaceBetween,
  Button,
  Box
} from '@cloudscape-design/components'

interface ExamControlsProps {
  currentQuestionIndex: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  onMarkForReview: () => void
  onUnmarkForReview: () => void
  onEndExam: () => void
  isMarkedForReview: boolean
  hasAnswer: boolean
  isFirstQuestion: boolean
  isLastQuestion: boolean
  disabled?: boolean
}

const ExamControls: React.FC<ExamControlsProps> = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onMarkForReview,
  onUnmarkForReview,
  onEndExam,
  isMarkedForReview,
  hasAnswer,
  isFirstQuestion,
  isLastQuestion,
  disabled = false
}) => {
  return (
    <Box>
      <SpaceBetween direction="horizontal" size="s">
        {/* Previous Button */}
        <Button
          variant="normal"
          iconName="angle-left"
          onClick={onPrevious}
          disabled={isFirstQuestion || disabled}
        >
          Previous
        </Button>

        {/* Mark for Review Toggle */}
        <Button
          variant={isMarkedForReview ? 'normal' : 'link'}
          iconName={isMarkedForReview ? 'star-filled' : 'star'}
          onClick={isMarkedForReview ? onUnmarkForReview : onMarkForReview}
          disabled={disabled}
        >
          {isMarkedForReview ? 'Unmark for Review' : 'Mark for Review'}
        </Button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Question Counter */}
        <Box variant="small" color="text-status-inactive">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Box>

        {/* Next Button */}
        {!isLastQuestion ? (
          <Button
            variant="primary"
            iconName="angle-right"
            iconAlign="right"
            onClick={onNext}
            disabled={disabled}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            iconName="check"
            onClick={onEndExam}
            disabled={disabled}
          >
            End Exam
          </Button>
        )}
      </SpaceBetween>
    </Box>
  )
}

export default ExamControls