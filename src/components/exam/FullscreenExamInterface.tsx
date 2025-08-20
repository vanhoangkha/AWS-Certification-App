import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  SpaceBetween,
  Container,
  Header,
  Alert,
  Modal,
  ProgressBar,
  Badge,
  RadioGroup,
  Checkbox,
  Grid
} from '@cloudscape-design/components'
import type { Question, ExamSession } from '@/types'

interface FullscreenExamInterfaceProps {
  session: ExamSession
  questions: Question[]
  onAnswerChange: (questionId: string, answer: number[]) => void
  onMarkForReview: (questionId: string, marked: boolean) => void
  onSubmitExam: () => void
  onEndExam: () => void
}

const FullscreenExamInterface: React.FC<FullscreenExamInterfaceProps> = ({
  session,
  questions,
  onAnswerChange,
  onMarkForReview,
  onSubmitExam,
  onEndExam
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = session.answers[currentQuestion?.questionId] || []
  const isMarkedForReview = session.markedForReview.includes(currentQuestion?.questionId)

  // Timer logic
  useEffect(() => {
    const endTime = new Date(session.endTime).getTime()
    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, endTime - now)
      setTimeRemaining(remaining)
      
      if (remaining === 0) {
        onEndExam()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [session.endTime, onEndExam])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    const totalTime = session.timeLimit * 60 * 1000
    const percentage = (timeRemaining / totalTime) * 100
    if (percentage > 25) return 'text-status-success'
    if (percentage > 10) return 'text-status-warning'
    return 'text-status-error'
  }

  const handleAnswerChange = (selectedOptions: string[]) => {
    const answerIndices = selectedOptions.map(option => 
      currentQuestion.options.indexOf(option)
    ).filter(index => index !== -1)
    
    onAnswerChange(currentQuestion.questionId, answerIndices)
  }

  const getQuestionStatus = (index: number) => {
    const question = questions[index]
    const hasAnswer = session.answers[question.questionId]?.length > 0
    const isMarked = session.markedForReview.includes(question.questionId)
    
    if (isMarked && hasAnswer) return 'marked-answered'
    if (isMarked) return 'marked'
    if (hasAnswer) return 'answered'
    return 'unanswered'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'answered':
        return <Badge color="green">Answered</Badge>
      case 'marked':
        return <Badge color="blue">Marked</Badge>
      case 'marked-answered':
        return <Badge color="blue">Marked & Answered</Badge>
      default:
        return <Badge color="grey">Unanswered</Badge>
    }
  }

  const getAnsweredCount = () => {
    return Object.keys(session.answers).filter(
      questionId => session.answers[questionId]?.length > 0
    ).length
  }

  const getUnansweredQuestions = () => {
    return questions.filter(q => !session.answers[q.questionId]?.length)
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: '#fafafa',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Exam Header */}
      <div style={{ 
        backgroundColor: '#232f3e', 
        color: 'white', 
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <SpaceBetween direction="horizontal" size="l">
          <Box variant="h2" color="inherit">
            {session.certification} Mock Exam
          </Box>
          <Box color="inherit">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Box>
        </SpaceBetween>
        
        <SpaceBetween direction="horizontal" size="l">
          <Box color="inherit">
            Answered: {getAnsweredCount()}/{questions.length}
          </Box>
          <Box 
            fontSize="heading-m" 
            fontWeight="bold"
            color={getTimeColor()}
          >
            {formatTime(timeRemaining)}
          </Box>
        </SpaceBetween>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        {/* Main Question Area */}
        <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <SpaceBetween direction="vertical" size="l">
            {/* Question */}
            <Container>
              <SpaceBetween direction="vertical" size="m">
                <Header
                  variant="h3"
                  actions={
                    <Button
                      variant={isMarkedForReview ? "primary" : "normal"}
                      onClick={() => onMarkForReview(currentQuestion.questionId, !isMarkedForReview)}
                    >
                      {isMarkedForReview ? "Unmark for Review" : "Mark for Review"}
                    </Button>
                  }
                >
                  Question {currentQuestionIndex + 1}
                </Header>
                
                <Box fontSize="body-l">
                  {currentQuestion?.questionText}
                </Box>

                {/* Answer Options */}
                {currentQuestion?.questionType === 'MULTIPLE_CHOICE' ? (
                  <RadioGroup
                    value={currentAnswer.length > 0 ? currentQuestion.options[currentAnswer[0]] : ''}
                    onChange={({ detail }) => handleAnswerChange([detail.value])}
                    items={currentQuestion.options.map(option => ({
                      value: option,
                      label: option
                    }))}
                  />
                ) : (
                  <SpaceBetween direction="vertical" size="s">
                    <Box variant="small" color="text-status-info">
                      Select all that apply:
                    </Box>
                    {currentQuestion?.options.map((option, index) => (
                      <Checkbox
                        key={index}
                        checked={currentAnswer.includes(index)}
                        onChange={({ detail }) => {
                          const newAnswer = detail.checked
                            ? [...currentAnswer, index]
                            : currentAnswer.filter(i => i !== index)
                          onAnswerChange(currentQuestion.questionId, newAnswer)
                        }}
                      >
                        {option}
                      </Checkbox>
                    ))}
                  </SpaceBetween>
                )}
              </SpaceBetween>
            </Container>

            {/* Navigation Buttons */}
            <SpaceBetween direction="horizontal" size="s">
              <Button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              >
                Previous
              </Button>
              
              <Button
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              >
                Next
              </Button>
              
              <Button
                variant="normal"
                onClick={() => setShowReviewModal(true)}
              >
                Review All Questions
              </Button>
              
              <Button
                variant="primary"
                onClick={() => setShowSubmitModal(true)}
              >
                Submit Exam
              </Button>
            </SpaceBetween>
          </SpaceBetween>
        </div>

        {/* Question Navigator Sidebar */}
        <div style={{ 
          width: '300px', 
          backgroundColor: 'white', 
          borderLeft: '1px solid #e9ebed',
          padding: '24px',
          overflow: 'auto'
        }}>
          <SpaceBetween direction="vertical" size="m">
            <Header variant="h3">Question Navigator</Header>
            
            <ProgressBar
              value={(getAnsweredCount() / questions.length) * 100}
              additionalInfo={`${getAnsweredCount()} of ${questions.length} answered`}
            />

            <Grid
              gridDefinition={[
                { colspan: 6 },
                { colspan: 6 }
              ]}
            >
              {questions.map((_, index) => {
                const status = getQuestionStatus(index)
                const isCurrent = index === currentQuestionIndex
                
                return (
                  <Button
                    key={index}
                    variant={isCurrent ? "primary" : "normal"}
                    onClick={() => setCurrentQuestionIndex(index)}
                    fullWidth
                  >
                    <SpaceBetween direction="vertical" size="xs">
                      <Box>{index + 1}</Box>
                      {getStatusBadge(status)}
                    </SpaceBetween>
                  </Button>
                )
              })}
            </Grid>

            <SpaceBetween direction="vertical" size="s">
              <Box variant="h4">Legend</Box>
              <SpaceBetween direction="vertical" size="xs">
                <SpaceBetween direction="horizontal" size="s">
                  <Badge color="green">Answered</Badge>
                  <Box variant="small">Question answered</Box>
                </SpaceBetween>
                <SpaceBetween direction="horizontal" size="s">
                  <Badge color="blue">Marked</Badge>
                  <Box variant="small">Marked for review</Box>
                </SpaceBetween>
                <SpaceBetween direction="horizontal" size="s">
                  <Badge color="grey">Unanswered</Badge>
                  <Box variant="small">Not answered yet</Box>
                </SpaceBetween>
              </SpaceBetween>
            </SpaceBetween>
          </SpaceBetween>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        visible={showSubmitModal}
        onDismiss={() => setShowSubmitModal(false)}
        header="Submit Exam"
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowSubmitModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onSubmitExam}>
                Submit Exam
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          <Alert type="warning">
            Are you sure you want to submit your exam? You cannot change your answers after submission.
          </Alert>
          
          <SpaceBetween direction="vertical" size="s">
            <Box><strong>Exam Summary:</strong></Box>
            <Box>• Total Questions: {questions.length}</Box>
            <Box>• Answered: {getAnsweredCount()}</Box>
            <Box>• Unanswered: {questions.length - getAnsweredCount()}</Box>
            <Box>• Marked for Review: {session.markedForReview.length}</Box>
            <Box>• Time Remaining: {formatTime(timeRemaining)}</Box>
          </SpaceBetween>

          {getUnansweredQuestions().length > 0 && (
            <Alert type="info">
              You have {getUnansweredQuestions().length} unanswered questions. 
              These will be marked as incorrect.
            </Alert>
          )}
        </SpaceBetween>
      </Modal>

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        onDismiss={() => setShowReviewModal(false)}
        header="Review All Questions"
        closeAriaLabel="Close modal"
        size="large"
        footer={
          <Box float="right">
            <Button variant="primary" onClick={() => setShowReviewModal(false)}>
              Close
            </Button>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          <Grid
            gridDefinition={[
              { colspan: 2 },
              { colspan: 2 },
              { colspan: 2 },
              { colspan: 2 },
              { colspan: 2 },
              { colspan: 2 }
            ]}
          >
            {questions.map((question, index) => {
              const status = getQuestionStatus(index)
              return (
                <Button
                  key={index}
                  variant="normal"
                  onClick={() => {
                    setCurrentQuestionIndex(index)
                    setShowReviewModal(false)
                  }}
                  fullWidth
                >
                  <SpaceBetween direction="vertical" size="xs">
                    <Box>Q{index + 1}</Box>
                    {getStatusBadge(status)}
                  </SpaceBetween>
                </Button>
              )
            })}
          </Grid>
        </SpaceBetween>
      </Modal>
    </div>
  )
}

export default FullscreenExamInterface