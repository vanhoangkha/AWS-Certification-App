import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  AppLayout,
  TopNavigation,
  SideNavigation,
  Container,
  Header,
  SpaceBetween,
  Button,
  Cards,
  Box,
  Badge,
  Icon,
  Alert,
  Grid,
  ProgressBar,
  Modal,
  FormField,
  Input,
  Select
} from '@cloudscape-design/components'
import '@cloudscape-design/global-styles/index.css'

// Professional Login Component
const LoginPage = () => {
  const [showDemo, setShowDemo] = useState(false)
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #232F3E 0%, #131A22 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Container>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <SpaceBetween direction="vertical" size="l">
            {/* Logo and Title */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #FF9900 0%, #FF6600 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 32px rgba(255, 153, 0, 0.3)'
              }}>
                <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>AWS</span>
              </div>
              <Box variant="h1" color="text-body-secondary">
                AWS Certification Platform
              </Box>
              <Box variant="p" color="text-body-secondary">
                Professional exam preparation with Pearson VUE experience
              </Box>
            </div>

            {/* Login Form */}
            <Container>
              <SpaceBetween direction="vertical" size="m">
                <FormField label="Email">
                  <Input placeholder="Enter your email" type="email" />
                </FormField>
                <FormField label="Password">
                  <Input placeholder="Enter your password" type="password" />
                </FormField>
                <SpaceBetween direction="vertical" size="s">
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="normal" 
                    fullWidth
                    onClick={() => setShowDemo(true)}
                  >
                    Try Demo Mode
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            </Container>

            {/* Features Preview */}
            <Alert type="info" header="Platform Features">
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Pearson VUE-style exam interface</li>
                <li>Real-time progress tracking</li>
                <li>Comprehensive analytics</li>
                <li>Mobile-responsive design</li>
              </ul>
            </Alert>
          </SpaceBetween>
        </div>
      </Container>

      {/* Demo Modal */}
      <Modal
        visible={showDemo}
        onDismiss={() => setShowDemo(false)}
        header="Demo Mode"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowDemo(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/dashboard'}
              >
                Enter Demo
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          <Box>
            Demo mode allows you to explore all features without creating an account.
          </Box>
          <Alert type="info">
            All data in demo mode is simulated and will not be saved.
          </Alert>
        </SpaceBetween>
      </Modal>
    </div>
  )
}

