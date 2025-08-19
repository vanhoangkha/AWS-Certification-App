import React from 'react'
import {
  ContentLayout,
  Header,
  SpaceBetween,
  Button
} from '@cloudscape-design/components'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import DashboardOverview from '@/components/dashboard/DashboardOverview'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Your AWS certification practice dashboard"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="normal"
                onClick={() => navigate('/practice')}
              >
                Practice Questions
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/exam/mock')}
              >
                Take Mock Exam
              </Button>
            </SpaceBetween>
          }
        >
          Dashboard
        </Header>
      }
    >
      <DashboardOverview />
    </ContentLayout>
  )
}

export default DashboardPage