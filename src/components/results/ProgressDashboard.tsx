import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  ColumnLayout,
  Badge,
  Button,
  Select,
  DateRangePicker,
  Alert,
  ProgressBar,
  Table,
  LineChart,
  BarChart
} from '@cloudscape-design/components'
import { formatDistanceToNow } from 'date-fns'
import type { ExamResult, ProgressData } from '@/types'

interface ProgressDashboardProps {
  userId: string
  progressData?: ProgressData
  recentResults?: ExamResult[]
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  userId,
  progressData,
  recentResults = []
}) => {
  const [selectedCertification, setSelectedCertification] = useState<string>('')
  const [dateRange, setDateRange] = useState<any>(null)

  // Mock data for demonstration
  const mockProgressData: ProgressData = progressData || {
    userId,
    examAttempts: recentResults.map(result => ({
      sessionId: result.sessionId,
      certification: result.certification,
      examType: result.examType,
      scaledScore: result.scaledScore,
      passed: result.passed,
      completedAt: result.completedAt,
      timeSpent: result.timeSpent
    })),
    domainProgress: [
      {
        domain: 'Design Secure Architectures',
        averageScore: 750,
        totalAttempts: 5,
        improvement: 15,
        lastAttempt: '2024-01-15T10:00:00Z'
      },
      {
        domain: 'Design Resilient Architectures',
        averageScore: 680,
        totalAttempts: 4,
        improvement: -5,
        lastAttempt: '2024-01-14T14:30:00Z'
      },
      {
        domain: 'Design High-Performing Architectures',
        averageScore: 720,
        totalAttempts: 6,
        improvement: 25,
        lastAttempt: '2024-01-16T09:15:00Z'
      },
      {
        domain: 'Design Cost-Optimized Architectures',
        averageScore: 800,
        totalAttempts: 3,
        improvement: 10,
        lastAttempt: '2024-01-13T16:45:00Z'
      }
    ],
    achievements: [
      {
        id: 'first-pass',
        title: 'First Pass',
        description: 'Passed your first mock exam',
        icon: 'star',
        earnedAt: '2024-01-10T12:00:00Z',
        category: 'exam'
      },
      {
        id: 'streak-7',
        title: '7-Day Streak',
        description: 'Practiced for 7 consecutive days',
        icon: 'calendar',
        earnedAt: '2024-01-15T18:00:00Z',
        category: 'streak'
      },
      {
        id: 'domain-master',
        title: 'Domain Master',
        description: 'Scored 90%+ in all domains',
        icon: 'check',
        earnedAt: '2024-01-16T20:30:00Z',
        category: 'exam'
      }
    ],
    streaks: [
      {
        type: 'daily',
        current: 12,
        longest: 15,
        lastActivity: '2024-01-16T19:00:00Z'
      },
      {
        type: 'weekly',
        current: 3,
        longest: 4,
        lastActivity: '2024-01-16T19:00:00Z'
      }
    ]
  }

  const certificationOptions = [
    { label: 'All Certifications', value: '' },
    { label: 'SAA-C03', value: 'SAA-C03' },
    { label: 'CLF-C01', value: 'CLF-C01' },
    { label: 'DVA-C01', value: 'DVA-C01' }
  ]

  const getScoreTrend = () => {
    const attempts = mockProgressData.examAttempts
      .filter(attempt => !selectedCertification || attempt.certification === selectedCertification)
      .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())

    return attempts.map((attempt, index) => ({
      x: index + 1,
      y: attempt.scaledScore
    }))
  }

  const getDomainPerformance = () => {
    return mockProgressData.domainProgress.map(domain => ({
      domain: domain.domain.replace('Design ', ''),
      score: domain.averageScore,
      attempts: domain.totalAttempts,
      improvement: domain.improvement
    }))
  }

  const getImprovementBadge = (improvement: number) => {
    if (improvement > 0) {
      return <Badge color="green">+{improvement}%</Badge>
    } else if (improvement < 0) {
      return <Badge color="red">{improvement}%</Badge>
    }
    return <Badge color="grey">No change</Badge>
  }

  const getAchievementIcon = (category: string) => {
    const iconMap = {
      exam: 'star',
      practice: 'check',
      streak: 'calendar',
      improvement: 'trending-up'
    }
    return iconMap[category as keyof typeof iconMap] || 'star'
  }

  const recentAttemptsColumns = [
    {
      id: 'date',
      header: 'Date',
      cell: (item: any) => new Date(item.completedAt).toLocaleDateString(),
      sortingField: 'completedAt'
    },
    {
      id: 'certification',
      header: 'Certification',
      cell: (item: any) => <Badge>{item.certification}</Badge>,
      sortingField: 'certification'
    },
    {
      id: 'type',
      header: 'Type',
      cell: (item: any) => (
        <Badge color={item.examType === 'MOCK' ? 'blue' : 'green'}>
          {item.examType}
        </Badge>
      ),
      sortingField: 'examType'
    },
    {
      id: 'score',
      header: 'Score',
      cell: (item: any) => (
        <Box color={item.passed ? 'text-status-success' : 'text-status-error'}>
          {item.scaledScore}
        </Box>
      ),
      sortingField: 'scaledScore'
    },
    {
      id: 'result',
      header: 'Result',
      cell: (item: any) => (
        <Badge color={item.passed ? 'green' : 'red'}>
          {item.passed ? 'PASS' : 'FAIL'}
        </Badge>
      ),
      sortingField: 'passed'
    }
  ]

  return (
    <SpaceBetween direction="vertical" size="l">
      {/* Filters */}
      <Container>
        <SpaceBetween direction="horizontal" size="s">
          <Select
            selectedOption={
              certificationOptions.find(opt => opt.value === selectedCertification) ||
              certificationOptions[0]
            }
            onChange={({ detail }) => setSelectedCertification(detail.selectedOption.value || '')}
            options={certificationOptions}
            placeholder="Select certification"
          />
          <DateRangePicker
            onChange={({ detail }) => setDateRange(detail.value)}
            value={dateRange}
            placeholder="Select date range"
            relativeOptions={[
              { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
              { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
              { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
              { key: 'previous-6-hours', amount: 6, unit: 'hour', type: 'relative' },
              { key: 'previous-3-days', amount: 3, unit: 'day', type: 'relative' },
              { key: 'previous-7-days', amount: 7, unit: 'day', type: 'relative' },
              { key: 'previous-30-days', amount: 30, unit: 'day', type: 'relative' }
            ]}
            isValidRange={() => ({ valid: true })}
          />
        </SpaceBetween>
      </Container>

      {/* Overview Stats */}
      <ColumnLayout columns={4} variant="text-grid">
        <Box>
          <Box variant="awsui-key-label">Total Attempts</Box>
          <Box variant="h2">{mockProgressData.examAttempts.length}</Box>
          <Box variant="small" color="text-status-inactive">
            All time
          </Box>
        </Box>
        <Box>
          <Box variant="awsui-key-label">Best Score</Box>
          <Box variant="h2" color="text-status-success">
            {Math.max(...mockProgressData.examAttempts.map(a => a.scaledScore))}
          </Box>
          <Box variant="small" color="text-status-inactive">
            Personal best
          </Box>
        </Box>
        <Box>
          <Box variant="awsui-key-label">Pass Rate</Box>
          <Box variant="h2">
            {Math.round((mockProgressData.examAttempts.filter(a => a.passed).length / 
              mockProgressData.examAttempts.length) * 100)}%
          </Box>
          <Box variant="small" color="text-status-inactive">
            Success rate
          </Box>
        </Box>
        <Box>
          <Box variant="awsui-key-label">Current Streak</Box>
          <Box variant="h2" color="text-status-info">
            {mockProgressData.streaks.find(s => s.type === 'daily')?.current || 0}
          </Box>
          <Box variant="small" color="text-status-inactive">
            Days in a row
          </Box>
        </Box>
      </ColumnLayout>

      {/* Score Trend Chart */}
      <Container
        header={
          <Header variant="h3" description="Track your score improvement over time">
            Score Trend
          </Header>
        }
      >
        {getScoreTrend().length > 0 ? (
          <LineChart
            series={[
              {
                title: 'Scaled Score',
                type: 'line',
                data: getScoreTrend()
              }
            ]}
            xDomain={[1, Math.max(getScoreTrend().length, 1)]}
            yDomain={[0, 1000]}
            xTitle="Attempt Number"
            yTitle="Scaled Score"
            height={300}
            hideFilter
            hideLegend
          />
        ) : (
          <Box textAlign="center" color="inherit">
            <b>No exam attempts yet</b>
            <Box variant="p" color="inherit">
              Take your first practice exam to see your progress here.
            </Box>
          </Box>
        )}
      </Container>

      {/* Domain Performance */}
      <Container
        header={
          <Header variant="h3" description="Your performance across different exam domains">
            Domain Performance
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          {mockProgressData.domainProgress.map((domain, index) => (
            <Box key={index}>
              <SpaceBetween direction="vertical" size="s">
                <SpaceBetween direction="horizontal" size="s">
                  <Box variant="h4" style={{ flex: 1 }}>
                    {domain.domain}
                  </Box>
                  {getImprovementBadge(domain.improvement)}
                  <Box variant="h4">
                    {domain.averageScore}/1000
                  </Box>
                </SpaceBetween>
                
                <ProgressBar
                  value={(domain.averageScore / 1000) * 100}
                  additionalInfo={`${domain.totalAttempts} attempts • Last: ${formatDistanceToNow(new Date(domain.lastAttempt), { addSuffix: true })}`}
                  variant={domain.averageScore >= 720 ? 'success' : 'error'}
                />
              </SpaceBetween>
            </Box>
          ))}
        </SpaceBetween>
      </Container>

      {/* Achievements */}
      <Container
        header={
          <Header variant="h3" description="Your learning milestones and achievements">
            Achievements
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="s">
          {mockProgressData.achievements.map((achievement, index) => (
            <Alert
              key={index}
              type="success"
              header={achievement.title}
            >
              <SpaceBetween direction="horizontal" size="s">
                <Box style={{ flex: 1 }}>
                  {achievement.description}
                </Box>
                <Box variant="small" color="text-status-inactive">
                  {formatDistanceToNow(new Date(achievement.earnedAt), { addSuffix: true })}
                </Box>
              </SpaceBetween>
            </Alert>
          ))}
        </SpaceBetween>
      </Container>

      {/* Recent Attempts */}
      <Container
        header={
          <Header
            variant="h3"
            description="Your most recent exam attempts"
            counter={`(${mockProgressData.examAttempts.length})`}
          >
            Recent Attempts
          </Header>
        }
      >
        <Table
          columnDefinitions={recentAttemptsColumns}
          items={mockProgressData.examAttempts.slice(0, 10)}
          loadingText="Loading attempts..."
          empty={
            <Box textAlign="center" color="inherit">
              <b>No exam attempts yet</b>
              <Box variant="p" color="inherit">
                Start practicing to see your attempts here.
              </Box>
            </Box>
          }
          sortingDisabled
        />
      </Container>
    </SpaceBetween>
  )
}

export default ProgressDashboard