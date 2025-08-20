import React, { useState, useEffect } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  Badge,
  RadioGroup,
  Checkbox,
  Alert,
  Modal,
  ProgressBar,
  Grid
} from '@cloudscape-design/components'

interface ExamInterfaceProps {
  onExit: () => void
}

const ProfessionalExamInterface: React.FC<ExamInterfaceProps> = ({ onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(130 * 60) // 130 minutes in seconds
  const [answers, setAnswers] = useState<Record<number, number[]>>({})
  const [markedForReview, setMarkedForReview] = useState<number[]>([])
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  // Mock questions
  const questions = [
    {
      id: 1,
      text: "What is the AWS shared responsibility model?",
      type: "single",
      options: [
        "AWS is responsible for everything",
        "Customer is responsible for everything",
        "AWS and customer share security responsibilities",
        "Only AWS support handles security"
      ],
      correct: [2]
    },
    {
      id: 2,
      text: "Which of the following are benefits of cloud computing? (Select TWO)",
      type: "multiple",
      options: [
        "Increased speed and agility",
        "Higher upfront capital expenses", 
        "Variable expense instead of capital expense",
        "Decreased security",
        "Limited global reach"
      ],
      correct: [0, 2]
    }
  ]

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setShowSubmitModal(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    const totalTime = 130 * 60
    const percentage = (timeRemaining / totalTime) * 100
    if (percentage > 25) return 'text-status-success'
    if (percentage > 10) return 'text-status-warning'
    return 'text-status-error'
  }

  const handleAnswerChange = (questionIndex: number, selectedOptions: number[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOptions
    }))
  }

  const getQuestionStatus = (index: number) => {
    const hasAnswer = answers[index]?.length > 0
    const isMarked = markedForReview.includes(index)
    
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

  const answeredCount = Object.keys(answers).filter(key => answers[parseInt(key)]?.length > 0).length

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: '#fafbfc',
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
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <SpaceBetween direction="horizontal" size="l">
          <Box variant="h2" color="inherit">
            AWS Cloud Practitioner Mock Exam
          </Box>
          <Box color="inherit">
            Question {currentQuestion + 1} of {questions.length}
          </Box>
        </SpaceBetween>
        
        <SpaceBetween direction="horizontal" size="l">
          <Box color="inherit">
            Answered: {answeredCount}/{questions.length}
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
        <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          <SpaceBetween direction="vertical" size="l">
            <Container>
              <SpaceBetween direction="vertical" size="l">
                <Header
                  variant="h2"
                  actions={
                    <Button
                      variant={markedForReview.includes(currentQuestion) ? "primary" : "normal"}
                      onClick={() => {
                        if (markedForReview.includes(currentQuestion)) {
                          setMarkedForReview(prev => prev.filter(q => q !== currentQuestion))
                        } else {
                          setMarkedForReview(prev => [...prev, currentQuestion])
                        }
                      }}
                    >
                      {markedForReview.includes(currentQuestion) ? "Unmark for Review" : "Mark for Review"}
                    </Button>
                  }
                >
                  Question {currentQuestion + 1}
                </Header>
                
                <Box fontSize="body-l" padding="s">
                  {questions[currentQuestion]?.text}
                </Box>

                {/* Answer Options */}
                <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  {questions[currentQuestion]?.type === 'single' ? (
                    <RadioGroup
                      value={answers[currentQuestion]?.[0] !== undefined ? 
                        questions[currentQuestion].options[answers[currentQuestion][0]] : ''}
                      onChange={({ detail }) => {
                        const optionIndex = questions[currentQuestion].options.indexOf(detail.value)
                        if (optionIndex !== -1) {
                          handleAnswerChange(currentQuestion, [optionIndex])
                        }
                      }}
                      items={questions[currentQuestion].options.map(option => ({
                        value: option,
                        label: option
                      }))}
                    />
                  ) : (
                    <SpaceBetween direction="vertical" size="s">
                      <Alert type="info">
                        Select all that apply:
                      </Alert>
                      {questions[currentQuestion]?.options.map((option, index) => (
                        <Checkbox
                          key={index}
                          checked={answers[currentQuestion]?.includes(index) || false}
                          onChange={({ detail }) => {
                            const currentAnswers = answers[currentQuestion] || []
                            const newAnswers = detail.checked
                              ? [...currentAnswers, index]
                              : currentAnswers.filter(i => i !== index)
                            handleAnswerChange(currentQuestion, newAnswers)
                          }}
                        >
                          {option}
                        </Checkbox>
                      ))}
                    </SpaceBetween>
                  )}
                </div>
              </SpaceBetween>
            </Container>

            {/* Navigation */}
            <SpaceBetween direction="horizontal" size="s">
              <Button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(prev => prev - 1)}
              >
                Previous
              </Button>
              
              <Button
                disabled={currentQuestion === questions.length - 1}
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next
              </Button>
              
              <div style={{ flex: 1 }} />
              
              <Button
                variant="normal"
                onClick={onExit}
              >
                Exit Exam
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

        {/* Question Navigator */}
        <div style={{ 
          width: '320px', 
          backgroundColor: 'white', 
          borderLeft: '1px solid #e9ebed',
          padding: '24px',
          overflow: 'auto',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.05)'
        }}>
          <SpaceBetween direction="vertical" size="m">
            <Header variant="h3">Question Navigator</Header>
            
            <ProgressBar
              value={(answeredCount / questions.length) * 100}
              additionalInfo={`${answeredCount} of ${questions.length} answered`}
            />

            <Grid
              gridDefinition={[
                { colspan: 6 },
                { colspan: 6 }
              ]}
            >
              {questions.map((_, index) => {
                const status = getQuestionStatus(index)
                const isCurrent = index === currentQuestion
                
                return (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <Button
                      variant={isCurrent ? "primary" : "normal"}
                      onClick={() => setCurrentQuestion(index)}
                      fullWidth
                    >
                      <SpaceBetween direction="vertical" size="xs">
                        <Box fontWeight="bold">{index + 1}</Box>
                        {getStatusBadge(status)}
                      </SpaceBetween>
                    </Button>
                  </div>
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

      {/* Submit Modal */}
      <Modal
        visible={showSubmitModal}
        onDismiss={() => setShowSubmitModal(false)}
        header="Submit Exam"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowSubmitModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onExit}>
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
            <Box>• Answered: {answeredCount}</Box>
            <Box>• Unanswered: {questions.length - answeredCount}</Box>
            <Box>• Marked for Review: {markedForReview.length}</Box>
            <Box>• Time Remaining: {formatTime(timeRemaining)}</Box>
          </SpaceBetween>
        </SpaceBetween>
      </Modal>
    </div>
  )
}

export default ProfessionalExamInterface