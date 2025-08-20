import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Tabs,
  Grid,
  Box,
  Badge,
  Cards,
  Icon,
  Alert
} from '@cloudscape-design/components'
import { useNavigate } from 'react-router-dom'

const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Mock admin data
  const adminStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalQuestions: 2156,
    examsTaken: 3421,
    passRate: 73,
    avgScore: 78
  }

  const recentActivity = [
    {
      type: 'user',
      action: 'New user registration',
      user: 'john.doe@example.com',
      timestamp: '2 minutes ago',
      icon: 'user-profile'
    },
    {
      type: 'exam',
      action: 'Mock exam completed',
      user: 'jane.smith@example.com',
      score: 85,
      timestamp: '5 minutes ago',
      icon: 'edit'
    },
    {
      type: 'question',
      action: 'Question bank updated',
      user: 'admin@platform.com',
      count: 25,
      timestamp: '1 hour ago',
      icon: 'add-plus'
    }
  ]

  const quickActions = [
    {
      title: 'Question Bank',
      description: 'Manage exam questions and content',
      icon: 'folder',
      color: '#146EB4',
      action: () => setActiveTab('questions'),
      badge: `${adminStats.totalQuestions} questions`
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: 'user-profile',
      color: '#037F0C',
      action: () => setActiveTab('users'),
      badge: `${adminStats.totalUsers} users`
    },
    {
      title: 'Exam Builder',
      description: 'Create custom exam templates',
      icon: 'settings',
      color: '#FF9900',
      action: () => setActiveTab('exam-builder'),
      badge: 'New'
    },
    {
      title: 'Analytics',
      description: 'Platform insights and reports',
      icon: 'analytics',
      color: '#7D2105',
      action: () => setActiveTab('analytics'),
      badge: 'Advanced'
    }
  ]

  const dashboardContent = (
    <SpaceBetween direction="vertical" size="l">
      <Alert type="success" header="Admin Studio">
        Welcome to the administrative dashboard. Monitor platform performance, manage content, and analyze user engagement.
      </Alert>

      {/* Key Metrics */}
      <Grid
        gridDefinition={[
          { colspan: { default: 12, xs: 6, s: 4 } },
          { colspan: { default: 12, xs: 6, s: 4 } },
          { colspan: { default: 12, xs: 6, s: 4 } },
          { colspan: { default: 12, xs: 6, s: 4 } },
          { colspan: { default: 12, xs: 6, s: 4 } },
          { colspan: { default: 12, xs: 6, s: 4 } }
        ]}
      >
        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Total Users</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
              {adminStats.totalUsers.toLocaleString()}
            </Box>
            <SpaceBetween direction="horizontal" size="xs">
              <Icon name="status-positive" variant="success" />
              <Box variant="small" color="text-status-success">+12% this month</Box>
            </SpaceBetween>
          </SpaceBetween>
        </Container>

        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Active Users</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-success">
              {adminStats.activeUsers.toLocaleString()}
            </Box>
            <SpaceBetween direction="horizontal" size="xs">
              <Icon name="status-positive" variant="success" />
              <Box variant="small" color="text-status-success">+8% this week</Box>
            </SpaceBetween>
          </SpaceBetween>
        </Container>

        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Total Questions</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
              {adminStats.totalQuestions.toLocaleString()}
            </Box>
            <SpaceBetween direction="horizontal" size="xs">
              <Icon name="status-positive" variant="success" />
              <Box variant="small" color="text-status-success">+25 this week</Box>
            </SpaceBetween>
          </SpaceBetween>
        </Container>

        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Exams Taken</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-warning">
              {adminStats.examsTaken.toLocaleString()}
            </Box>
            <SpaceBetween direction="horizontal" size="xs">
              <Icon name="status-positive" variant="success" />
              <Box variant="small" color="text-status-success">+15% this month</Box>
            </SpaceBetween>
          </SpaceBetween>
        </Container>

        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Pass Rate</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-success">
              {adminStats.passRate}%
            </Box>
            <SpaceBetween direction="horizontal" size="xs">
              <Icon name="status-positive" variant="success" />
              <Box variant="small" color="text-status-success">+3% improvement</Box>
            </SpaceBetween>
          </SpaceBetween>
        </Container>

        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Average Score</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
              {adminStats.avgScore}%
            </Box>
            <SpaceBetween direction="horizontal" size="xs">
              <Icon name="status-positive" variant="success" />
              <Box variant="small" color="text-status-success">+2% this month</Box>
            </SpaceBetween>
          </SpaceBetween>
        </Container>
      </Grid>

      {/* Quick Actions */}
      <Container
        header={
          <Header variant="h2" description="Administrative tools and management">
            Quick Actions
          </Header>
        }
      >
        <Cards
          cardDefinition={{
            header: (item: any) => (
              <SpaceBetween direction="horizontal" size="s" alignItems="center">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon name={item.icon} variant="inverted" />
                </div>
                <SpaceBetween direction="vertical" size="none">
                  <Box variant="h3">{item.title}</Box>
                  <Badge color="blue">{item.badge}</Badge>
                </SpaceBetween>
              </SpaceBetween>
            ),
            sections: [
              {
                content: (item: any) => (
                  <SpaceBetween direction="vertical" size="m">
                    <Box variant="p">{item.description}</Box>
                    <Button
                      variant="normal"
                      onClick={item.action}
                      fullWidth
                    >
                      Open {item.title}
                    </Button>
                  </SpaceBetween>
                )
              }
            ]
          }}
          items={quickActions}
          loadingText="Loading actions"
          cardsPerRow={[
            { cards: 1 },
            { minWidth: 500, cards: 2 },
            { minWidth: 800, cards: 4 }
          ]}
        />
      </Container>

      {/* Recent Activity */}
      <Container
        header={
          <Header variant="h2" description="Latest platform activity">
            Recent Activity
          </Header>
        }
      >
        <Cards
          cardDefinition={{
            header: (item: any) => (
              <SpaceBetween direction="horizontal" size="s" alignItems="center">
                <Icon name={item.icon} />
                <SpaceBetween direction="vertical" size="none">
                  <Box variant="h4">{item.action}</Box>
                  <Box variant="small" color="text-status-inactive">{item.timestamp}</Box>
                </SpaceBetween>
              </SpaceBetween>
            ),
            sections: [
              {
                content: (item: any) => (
                  <SpaceBetween direction="vertical" size="s">
                    <Box><strong>User:</strong> {item.user}</Box>
                    {item.score && <Box><strong>Score:</strong> {item.score}%</Box>}
                    {item.count && <Box><strong>Questions Added:</strong> {item.count}</Box>}
                  </SpaceBetween>
                )
              }
            ]
          }}
          items={recentActivity}
          loadingText="Loading activity"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No recent activity</b>
              <Box variant="p" color="inherit">
                Activity will appear here as users interact with the platform.
              </Box>
            </Box>
          }
        />
      </Container>
    </SpaceBetween>
  )

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: dashboardContent
    },
    {
      id: 'questions',
      label: 'Question Bank',
      content: (
        <Container>
          <Box textAlign="center" padding="xxl">
            <SpaceBetween direction="vertical" size="m">
              <Icon name="folder" size="big" />
              <Box variant="h2">Question Bank Management</Box>
              <Box variant="p">
                Manage exam questions, import/export content, and organize by certification and domain.
              </Box>
              <Button variant="primary">
                Open Question Manager
              </Button>
            </SpaceBetween>
          </Box>
        </Container>
      )
    },
    {
      id: 'users',
      label: 'User Management',
      content: (
        <Container>
          <Box textAlign="center" padding="xxl">
            <SpaceBetween direction="vertical" size="m">
              <Icon name="user-profile" size="big" />
              <Box variant="h2">User Management</Box>
              <Box variant="p">
                View user accounts, manage permissions, and analyze user engagement patterns.
              </Box>
              <Button variant="primary">
                Open User Manager
              </Button>
            </SpaceBetween>
          </Box>
        </Container>
      )
    },
    {
      id: 'exam-builder',
      label: 'Exam Builder',
      content: (
        <Container>
          <Box textAlign="center" padding="xxl">
            <SpaceBetween direction="vertical" size="m">
              <Icon name="settings" size="big" />
              <Box variant="h2">Exam Builder</Box>
              <Box variant="p">
                Create custom exam templates with specific domains, difficulty levels, and question counts.
              </Box>
              <Button variant="primary">
                Create New Exam Template
              </Button>
            </SpaceBetween>
          </Box>
        </Container>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: (
        <Container>
          <Box textAlign="center" padding="xxl">
            <SpaceBetween direction="vertical" size="m">
              <Icon name="analytics" size="big" />
              <Box variant="h2">Advanced Analytics</Box>
              <Box variant="p">
                Deep insights into platform usage, question performance, and user success patterns.
              </Box>
              <Button variant="primary">
                View Analytics Dashboard
              </Button>
            </SpaceBetween>
          </Box>
        </Container>
      )
    }
  ]

  return (
    <SpaceBetween direction="vertical" size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Administrative tools and platform management"
            actions={
              <Button
                variant="normal"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            }
          >
            Admin Studio
          </Header>
        }
      >
        <Tabs
          activeTabId={activeTab}
          onChange={({ detail }) => setActiveTab(detail.activeTabId)}
          tabs={tabs}
        />
      </Container>
    </SpaceBetween>
  )
}

export default AdminPage