import React, { useState, useEffect } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Button,
  Alert,
  Modal,
  Badge,
  ProgressBar
} from '@cloudscape-design/components'
import { useNextPracticeQuestion, usePracticeMode } from '@/hooks/useQuestions'
import QuestionDisplay from '@/components/exam/QuestionDisplay'
import PracticeResults from './PracticeResults'
import PracticeSettings from './PracticeSettings'
import type { Question, Answer } from '@/types'

interface PracticeInterfaceProps {
  certification: string
  domains: string[]
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
  onExit?: () => void
}

const PracticeInterface: React.FC<PracticeInterfaceProps> = ({
  certification,
  domains,
  difficulty,
  onExit
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([])
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    totalQuestions: 0,
    correctCount: 0,
    startTime: Date.now(),
    timeSpent: 0
  })

  const {
    practiceSession,
    startPracticeSession,
    updatePracticeSession,
    endPracticeSession
  } = usePracticeMode()

  const { data: nextQuestion, refetch: fetchNextQuestion } = useNextPracticeQuestion(
    certification,
    domains,
    difficulty,
    answeredQuestions
  )

  // Initialize practice session
  useEffect(() => {
    if (!practiceSession) {
      startPracticeSession(certification, domains)
    }
  }, [certification, domains, practiceSession, startPracticeSession])

  // Load first question
  useEffect(() => {
    if (nextQuestion && !currentQuestion) {
      setCurrentQuestion(nextQuestion)
    }
  }, [nextQuestion, currentQuestion])

  const handleAnswerSubmit = (answer: Answer) => {
    if (!currentQuestion) return

    setCurrentAnswer(answer)
    setShowExplanation(true)

    // Check if answer is correct
    const isCorrect = answer.selectedOptions.length === currentQuestion.correctAnswers.length &&
      answer.selectedOptions.every(option => currentQuestion.correctAnswers.includes(option))

    // Update statistics
    const newAnsweredQuestions = [...answeredQuestions, currentQuestion.questionId]
    const newCorrectAnswers = isCorrect ? [...correctAnswers, currentQuestion.questionId] : correctAnswers

    setAnsweredQuestions(newAnsweredQuestions)
    setCorrectAnswers(newCorrectAnswers)

    setSessionStats(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctCount: newCorrectAnswers.length,
      timeSpent: Math.floor((Date.now() - prev.startTime) / 1000)
    }))

    // Update practice session
    updatePracticeSession({
      currentQuestionIndex: newAnsweredQuestions.length,
      answeredQuestions: newAnsweredQuestions,
      correctAnswers: newCorrectAnswers.length
    })
  }

  const handleNextQuestion = async () => {
    setCurrentQuestion(null)
    setCurrentAnswer(null)
    setShowExplanation(false)

    // Fetch next question
    await fetchNextQuestion()
    
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion)
    } else {
      // No more questions available
      setShowResults(true)
    }
  }

  const handleEndSession = () => {
    setShowResults(true)
  }

  const handleRestartSession = () => {
    setCurrentQuestion(null)
    setCurrentAnswer(null)
    setShowExplanation(false)
    setAnsweredQuestions([])
    setCorrectAnswers([])
    setShowResults(false)
    setSessionStats({
      totalQuestions: 0,
      correctCount: 0,
      startTime: Date.now(),
      timeSpent: 0
    })
    
    // Start new session
    endPracticeSession()
    startPracticeSession(certification, domains)
    fetchNextQuestion()
  }

  const getPerformanceColor = () => {
    if (sessionStats.totalQuestions === 0) return 'blue'
    const percentage = (sessionStats.correctCount / sessionStats.totalQuestions) * 100
    if (percentage >= 80) return 'green'
    if (percentage >= 60) return 'orange'
    return 'red'
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  if (showResults) {
    return (
      <PracticeResults
        sessionStats={sessionStats}
        certification={certification}
        domains={domains}
        onRestart={handleRestartSession}
        onExit={onExit}
      />
    )
  }

  if (!currentQuestion) {
    return (
      <Container
        header={
          <Header variant="h2">
            Practice Mode
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="l">
          <Alert type="info" header="Loading Practice Question">
            Preparing your next practice question...
          </Alert>
          <Box textAlign="center">
            <Button variant="link" onClick={onExit}>
              Exit Practice Mode
            </Button>
          </Box>
        </SpaceBetween>
      </Container>
    )
  }

  return (
    <>
      <Container
        header={
          <Header
            variant="h2"
            description={`${certification} Practice Mode`}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="normal"
                  iconName="settings"
                  onClick={() => setShowSettings(true)}
                >
                  Settings
                </Button>
                <Button
                  variant="normal"
                  onClick={handleEndSession}
                >
                  End Session
                </Button>
                <Button
                  variant="link"
                  onClick={onExit}
                >
                  Exit
                </Button>
              </SpaceBetween>
            }
          >
            Practice Mode
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="l">
          {/* Session Statistics */}
          <Alert type="info" header="Practice Session Progress">
            <SpaceBetween direction="horizontal" size="l">
              <Box>
                <Box variant="awsui-key-label">Questions Answered</Box>
                <Box variant="h3">{sessionStats.totalQuestions}</Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Correct Answers</Box>
                <Box variant="h3" color="text-status-success">
                  {sessionStats.correctCount}
                </Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Accuracy</Box>
                <Box variant="h3">
                  <Badge color={getPerformanceColor()}>
                    {sessionStats.totalQuestions > 0 
                      ? Math.round((sessionStats.correctCount / sessionStats.totalQuestions) * 100)
                      : 0}%
                  </Badge>
                </Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Time Spent</Box>
                <Box variant="h3">{formatTime(sessionStats.timeSpent)}</Box>
              </Box>
            </SpaceBetween>
          </Alert>

          {/* Current Question */}
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={sessionStats.totalQuestions + 1}
            totalQuestions={sessionStats.totalQuestions + 1}
            currentAnswer={currentAnswer}
            onAnswerChange={handleAnswerSubmit}
            showExplanation={showExplanation}
            showCorrectAnswer={showExplanation}
            isReviewMode={showExplanation}
          />

          {/* Practice Controls */}
          <SpaceBetween direction="horizontal" size="s">
            {showExplanation ? (
              <Button
                variant="primary"
                iconName="angle-right"
                iconAlign="right"
                onClick={handleNextQuestion}
              >
                Next Question
              </Button>
            ) : (
              <Box variant="small" color="text-status-inactive">
                Select your answer to see the explanation and continue.
              </Box>
            )}

            <div style={{ flex: 1 }} />

            <Button
              variant="normal"
              onClick={handleEndSession}
            >
              End Session
            </Button>
          </SpaceBetween>

          {/* Practice Mode Instructions */}
          {sessionStats.totalQuestions === 0 && (
            <Alert type="success" header="Practice Mode Instructions">
              <SpaceBetween direction="vertical" size="s">
                <Box>• Answer each question at your own pace</Box>
                <Box>• Explanations and references are shown immediately after answering</Box>
                <Box>• Focus on learning rather than speed</Box>
                <Box>• You can end the session at any time to review your progress</Box>
              </SpaceBetween>
            </Alert>
          )}
        </SpaceBetween>
      </Container>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        onDismiss={() => setShowSettings(false)}
        header="Practice Settings"
        footer={
          <Box float="right">
            <Button variant="primary" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </Box>
        }
      >
        <PracticeSettings
          certification={certification}
          domains={domains}
          difficulty={difficulty}
          onSettingsChange={(newSettings) => {
            // Handle settings change
            console.log('Settings changed:', newSettings)
            setShowSettings(false)
          }}
        />
      </Modal>
    </>
  )
}

export default PracticeInterface