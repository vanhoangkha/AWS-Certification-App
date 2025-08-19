import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ContentLayout,
  Header,
  SpaceBetween,
  Button,
  Tabs,
  Alert,
  Box
} from '@cloudscape-design/components'
import { useAuth } from '@/contexts/AuthContext'
import PracticeInterface from '@/components/practice/PracticeInterface'
import CustomExamBuilder from '@/components/practice/CustomExamBuilder'
import PracticeSettings from '@/components/practice/PracticeSettings'

const PracticePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  
  const [activeTab, setActiveTab] = useState('practice')
  const [practiceSettings, setPracticeSettings] = useState({
    certification: searchParams.get('certification') || 'SAA-C03',
    domains: searchParams.get('domains')?.split(',') || [],
    difficulty: searchParams.get('difficulty') as 'EASY' | 'MEDIUM' | 'HARD' | undefined
  })

  const handleExamStarted = (sessionId: string) => {
    navigate(`/exam/${sessionId}`)
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  const tabs = [
    {
      id: 'practice',
      label: 'Practice Mode',
      content: (
        <PracticeInterface
          certification={practiceSettings.certification}
          domains={practiceSettings.domains.length > 0 ? practiceSettings.domains : ['Design Secure Architectures']}
          difficulty={practiceSettings.difficulty}
          onExit={handleBackToDashboard}
        />
      )
    },
    {
      id: 'custom',
      label: 'Custom Exam',
      content: (
        <CustomExamBuilder
          onExamStarted={handleExamStarted}
          onCancel={handleBackToDashboard}
        />
      )
    }
  ]

  if (!user) {
    return (
      <ContentLayout
        header={
          <Header variant="h1">
            Authentication Required
          </Header>
        }
      >
        <Alert type="warning" header="Please log in">
          You need to be logged in to access practice mode.
        </Alert>
      </ContentLayout>
    )
  }

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Practice with immediate feedback or create custom exams"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="normal"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
            </SpaceBetween>
          }
        >
          Practice & Custom Exams
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Welcome Message */}
        <Alert type="info" header="Welcome to Practice Mode">
          <SpaceBetween direction="vertical" size="s">
            <Box>
              <strong>Practice Mode:</strong> Answer questions one by one with immediate feedback, 
              explanations, and references to AWS documentation.
            </Box>
            <Box>
              <strong>Custom Exam:</strong> Create personalized exams with specific domains, 
              difficulty levels, and question counts.
            </Box>
          </SpaceBetween>
        </Alert>

        {/* Main Content */}
        <Tabs
          activeTabId={activeTab}
          onChange={({ detail }) => setActiveTab(detail.activeTabId)}
          tabs={tabs}
        />
      </SpaceBetween>
    </ContentLayout>
  )
}

export default PracticePage