import React from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Button,
  Grid,
  ProgressBar,
  Badge,
  Cards,
  Alert,
  Icon
} from '@cloudscape-design/components'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

import UserDashboard from '@/components/dashboard/UserDashboard'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Mock data - in real app this would come from API
  const userStats = {
    examsTaken: 12,
    bestScore: 85,
    averageScore: 78,
    passRate: 75,
    studyStreak: 7,
    totalQuestions: 1247,
    weeklyGoal: 80,
    weeklyProgress: 65
  }

  const quickActions = [
    {
      id: 'mock-exam',
      title: 'Take Mock Exam',
      description: 'Full 65-question timed exam',
      icon: 'edit',
      color: '#FF9900',
      href: '/exam',
      badge: 'Recommended'
    },
    {
      id: 'practice',
      title: 'Practice Questions',
      description: 'Study with instant feedback',
      icon: 'flash',
      color: '#146EB4',
      href: '/practice',
      badge: null
    },
    {
      id: 'custom-exam',
      title: 'Custom Exam',
      description: 'Focus on specific domains',
      icon: 'settings',
      color: '#037F0C',
      href: '/practice?mode=custom',
      badge: null
    },
    {
      id: 'results',
      title: 'View Results',
      description: 'Track your progress',
      icon: 'analytics',
      color: '#7D2105',
      href: '/results',
      badge: null
    }
  ]

  const recentAchievements = [
    {
      title: 'Study Streak',
      description: '7 days in a row!',
      icon: '🔥',
      earned: true,
      date: '2024-02-12'
    },
    {
      title: 'Practice Master',
      description: '1000+ questions answered',
      icon: '🎯',
      earned: true,
      date: '2024-02-10'
    },
    {
      title: 'Domain Expert',
      description: '90% in Security & Compliance',
      icon: '🛡️',
      earned: false,
      date: null
    }
  ]

  const studyPlan = {
    certification: 'AWS Certified Cloud Practitioner',
    progress: 68,
    nextMilestone: 'Take practice exam',
    estimatedReadiness: '2 weeks',
    weakAreas: ['Billing & Pricing', 'Technology']
  }

  return (
    <SpaceBetween direction="vertical" size="l">
      {/* Welcome Banner with Status */}
      <Alert
        type="success"
        header={`Welcome back, ${user?.name || user?.email?.split('@')[0]}! 🎉`}
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/exam')}
          >
            Take Mock Exam
          </Button>
        }
      >
        You're {studyPlan.progress}% ready for your certification. Keep practicing - you're doing great!
      </Alert>

      {/* Progress Overview Cards */}
      <Grid
        gridDefinition={[
          { colspan: { default: 12, xs: 6, s: 3 } },
          { colspan: { default: 12, xs: 6, s: 3 } },
          { colspan: { default: 12, xs: 6, s: 3 } },
          { colspan: { default: 12, xs: 6, s: 3 } }
        ]}
      >
        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Exams Taken</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
              {userStats.examsTaken}
            </Box>
            <ProgressBar
              value={userStats.examsTaken}
              additionalInfo="This month"
              variant="flash"
            />
          </SpaceBetween>
        </Container>

        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Best Score</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-success">
              {userStats.bestScore}%
            </Box>
            <ProgressBar
              value={userStats.bestScore}
              additionalInfo="Personal best"
              variant="flash"
            />
          </SpaceBetween>
        </Container>

        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Average Score</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-warning">
              {userStats.averageScore}%
            </Box>
            <ProgressBar
              value={userStats.averageScore}
              additionalInfo="Last 10 exams"
              variant="flash"
            />
          </SpaceBetween>
        </Container>

        <Container>
          <SpaceBetween direction="vertical" size="s">
            <Box variant="awsui-key-label">Study Streak</Box>
            <Box fontSize="display-l" fontWeight="bold" color="text-status-info">
              {userStats.studyStreak} days
            </Box>
            <SpaceBetween direction="horizontal" size="xs">
              <Icon name="status-positive" variant="success" />
              <Box variant="small" color="text-status-success">Keep it up!</Box>
            </SpaceBetween>
          </SpaceBetween>
        </Container>
      </Grid>

      {/* Quick Actions */}
      <Container
        header={
          <Header variant="h2" description="Jump into your study session">
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
                  {item.badge && (
                    <Badge color="blue">{item.badge}</Badge>
                  )}
                </SpaceBetween>
              </SpaceBetween>
            ),
            sections: [
              {
                content: (item: any) => (
                  <SpaceBetween direction="vertical" size="m">
                    <Box variant="p">{item.description}</Box>
                    <Button
                      variant={item.id === 'mock-exam' ? 'primary' : 'normal'}
                      onClick={() => navigate(item.href)}
                      fullWidth
                    >
                      {item.title}
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

      <Grid
        gridDefinition={[
          { colspan: { default: 12, l: 8 } },
          { colspan: { default: 12, l: 4 } }
        ]}
      >
        {/* Study Plan Progress */}
        <Container
          header={
            <Header
              variant="h2"
              description="Your personalized learning path"
              actions={
                <Button
                  variant="normal"
                  onClick={() => navigate('/analytics')}
                >
                  View Details
                </Button>
              }
            >
              Study Plan Progress
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="l">
            <SpaceBetween direction="vertical" size="s">
              <Box variant="h3">{studyPlan.certification}</Box>
              <ProgressBar
                value={studyPlan.progress}
                additionalInfo={`${studyPlan.progress}% complete`}
                description="Based on your practice performance and study consistency"
              />
            </SpaceBetween>

            <Grid
              gridDefinition={[
                { colspan: { default: 12, s: 6 } },
                { colspan: { default: 12, s: 6 } }
              ]}
            >
              <SpaceBetween direction="vertical" size="xs">
                <Box variant="awsui-key-label">Next Milestone</Box>
                <Box fontWeight="bold">{studyPlan.nextMilestone}</Box>
              </SpaceBetween>
              <SpaceBetween direction="vertical" size="xs">
                <Box variant="awsui-key-label">Estimated Readiness</Box>
                <Box fontWeight="bold">{studyPlan.estimatedReadiness}</Box>
              </SpaceBetween>
            </Grid>

            <SpaceBetween direction="vertical" size="xs">
              <Box variant="awsui-key-label">Areas to Focus</Box>
              <SpaceBetween direction="horizontal" size="xs">
                {studyPlan.weakAreas.map((area, index) => (
                  <Badge key={index} color="red">{area}</Badge>
                ))}
              </SpaceBetween>
            </SpaceBetween>
          </SpaceBetween>
        </Container>

        {/* Recent Achievements */}
        <Container
          header={
            <Header variant="h2" description="Your latest accomplishments">
              Recent Achievements
            </Header>
          }
        >
          <Cards
            cardDefinition={{
              header: (item: any) => (
                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                  <Box fontSize="heading-l">{item.icon}</Box>
                  <SpaceBetween direction="vertical" size="none">
                    <Box variant="h3">{item.title}</Box>
                    {item.earned ? (
                      <Badge color="green">Earned</Badge>
                    ) : (
                      <Badge color="grey">In Progress</Badge>
                    )}
                  </SpaceBetween>
                </SpaceBetween>
              ),
              sections: [
                {
                  content: (item: any) => (
                    <SpaceBetween direction="vertical" size="s">
                      <Box>{item.description}</Box>
                      {item.earned && item.date && (
                        <Box variant="small" color="text-status-inactive">
                          Earned on {new Date(item.date).toLocaleDateString()}
                        </Box>
                      )}
                    </SpaceBetween>
                  )
                }
              ]
            }}
            items={recentAchievements}
            loadingText="Loading achievements"
            empty={
              <Box textAlign="center" color="inherit">
                <b>No achievements yet</b>
                <Box variant="p" color="inherit">
                  Start studying to earn your first achievement!
                </Box>
              </Box>
            }
          />
        </Container>
      </Grid>
    </SpaceBetween>
  )
}

export default DashboardPage