// Professional Dashboard Component
const DashboardPage = () => {
  const [activeNavItem, setActiveNavItem] = useState('/dashboard')

  const navigationItems = [
    {
      type: 'link',
      text: 'Dashboard',
      href: '/dashboard',
      info: <Badge color="blue">Home</Badge>
    },
    { type: 'divider' },
    {
      type: 'section',
      text: 'Study & Practice',
      items: [
        {
          type: 'link',
          text: 'Practice Mode',
          href: '/practice',
          info: <Badge color="green">Free</Badge>
        },
        {
          type: 'link',
          text: 'Mock Exams',
          href: '/exam',
          info: <Badge color="orange">Timed</Badge>
        },
        {
          type: 'link',
          text: 'Custom Exams',
          href: '/custom',
        }
      ]
    },
    { type: 'divider' },
    {
      type: 'section',
      text: 'Progress & Results',
      items: [
        {
          type: 'link',
          text: 'My Results',
          href: '/results'
        },
        {
          type: 'link',
          text: 'Analytics',
          href: '/analytics'
        },
        {
          type: 'link',
          text: 'Study Plan',
          href: '/study-plan'
        }
      ]
    },
    { type: 'divider' },
    {
      type: 'section',
      text: 'Support',
      items: [
        {
          type: 'link',
          text: 'Help Center',
          href: '/help'
        }
      ]
    }
  ]

  const quickActions = [
    {
      id: 'mock-exam',
      title: 'Take Mock Exam',
      description: 'Full 65-question timed exam simulation',
      icon: 'edit',
      color: '#FF9900',
      badge: 'Recommended',
      stats: '130 min • 65 questions'
    },
    {
      id: 'practice',
      title: 'Practice Questions',
      description: 'Study with instant feedback and explanations',
      icon: 'flash',
      color: '#146EB4',
      badge: null,
      stats: 'Unlimited • All domains'
    },
    {
      id: 'custom-exam',
      title: 'Custom Exam',
      description: 'Focus on specific domains and difficulty',
      icon: 'settings',
      color: '#037F0C',
      badge: null,
      stats: 'Customizable • 10-50 questions'
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Track progress and identify weak areas',
      icon: 'analytics',
      color: '#7D2105',
      badge: 'Insights',
      stats: 'Performance tracking'
    }
  ]

  const userStats = {
    examsTaken: 12,
    bestScore: 85,
    averageScore: 78,
    studyStreak: 7,
    readiness: 68
  }

  const recentActivity = [
    {
      type: 'exam',
      title: 'Mock Exam Completed',
      score: 85,
      certification: 'CLF-C01',
      time: '2 hours ago'
    },
    {
      type: 'practice',
      title: 'Practice Session',
      score: 92,
      domain: 'Security & Compliance',
      time: '1 day ago'
    },
    {
      type: 'achievement',
      title: 'Study Streak Achievement',
      description: '7 days in a row!',
      time: '2 days ago'
    }
  ]

  return (
    <AppLayout
      navigationHide={false}
      navigation={
        <SideNavigation
          activeHref={activeNavItem}
          header={{
            href: '/dashboard',
            text: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #FF9900 0%, #FF6600 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>AWS</span>
                </div>
                <span>Cert Platform</span>
              </div>
            )
          }}
          items={navigationItems}
          onFollow={(event) => {
            if (!event.detail.external) {
              event.preventDefault()
              setActiveNavItem(event.detail.href)
            }
          }}
        />
      }
      content={
        <SpaceBetween direction="vertical" size="l">
          {/* Welcome Banner */}
          <Alert
            type="success"
            header="Welcome back! 🎉"
            action={
              <Button variant="primary">
                Continue Studying
              </Button>
            }
          >
            You're {userStats.readiness}% ready for your AWS Cloud Practitioner certification. Keep up the great work!
          </Alert>

          {/* Progress Overview */}
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
                <SpaceBetween direction="horizontal" size="xs">
                  <Icon name="status-positive" variant="success" />
                  <Box variant="small" color="text-status-success">+3 this month</Box>
                </SpaceBetween>
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
                  variant="flash"
                  additionalInfo="Personal best"
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
                  variant="flash"
                  additionalInfo="Last 10 exams"
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
                header: (item) => (
                  <SpaceBetween direction="horizontal" size="s" alignItems="center">
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${item.color}33`
                    }}>
                      <Icon name={item.icon} variant="inverted" size="medium" />
                    </div>
                    <SpaceBetween direction="vertical" size="xs">
                      <SpaceBetween direction="horizontal" size="s" alignItems="center">
                        <Box variant="h3">{item.title}</Box>
                        {item.badge && <Badge color="blue">{item.badge}</Badge>}
                      </SpaceBetween>
                      <Box variant="small" color="text-status-inactive">{item.stats}</Box>
                    </SpaceBetween>
                  </SpaceBetween>
                ),
                sections: [
                  {
                    content: (item) => (
                      <SpaceBetween direction="vertical" size="m">
                        <Box variant="p">{item.description}</Box>
                        <Button
                          variant={item.id === 'mock-exam' ? 'primary' : 'normal'}
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
              cardsPerRow={[
                { cards: 1 },
                { minWidth: 500, cards: 2 },
                { minWidth: 800, cards: 4 }
              ]}
            />
          </Container>

          {/* Recent Activity */}
          <Grid
            gridDefinition={[
              { colspan: { default: 12, l: 8 } },
              { colspan: { default: 12, l: 4 } }
            ]}
          >
            <Container
              header={
                <Header variant="h2" description="Your latest study activities">
                  Recent Activity
                </Header>
              }
            >
              <SpaceBetween direction="vertical" size="m">
                {recentActivity.map((activity, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    border: '1px solid #e9ebed',
                    borderRadius: '8px',
                    backgroundColor: '#fafbfc'
                  }}>
                    <SpaceBetween direction="horizontal" size="m" alignItems="center">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: activity.type === 'exam' ? '#FF9900' : 
                                       activity.type === 'practice' ? '#146EB4' : '#037F0C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon 
                          name={activity.type === 'exam' ? 'edit' : 
                               activity.type === 'practice' ? 'flash' : 'status-positive'} 
                          variant="inverted" 
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <SpaceBetween direction="vertical" size="xs">
                          <Box variant="h4">{activity.title}</Box>
                          {activity.score && (
                            <Box variant="small">Score: {activity.score}%</Box>
                          )}
                          {activity.certification && (
                            <Badge>{activity.certification}</Badge>
                          )}
                          {activity.domain && (
                            <Badge color="green">{activity.domain}</Badge>
                          )}
                          {activity.description && (
                            <Box variant="small">{activity.description}</Box>
                          )}
                        </SpaceBetween>
                      </div>
                      <Box variant="small" color="text-status-inactive">
                        {activity.time}
                      </Box>
                    </SpaceBetween>
                  </div>
                ))}
              </SpaceBetween>
            </Container>

            <Container
              header={
                <Header variant="h2" description="Your certification progress">
                  Study Progress
                </Header>
              }
            >
              <SpaceBetween direction="vertical" size="l">
                <SpaceBetween direction="vertical" size="s">
                  <Box variant="h3">AWS Cloud Practitioner</Box>
                  <ProgressBar
                    value={userStats.readiness}
                    additionalInfo={`${userStats.readiness}% ready`}
                    description="Based on your practice performance"
                  />
                </SpaceBetween>

                <SpaceBetween direction="vertical" size="s">
                  <Box variant="awsui-key-label">Next Milestone</Box>
                  <Box>Take a full mock exam</Box>
                </SpaceBetween>

                <SpaceBetween direction="vertical" size="s">
                  <Box variant="awsui-key-label">Estimated Readiness</Box>
                  <Box>2-3 weeks with consistent practice</Box>
                </SpaceBetween>

                <SpaceBetween direction="vertical" size="s">
                  <Box variant="awsui-key-label">Focus Areas</Box>
                  <SpaceBetween direction="horizontal" size="xs">
                    <Badge color="red">Billing & Pricing</Badge>
                    <Badge color="orange">Technology</Badge>
                  </SpaceBetween>
                </SpaceBetween>
              </SpaceBetween>
            </Container>
          </Grid>
        </SpaceBetween>
      }
      toolsHide
    />
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
    },
  },
})

// Professional Practice Page
const PracticePage = () => {
  const [showExamInterface, setShowExamInterface] = useState(false)

  if (showExamInterface) {
    return <ProfessionalExamInterface onExit={() => setShowExamInterface(false)} />
  }

  const practiceOptions = [
    {
      title: 'Quick Practice',
      description: 'Jump right into practice with default settings',
      icon: 'flash',
      color: '#146EB4',
      badge: 'Recommended',
      action: () => setShowExamInterface(true)
    },
    {
      title: 'Domain Focus',
      description: 'Practice specific certification domains',
      icon: 'folder',
      color: '#FF9900',
      badge: null,
      action: () => setShowExamInterface(true)
    },
    {
      title: 'Weak Areas',
      description: 'Focus on your challenging topics',
      icon: 'status-warning',
      color: '#D13212',
      badge: 'Smart',
      action: () => setShowExamInterface(true)
    },
    {
      title: 'Custom Practice',
      description: 'Configure your practice session settings',
      icon: 'settings',
      color: '#037F0C',
      badge: null,
      action: () => setShowExamInterface(true)
    }
  ]

  return (
    <AppLayout
      navigation={
        <SideNavigation
          activeHref="/practice"
          header={{
            href: '/dashboard',
            text: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #FF9900 0%, #FF6600 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>AWS</span>
                </div>
                <span>Cert Platform</span>
              </div>
            )
          }}
          items={[
            { type: 'link', text: 'Dashboard', href: '/dashboard' },
            { type: 'divider' },
            { type: 'link', text: 'Practice Mode', href: '/practice' },
            { type: 'link', text: 'Mock Exams', href: '/exam' },
            { type: 'link', text: 'Analytics', href: '/analytics' }
          ]}
          onFollow={(event) => {
            if (!event.detail.external) {
              event.preventDefault()
              window.location.href = event.detail.href
            }
          }}
        />
      }
      content={
        <SpaceBetween direction="vertical" size="l">
          <Alert type="info" header="Practice Mode">
            Study AWS certification questions with instant feedback, detailed explanations, and reference links.
          </Alert>

          <Container
            header={
              <Header variant="h2" description="Choose your practice style">
                Practice Options
              </Header>
            }
          >
            <Cards
              cardDefinition={{
                header: (item) => (
                  <SpaceBetween direction="horizontal" size="s" alignItems="center">
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${item.color}33`
                    }}>
                      <Icon name={item.icon} variant="inverted" size="medium" />
                    </div>
                    <SpaceBetween direction="vertical" size="xs">
                      <SpaceBetween direction="horizontal" size="s" alignItems="center">
                        <Box variant="h3">{item.title}</Box>
                        {item.badge && <Badge color="blue">{item.badge}</Badge>}
                      </SpaceBetween>
                    </SpaceBetween>
                  </SpaceBetween>
                ),
                sections: [
                  {
                    content: (item) => (
                      <SpaceBetween direction="vertical" size="m">
                        <Box variant="p">{item.description}</Box>
                        <Button
                          variant={item.badge === 'Recommended' ? 'primary' : 'normal'}
                          onClick={item.action}
                          fullWidth
                        >
                          Start {item.title}
                        </Button>
                      </SpaceBetween>
                    )
                  }
                ]
              }}
              items={practiceOptions}
              cardsPerRow={[
                { cards: 1 },
                { minWidth: 500, cards: 2 },
                { minWidth: 800, cards: 4 }
              ]}
            />
          </Container>
        </SpaceBetween>
      }
      toolsHide
    />
  )
}

