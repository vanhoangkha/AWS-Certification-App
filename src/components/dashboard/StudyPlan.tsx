import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Button,
  Alert,
  ProgressBar,
  Cards,
  Badge,
  Modal,
  FormField,
  Select,
  DatePicker,
  Checkbox,
  ColumnLayout,
  Calendar
} from '@cloudscape-design/components'
import { addDays, formatDistanceToNow, differenceInDays } from 'date-fns'
import type { ExamResult } from '@/types'

interface StudyPlanProps {
  userId: string
  targetCertifications?: string[]
  recentResults?: ExamResult[]
}

interface StudyPlanItem {
  id: string
  title: string
  description: string
  type: 'practice' | 'mock' | 'review' | 'study'
  certification: string
  domain?: string
  estimatedTime: number
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  completed: boolean
  completedAt?: string
}

const StudyPlan: React.FC<StudyPlanProps> = ({
  userId,
  targetCertifications = ['SAA-C03'],
  recentResults = []
}) => {
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false)
  const [selectedCertification, setSelectedCertification] = useState('SAA-C03')
  const [targetDate, setTargetDate] = useState('')
  const [studyHoursPerWeek, setStudyHoursPerWeek] = useState(10)

  // Mock study plan data
  const mockStudyPlan: StudyPlanItem[] = [
    {
      id: 'plan-1',
      title: 'Practice Security Questions',
      description: 'Focus on Design Secure Architectures domain',
      type: 'practice',
      certification: 'SAA-C03',
      domain: 'Design Secure Architectures',
      estimatedTime: 60,
      priority: 'high',
      dueDate: new Date().toISOString(),
      completed: false
    },
    {
      id: 'plan-2',
      title: 'Review IAM Best Practices',
      description: 'Study AWS IAM documentation and whitepapers',
      type: 'study',
      certification: 'SAA-C03',
      domain: 'Design Secure Architectures',
      estimatedTime: 90,
      priority: 'high',
      dueDate: addDays(new Date(), 1).toISOString(),
      completed: false
    },
    {
      id: 'plan-3',
      title: 'Mock Exam - Full Length',
      description: 'Take a complete 65-question mock exam',
      type: 'mock',
      certification: 'SAA-C03',
      estimatedTime: 130,
      priority: 'medium',
      dueDate: addDays(new Date(), 2).toISOString(),
      completed: true,
      completedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'plan-4',
      title: 'Review Resilient Architecture Patterns',
      description: 'Study high availability and disaster recovery patterns',
      type: 'study',
      certification: 'SAA-C03',
      domain: 'Design Resilient Architectures',
      estimatedTime: 75,
      priority: 'medium',
      dueDate: addDays(new Date(), 3).toISOString(),
      completed: false
    },
    {
      id: 'plan-5',
      title: 'Practice Performance Questions',
      description: 'Focus on Design High-Performing Architectures',
      type: 'practice',
      certification: 'SAA-C03',
      domain: 'Design High-Performing Architectures',
      estimatedTime: 45,
      priority: 'low',
      dueDate: addDays(new Date(), 4).toISOString(),
      completed: false
    }
  ]

  const certificationOptions = [
    { label: 'SAA-C03 - Solutions Architect Associate', value: 'SAA-C03' },
    { label: 'CLF-C01 - Cloud Practitioner', value: 'CLF-C01' },
    { label: 'DVA-C01 - Developer Associate', value: 'DVA-C01' }
  ]

  const getTypeIcon = (type: string) => {
    const iconMap = {
      practice: 'check',
      mock: 'star',
      review: 'refresh',
      study: 'file'
    }
    return iconMap[type as keyof typeof iconMap] || 'file'
  }

  const getTypeBadge = (type: string) => {
    const colorMap = {
      practice: 'green',
      mock: 'blue',
      review: 'orange',
      study: 'purple'
    }
    const labelMap = {
      practice: 'Practice',
      mock: 'Mock Exam',
      review: 'Review',
      study: 'Study'
    }
    return (
      <Badge color={colorMap[type as keyof typeof colorMap] || 'grey'}>
        {labelMap[type as keyof typeof labelMap] || type}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colorMap = {
      high: 'red',
      medium: 'orange',
      low: 'blue'
    }
    return (
      <Badge color={colorMap[priority as keyof typeof colorMap] || 'grey'}>
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const getOverallProgress = () => {
    const completed = mockStudyPlan.filter(item => item.completed).length
    return Math.round((completed / mockStudyPlan.length) * 100)
  }

  const getTodaysTasks = () => {
    const today = new Date().toDateString()
    return mockStudyPlan.filter(item => 
      new Date(item.dueDate).toDateString() === today && !item.completed
    )
  }

  const getUpcomingTasks = () => {
    const today = new Date()
    return mockStudyPlan.filter(item => 
      new Date(item.dueDate) > today && !item.completed
    ).slice(0, 3)
  }

  const getWeeklyProgress = () => {
    const thisWeek = mockStudyPlan.filter(item => {
      const dueDate = new Date(item.dueDate)
      const today = new Date()
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
      const weekEnd = addDays(weekStart, 7)
      return dueDate >= weekStart && dueDate < weekEnd
    })
    
    const completed = thisWeek.filter(item => item.completed).length
    return thisWeek.length > 0 ? Math.round((completed / thisWeek.length) * 100) : 0
  }

  const handleCompleteTask = (taskId: string) => {
    // In real app, this would update the task status
    console.log('Completing task:', taskId)
  }

  const handleCreatePlan = () => {
    // In real app, this would create a personalized study plan
    console.log('Creating study plan for:', selectedCertification, 'Target date:', targetDate)
    setShowCreatePlanModal(false)
  }

  return (
    <>
      <SpaceBetween direction="vertical" size="l">
        {/* Study Plan Overview */}
        <Container
          header={
            <Header
              variant="h2"
              description="Your personalized study plan based on your progress and goals"
              actions={
                <Button
                  variant="primary"
                  onClick={() => setShowCreatePlanModal(true)}
                >
                  Create New Plan
                </Button>
              }
            >
              Study Plan
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="m">
            {/* Progress Overview */}
            <ColumnLayout columns={3} variant="text-grid">
              <Box>
                <Box variant="awsui-key-label">Overall Progress</Box>
                <Box variant="h2">{getOverallProgress()}%</Box>
                <ProgressBar
                  value={getOverallProgress()}
                  additionalInfo={`${mockStudyPlan.filter(i => i.completed).length} of ${mockStudyPlan.length} tasks completed`}
                />
              </Box>
              <Box>
                <Box variant="awsui-key-label">This Week</Box>
                <Box variant="h2">{getWeeklyProgress()}%</Box>
                <ProgressBar
                  value={getWeeklyProgress()}
                  additionalInfo="Weekly progress"
                />
              </Box>
              <Box>
                <Box variant="awsui-key-label">Target Certification</Box>
                <Box variant="h2">
                  <Badge color="blue">{selectedCertification}</Badge>
                </Box>
                <Box variant="small" color="text-status-inactive">
                  Primary focus
                </Box>
              </Box>
            </ColumnLayout>

            {/* Today's Tasks Alert */}
            {getTodaysTasks().length > 0 && (
              <Alert type="info" header={`You have ${getTodaysTasks().length} task(s) due today`}>
                <SpaceBetween direction="vertical" size="s">
                  {getTodaysTasks().map(task => (
                    <Box key={task.id}>
                      <SpaceBetween direction="horizontal" size="s">
                        <Box style={{ flex: 1 }}>
                          <strong>{task.title}</strong> - {task.estimatedTime} minutes
                        </Box>
                        <Button
                          variant="link"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          Start
                        </Button>
                      </SpaceBetween>
                    </Box>
                  ))}
                </SpaceBetween>
              </Alert>
            )}
          </SpaceBetween>
        </Container>

        {/* Study Plan Tasks */}
        <Container
          header={
            <Header
              variant="h3"
              counter={`(${mockStudyPlan.length})`}
              description="Your scheduled study activities"
            >
              Study Tasks
            </Header>
          }
        >
          <Cards
            cardDefinition={{
              header: (item: StudyPlanItem) => (
                <SpaceBetween direction="horizontal" size="s">
                  <Box variant="h4" style={{ flex: 1 }}>
                    {item.completed ? '✅ ' : ''}{item.title}
                  </Box>
                  {getTypeBadge(item.type)}
                  {getPriorityBadge(item.priority)}
                </SpaceBetween>
              ),
              sections: [
                {
                  content: (item: StudyPlanItem) => (
                    <SpaceBetween direction="vertical" size="s">
                      <Box>{item.description}</Box>
                      {item.domain && (
                        <Box variant="small">
                          <strong>Domain:</strong> {item.domain}
                        </Box>
                      )}
                      <SpaceBetween direction="horizontal" size="s">
                        <Box variant="small">
                          <strong>Time:</strong> {item.estimatedTime} minutes
                        </Box>
                        <Box variant="small">
                          <strong>Due:</strong> {new Date(item.dueDate).toLocaleDateString()}
                        </Box>
                      </SpaceBetween>
                    </SpaceBetween>
                  )
                },
                {
                  content: (item: StudyPlanItem) => (
                    <SpaceBetween direction="horizontal" size="s">
                      {item.completed ? (
                        <Box variant="small" color="text-status-success">
                          Completed {item.completedAt && formatDistanceToNow(new Date(item.completedAt), { addSuffix: true })}
                        </Box>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => handleCompleteTask(item.id)}
                        >
                          {item.type === 'practice' ? 'Start Practice' :
                           item.type === 'mock' ? 'Take Exam' :
                           item.type === 'study' ? 'Start Reading' :
                           'Begin Review'}
                        </Button>
                      )}
                      <Button variant="link">
                        Edit
                      </Button>
                    </SpaceBetween>
                  )
                }
              ]
            }}
            items={mockStudyPlan}
            trackBy="id"
            variant="full-page"
          />
        </Container>

        {/* Upcoming Tasks */}
        <Container
          header={
            <Header variant="h3" description="What's coming up next">
              Upcoming Tasks
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="s">
            {getUpcomingTasks().map(task => (
              <Alert key={task.id} type="info">
                <SpaceBetween direction="horizontal" size="s">
                  <Box style={{ flex: 1 }}>
                    <strong>{task.title}</strong> - Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                  </Box>
                  {getTypeBadge(task.type)}
                </SpaceBetween>
              </Alert>
            ))}
          </SpaceBetween>
        </Container>

        {/* Study Tips */}
        <Alert type="success" header="Study Tips for Success">
          <SpaceBetween direction="vertical" size="s">
            <Box>• Break study sessions into focused 45-60 minute blocks</Box>
            <Box>• Review explanations for all questions, even ones you got right</Box>
            <Box>• Focus on your weakest domains first</Box>
            <Box>• Take regular mock exams to track progress</Box>
            <Box>• Use active recall and spaced repetition techniques</Box>
          </SpaceBetween>
        </Alert>
      </SpaceBetween>

      {/* Create Study Plan Modal */}
      <Modal
        visible={showCreatePlanModal}
        onDismiss={() => setShowCreatePlanModal(false)}
        header="Create Study Plan"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowCreatePlanModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreatePlan}>
                Create Plan
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          <Alert type="info" header="Personalized Study Plan">
            We'll create a customized study plan based on your target certification, 
            exam date, and available study time.
          </Alert>

          <FormField label="Target Certification">
            <Select
              selectedOption={
                certificationOptions.find(opt => opt.value === selectedCertification) ||
                certificationOptions[0]
              }
              onChange={({ detail }) => setSelectedCertification(detail.selectedOption.value || 'SAA-C03')}
              options={certificationOptions}
            />
          </FormField>

          <FormField label="Target Exam Date">
            <DatePicker
              onChange={({ detail }) => setTargetDate(detail.value)}
              value={targetDate}
              placeholder="YYYY/MM/DD"
            />
          </FormField>

          <FormField label="Study Hours per Week">
            <Select
              selectedOption={{ label: `${studyHoursPerWeek} hours`, value: studyHoursPerWeek.toString() }}
              onChange={({ detail }) => setStudyHoursPerWeek(parseInt(detail.selectedOption.value || '10'))}
              options={[
                { label: '5 hours', value: '5' },
                { label: '10 hours', value: '10' },
                { label: '15 hours', value: '15' },
                { label: '20 hours', value: '20' },
                { label: '25+ hours', value: '25' }
              ]}
            />
          </FormField>

          <FormField label="Focus Areas">
            <SpaceBetween direction="vertical" size="s">
              <Checkbox checked>Practice Questions</Checkbox>
              <Checkbox checked>Mock Exams</Checkbox>
              <Checkbox>AWS Documentation Review</Checkbox>
              <Checkbox>Hands-on Labs</Checkbox>
              <Checkbox>Video Courses</Checkbox>
            </SpaceBetween>
          </FormField>
        </SpaceBetween>
      </Modal>
    </>
  )
}

export default StudyPlan