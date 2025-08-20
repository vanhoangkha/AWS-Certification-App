import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Alert,
  Box,
  Modal,
  ProgressBar,
  Select,
  FormField
} from '@cloudscape-design/components'
import { useAuth } from '@/contexts/AuthContext'
import { useExams } from '@/hooks/useExams-simple'
import { useQuestions } from '@/hooks/useQuestions'
import FullscreenExamInterface from '@/components/exam/FullscreenExamInterface'
import type { ExamSession, StartExamInput, Question } from '@/types'

const ExamPage: React.FC = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentSession, setCurrentSession] = useState<ExamSession | null>(null)
  const [examQuestions, setExamQuestions] = useState<Question[]>([])
  const [showStartModal, setShowStartModal] = useState(!sessionId)
  const [examConfig, setExamConfig] = useState<StartExamInput>({
    userId: user?.userId || '',
    examType: 'MOCK_EXAM',
    certification: 'CLF-C01',
    questionCount: 65,
    timeLimit: 130
  })

  const {
    startExam,
    getExamSession,
    saveExamProgress,
    submitExam,
    isLoading
  } = useExams()

  const { data: questionsData } = useQuestions({
    certification: examConfig.certification,
    limit: 100
  })

  const certificationOptions = [
    { label: 'AWS Certified Cloud Practitioner (CLF-C01)', value: 'CLF-C01' },
    { label: 'AWS Certified Solutions Architect - Associate (SAA-C03)', value: 'SAA-C03' },
    { label: 'AWS Certified Developer - Associate (DVA-C01)', value: 'DVA-C01' },
    { label: 'AWS Certified SysOps Administrator - Associate (SOA-C02)', value: 'SOA-C02' }
  ]

  const questionCountOptions = [
    { label: '25 questions (Practice)', value: '25' },
    { label: '50 questions (Extended Practice)', value: '50' },
    { label: '65 questions (Full Mock Exam)', value: '65' }
  ]

  const timeLimitOptions = [
    { label: '45 minutes', value: '45' },
    { label: '90 minutes (CLF-C01)', value: '90' },
    { label: '130 minutes (Associate Level)', value: '130' },
    { label: '180 minutes (Professional Level)', value: '180' }
  ]

  useEffect(() => {
    if (sessionId) {
      loadExamSession(sessionId)
    }
  }, [sessionId])

  const loadExamSession = async (id: string) => {
    try {
      const session = await getExamSession(id)
      if (session) {
        setCurrentSession(session)
        // Load questions for this session
        const questions = (questionsData as any)?.questions || []
        const sessionQuestions = questions.filter((q: Question) => 
          session.questions.includes(q.questionId)
        )
        setExamQuestions(sessionQuestions)
        setShowStartModal(false)
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Failed to load exam session:', error)
      navigate('/dashboard')
    }
  }

  const handleStartExam = async () => {
    try {
      const session = await startExam(examConfig)
      setCurrentSession(session)
      
      // Get questions for the exam
      const questions = (questionsData as any)?.questions || []
      const examQuestions = questions
        .filter((q: Question) => q.certification === examConfig.certification)
        .slice(0, examConfig.questionCount)
      
      setExamQuestions(examQuestions)
      setShowStartModal(false)
      
      // Update URL with session ID
      navigate(`/exam/${session.sessionId}`, { replace: true })
    } catch (error) {
      console.error('Failed to start exam:', error)
    }
  }

  const handleAnswerChange = async (questionId: string, answer: number[]) => {
    if (!currentSession) return

    try {
      const updatedSession = await saveExamProgress({
        sessionId: currentSession.sessionId,
        answers: { [questionId]: answer },
        markedForReview: currentSession.markedForReview
      })
      setCurrentSession(updatedSession)
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  const handleMarkForReview = async (questionId: string, marked: boolean) => {
    if (!currentSession) return

    const updatedMarked = marked
      ? [...currentSession.markedForReview, questionId]
      : currentSession.markedForReview.filter(id => id !== questionId)

    try {
      const updatedSession = await saveExamProgress({
        sessionId: currentSession.sessionId,
        answers: {},
        markedForReview: updatedMarked
      })
      setCurrentSession(updatedSession)
    } catch (error) {
      console.error('Failed to update review status:', error)
    }
  }

  const handleSubmitExam = async () => {
    if (!currentSession) return

    try {
      const result = await submitExam(currentSession.sessionId)
      navigate(`/results/${result.resultId}`)
    } catch (error) {
      console.error('Failed to submit exam:', error)
    }
  }

  const handleEndExam = () => {
    if (currentSession) {
      handleSubmitExam()
    }
  }

  if (showStartModal) {
    return (
      <Container
        header={
          <Header variant="h1">
            AWS Certification Mock Exam
          </Header>
        }
      >
        <Modal
          visible={showStartModal}
          onDismiss={() => navigate('/dashboard')}
          header="Configure Your Mock Exam"
          closeAriaLabel="Close modal"
          size="medium"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  loading={isLoading}
                  onClick={handleStartExam}
                >
                  Start Exam
                </Button>
              </SpaceBetween>
            </Box>
          }
        >
          <SpaceBetween direction="vertical" size="l">
            <Alert type="info" header="Pearson VUE-Style Exam Experience">
              This mock exam replicates the real AWS certification testing environment with:
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Fullscreen exam interface</li>
                <li>Timed questions with countdown</li>
                <li>Question navigator and review system</li>
                <li>No immediate feedback during exam</li>
                <li>AWS-style scaled scoring (100-1000)</li>
              </ul>
            </Alert>

            <SpaceBetween direction="vertical" size="m">
              <FormField label="Certification">
                <Select
                  selectedOption={certificationOptions.find(opt => opt.value === examConfig.certification)}
                  onChange={({ detail }) => setExamConfig(prev => ({ 
                    ...prev, 
                    certification: detail.selectedOption.value! as any 
                  }))}
                  options={certificationOptions}
                />
              </FormField>

              <FormField label="Number of Questions">
                <Select
                  selectedOption={questionCountOptions.find(opt => parseInt(opt.value) === examConfig.questionCount) || null}
                  onChange={({ detail }) => setExamConfig(prev => ({ 
                    ...prev, 
                    questionCount: parseInt(detail.selectedOption.value!) 
                  }))}
                  options={questionCountOptions}
                />
              </FormField>

              <FormField label="Time Limit">
                <Select
                  selectedOption={timeLimitOptions.find(opt => parseInt(opt.value) === examConfig.timeLimit) || null}
                  onChange={({ detail }) => setExamConfig(prev => ({ 
                    ...prev, 
                    timeLimit: parseInt(detail.selectedOption.value!) 
                  }))}
                  options={timeLimitOptions}
                />
              </FormField>
            </SpaceBetween>

            <Alert type="warning" header="Important Exam Instructions">
              <ul style={{ paddingLeft: '20px' }}>
                <li>Ensure you have a stable internet connection</li>
                <li>Find a quiet environment without distractions</li>
                <li>The timer cannot be paused once started</li>
                <li>You can mark questions for review and return to them</li>
                <li>Submit your exam before time expires</li>
              </ul>
            </Alert>
          </SpaceBetween>
        </Modal>
      </Container>
    )
  }

  if (!currentSession || examQuestions.length === 0) {
    return (
      <Container>
        <Box textAlign="center">
          <SpaceBetween direction="vertical" size="m">
            <Box variant="h2">Loading exam...</Box>
            <ProgressBar value={50} />
            <Box variant="p">Preparing your exam questions and interface</Box>
          </SpaceBetween>
        </Box>
      </Container>
    )
  }

  return (
    <FullscreenExamInterface
      session={currentSession}
      questions={examQuestions}
      onAnswerChange={handleAnswerChange}
      onMarkForReview={handleMarkForReview}
      onSubmitExam={handleSubmitExam}
      onEndExam={handleEndExam}
    />
  )
}

export default ExamPage