// Professional Question Browser
const QuestionBrowser = ({ onBack }: { onBack: () => void }) => {
  const [selectedCertification, setSelectedCertification] = useState('SAP-C02')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Mock questions data
  const questions = {
    'CLF-C01': [
      {
        id: 1,
        text: "What is the AWS shared responsibility model?",
        options: ["AWS is responsible for everything", "Customer is responsible for everything", "AWS and customer share security responsibilities", "Only AWS support handles security"],
        correct: 2,
        explanation: "The AWS shared responsibility model divides security responsibilities between AWS and the customer."
      }
    ],
    'SAP-C02': [
      {
        id: 1,
        text: "A large enterprise with multiple AWS accounts needs centralized logging with 7-year retention and real-time analysis. Which combination provides the most cost-effective solution?",
        options: [
          "CloudWatch Logs with cross-account destinations",
          "CloudTrail organization trail with S3 and OpenSearch",
          "Kinesis Data Firehose with ElasticSearch",
          "AWS Config with CloudWatch Insights"
        ],
        correct: 1,
        explanation: "CloudTrail organization trail automatically aggregates logs from all accounts, S3 provides cost-effective long-term storage, and OpenSearch enables real-time analysis."
      },
      {
        id: 2,
        text: "A financial services company requires sub-100ms response times with ACID compliance and global distribution. Which database solution is most appropriate?",
        options: [
          "RDS for Oracle with Multi-AZ",
          "DynamoDB with Global Tables",
          "Aurora Global Database",
          "DocumentDB with cross-region replication"
        ],
        correct: 2,
        explanation: "Aurora Global Database provides sub-100ms response times, maintains ACID compliance, and offers global distribution with automatic failover."
      }
    ]
  }

  const currentQuestions = questions[selectedCertification as keyof typeof questions] || []
  const currentQuestion = currentQuestions[currentQuestionIndex]

  return (
    <AppLayout
      navigation={
        <SideNavigation
          activeHref="/questions"
          header={{
            href: '/dashboard',
            text: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #FF9900 0%, #FF6600 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>AWS</span>
                </div>
                <span>Cert Platform</span>
              </div>
            )
          }}
          items={[
            { type: 'link', text: 'Dashboard', href: '/dashboard' },
            { type: 'divider' },
            { type: 'link', text: 'Question Browser', href: '/questions' },
            { type: 'link', text: 'Practice Mode', href: '/practice' },
            { type: 'link', text: 'Mock Exams', href: '/exam' }
          ]}
          onFollow={(event) => {
            if (!event.detail.external) {
              event.preventDefault()
              if (event.detail.href === '/dashboard') {
                onBack()
              }
            }
          }}
        />
      }
      content={
        <SpaceBetween direction="vertical" size="l">
          <Container
            header={
              <Header 
                variant="h1" 
                description="Browse and study AWS certification questions"
                actions={
                  <Select
                    selectedOption={{ label: selectedCertification === 'CLF-C01' ? 'Cloud Practitioner (CLF-C01)' : 'Solutions Architect Professional (SAP-C02)', value: selectedCertification }}
                    onChange={({ detail }) => {
                      setSelectedCertification(detail.selectedOption.value!)
                      setCurrentQuestionIndex(0)
                    }}
                    options={[
                      { label: 'Cloud Practitioner (CLF-C01)', value: 'CLF-C01' },
                      { label: 'Solutions Architect Professional (SAP-C02)', value: 'SAP-C02' }
                    ]}
                  />
                }
              >
                AWS Certification Questions
              </Header>
            }
          >
            {currentQuestion ? (
              <SpaceBetween direction="vertical" size="l">
                <Alert type="info">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length} • {selectedCertification} • Professional Level
                </Alert>

                <Container>
                  <SpaceBetween direction="vertical" size="m">
                    <Box variant="h3">Question {currentQuestionIndex + 1}</Box>
                    <Box fontSize="body-l" padding="s">
                      {currentQuestion.text}
                    </Box>

                    <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                      <SpaceBetween direction="vertical" size="s">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} style={{
                            padding: '12px',
                            border: index === currentQuestion.correct ? '2px solid #037F0C' : '1px solid #e9ebed',
                            borderRadius: '6px',
                            backgroundColor: index === currentQuestion.correct ? '#f0f8f0' : 'white'
                          }}>
                            <SpaceBetween direction="horizontal" size="s">
                              <Badge color={index === currentQuestion.correct ? 'green' : 'grey'}>
                                {String.fromCharCode(65 + index)}
                              </Badge>
                              <Box>{option}</Box>
                            </SpaceBetween>
                          </div>
                        ))}
                      </SpaceBetween>
                    </div>

                    <Alert type="success" header="Explanation">
                      {currentQuestion.explanation}
                    </Alert>
                  </SpaceBetween>
                </Container>

                <SpaceBetween direction="horizontal" size="s">
                  <Button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  >
                    Previous Question
                  </Button>
                  
                  <Button
                    disabled={currentQuestionIndex === currentQuestions.length - 1}
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  >
                    Next Question
                  </Button>
                  
                  <div style={{ flex: 1 }} />
                  
                  <Button variant="primary" onClick={onBack}>
                    Back to Dashboard
                  </Button>
                </SpaceBetween>
              </SpaceBetween>
            ) : (
              <Box textAlign="center" padding="xxl">
                <SpaceBetween direction="vertical" size="m">
                  <Icon name="search" size="big" />
                  <Box variant="h2">No questions available</Box>
                  <Box variant="p">Select a different certification to view questions.</Box>
                </SpaceBetween>
              </Box>
            )}
          </Container>
        </SpaceBetween>
      }
      toolsHide
    />
  )
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App