import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  ColumnLayout,
  Badge,
  Alert,
  Button,
  Select,
  DateRangePicker,
  LineChart,
  BarChart,
  PieChart,
  Table,
  Link
} from '@cloudscape-design/components'
import { formatDistanceToNow } from 'date-fns'

interface AdminDashboardProps {
  timeRange?: string
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  timeRange = '30d'
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)
  const [selectedCertification, setSelectedCertification] = useState('all')

  // Mock admin data
  const mockAdminData = {
    totalUsers: 1247,
    activeUsers: 892,
    totalExams: 5634,
    totalQuestions: 2890,
    passRate: 73,
    averageScore: 742,
    newUsersThisWeek: 45,
    examsThisWeek: 234,
    topCertifications: [
      { certification: 'SAA-C03', attempts: 2145, passRate: 68 },
      { certification: 'CLF-C01', attempts: 1876, passRate: 82 },
      { certification: 'DVA-C01', attempts: 987, passRate: 71 },
      { certification: 'SOA-C02', attempts: 626, passRate: 65 }
    ],
    domainPerformance: [
      { domain: 'Design Secure Architectures', averageScore: 720, attempts: 1234 },
      { domain: 'Design Resilient Architectures', averageScore: 695, attempts: 1198 },
      { domain: 'Design High-Performing Architectures', averageScore: 758, attempts: 1156 },
      { domain: 'Design Cost-Optimized Architectures', averageScore: 782, attempts: 1089 }
    ],
    questionPerformance: [
      { questionId: 'q-001', difficulty: 'HARD', correctRate: 23, attempts: 456 },
      { questionId: 'q-002', difficulty: 'MEDIUM', correctRate: 34, attempts: 523 },
      { questionId: 'q-003', difficulty: 'HARD', correctRate: 28, attempts: 398 },
      { questionId: 'q-004', difficulty: 'EASY', correctRate: 45, attempts: 612 },
      { questionId: 'q-005', difficulty: 'MEDIUM', correctRate: 38, attempts: 487 }
    ],
    userActivity: [
      { date: '2024-01-15', activeUsers: 234, newUsers: 12, exams: 89 },
      { date: '2024-01-16', activeUsers: 267, newUsers: 15, exams: 102 },
      { date: '2024-01-17', activeUsers: 298, newUsers: 18, exams: 134 },
      { date: '2024-01-18', activeUsers: 312, newUsers: 22, exams: 156 },
      { date: '2024-01-19', activeUsers: 289, newUsers: 19, exams: 143 },
      { date: '2024-01-20', activeUsers: 345, newUsers: 25, exams: 178 },
      { date: '2024-01-21', activeUsers: 367, newUsers: 28, exams: 189 }
    ]
  }

  const timeRangeOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'All time', value: 'all' }
  ]

  const certificationOptions = [
    { label: 'All Certifications', value: 'all' },
    { label: 'SAA-C03', value: 'SAA-C03' },
    { label: 'CLF-C01', value: 'CLF-C01' },
    { label: 'DVA-C01', value: 'DVA-C01' },
    { label: 'SOA-C02', value: 'SOA-C02' }
  ]

  const getUserActivityData = () => {
    return mockAdminData.userActivity.map(day => ({
      x: day.date,
      y: day.activeUsers
    }))
  }

  const getExamVolumeData = () => {
    return mockAdminData.userActivity.map(day => ({
      x: day.date,
      y: day.exams
    }))
  }

  const getCertificationDistribution = () => {
    return mockAdminData.topCertifications.map(cert => ({
      title: cert.certification,
      value: cert.attempts,
      color: cert.certification === 'SAA-C03' ? '#0073bb' : 
             cert.certification === 'CLF-C01' ? '#037f0c' :
             cert.certification === 'DVA-C01' ? '#d13212' : '#ff9900'
    }))
  }

  const getDomainPerformanceData = () => {
    return mockAdminData.domainPerformance.map(domain => ({
      x: domain.domain.replace('Design ', ''),
      y: domain.averageScore
    }))
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 800) return <Badge color="green">Excellent</Badge>
    if (score >= 720) return <Badge color="blue">Good</Badge>
    if (score >= 600) return <Badge color="orange">Fair</Badge>
    return <Badge color="red">Poor</Badge>
  }

  const getDifficultyBadge = (difficulty: string) => {
    const colorMap = {
      EASY: 'green',
      MEDIUM: 'blue',
      HARD: 'red'
    }
    return (
      <Badge color={colorMap[difficulty as keyof typeof colorMap] || 'grey'}>
        {difficulty}
      </Badge>
    )
  }

  const questionPerformanceColumns = [
    {
      id: 'questionId',
      header: 'Question ID',
      cell: (item: any) => (
        <Link href={`#question-${item.questionId}`}>
          {item.questionId}
        </Link>
      ),
      sortingField: 'questionId'
    },
    {
      id: 'difficulty',
      header: 'Difficulty',
      cell: (item: any) => getDifficultyBadge(item.difficulty),
      sortingField: 'difficulty'
    },
    {
      id: 'correctRate',
      header: 'Correct Rate',
      cell: (item: any) => (
        <Box color={item.correctRate < 30 ? 'text-status-error' : item.correctRate < 50 ? 'text-status-warning' : 'text-status-success'}>
          {item.correctRate}%
        </Box>
      ),
      sortingField: 'correctRate'
    },
    {
      id: 'attempts',
      header: 'Attempts',
      cell: (item: any) => item.attempts,
      sortingField: 'attempts'
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item: any) => (
        item.correctRate < 30 ? <Badge color="red">Review Needed</Badge> :
        item.correctRate < 50 ? <Badge color="orange">Monitor</Badge> :
        <Badge color="green">Good</Badge>
      )
    }
  ]

  return (
    <SpaceBetween direction="vertical" size="l">
      {/* Filters */}
      <Container>
        <SpaceBetween direction="horizontal" size="s">
          <Select
            selectedOption={
              timeRangeOptions.find(opt => opt.value === selectedTimeRange) ||
              timeRangeOptions[1]
            }
            onChange={({ detail }) => setSelectedTimeRange(detail.selectedOption.value || '30d')}
            options={timeRangeOptions}
          />
          <Select
            selectedOption={
              certificationOptions.find(opt => opt.value === selectedCertification) ||
              certificationOptions[0]
            }
            onChange={({ detail }) => setSelectedCertification(detail.selectedOption.value || 'all')}
            options={certificationOptions}
          />
        </SpaceBetween>
      </Container>

      {/* Key Metrics */}
      <Container
        header={
          <Header variant="h3">
            Platform Overview
          </Header>
        }
      >
        <ColumnLayout columns={4} variant="text-grid">
          <Box>
            <Box variant="awsui-key-label">Total Users</Box>
            <Box variant="h2">{mockAdminData.totalUsers.toLocaleString()}</Box>
            <Box variant="small" color="text-status-success">
              +{mockAdminData.newUsersThisWeek} this week
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Active Users</Box>
            <Box variant="h2">{mockAdminData.activeUsers.toLocaleString()}</Box>
            <Box variant="small" color="text-status-inactive">
              {Math.round((mockAdminData.activeUsers / mockAdminData.totalUsers) * 100)}% of total
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Total Exams</Box>
            <Box variant="h2">{mockAdminData.totalExams.toLocaleString()}</Box>
            <Box variant="small" color="text-status-success">
              +{mockAdminData.examsThisWeek} this week
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Question Bank</Box>
            <Box variant="h2">{mockAdminData.totalQuestions.toLocaleString()}</Box>
            <Box variant="small" color="text-status-inactive">
              Total questions
            </Box>
          </Box>
        </ColumnLayout>
      </Container>

      {/* Performance Metrics */}
      <Container
        header={
          <Header variant="h3">
            Performance Metrics
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <Box>
            <Box variant="awsui-key-label">Overall Pass Rate</Box>
            <Box variant="h2">
              <Badge color="green">{mockAdminData.passRate}%</Badge>
            </Box>
            <Box variant="small" color="text-status-inactive">
              Platform average
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Average Score</Box>
            <Box variant="h2" color="text-status-success">
              {mockAdminData.averageScore}
            </Box>
            <Box variant="small" color="text-status-inactive">
              Scaled score average
            </Box>
          </Box>
        </ColumnLayout>
      </Container>

      {/* Charts Grid */}
      <ColumnLayout columns={2} variant="text-grid">
        {/* User Activity Trend */}
        <Container
          header={
            <Header variant="h3">
              User Activity Trend
            </Header>
          }
        >
          <LineChart
            series={[
              {
                title: 'Active Users',
                type: 'line',
                data: getUserActivityData(),
                color: '#0073bb'
              }
            ]}
            xDomain={getUserActivityData().map(d => d.x)}
            yDomain={[0, Math.max(...getUserActivityData().map(d => d.y)) + 50]}
            xTitle="Date"
            yTitle="Active Users"
            height={250}
            hideFilter
            hideLegend
            xScaleType="categorical"
          />
        </Container>

        {/* Exam Volume */}
        <Container
          header={
            <Header variant="h3">
              Daily Exam Volume
            </Header>
          }
        >
          <BarChart
            series={[
              {
                title: 'Exams',
                type: 'bar',
                data: getExamVolumeData(),
                color: '#037f0c'
              }
            ]}
            xDomain={getExamVolumeData().map(d => d.x)}
            yDomain={[0, Math.max(...getExamVolumeData().map(d => d.y)) + 20]}
            xTitle="Date"
            yTitle="Number of Exams"
            height={250}
            hideFilter
            hideLegend
          />
        </Container>
      </ColumnLayout>

      {/* Certification Performance */}
      <Container
        header={
          <Header variant="h3" description="Performance breakdown by certification">
            Certification Performance
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          {mockAdminData.topCertifications.map((cert, index) => (
            <Box key={index}>
              <SpaceBetween direction="vertical" size="s">
                <SpaceBetween direction="horizontal" size="s">
                  <Box variant="h4" style={{ flex: 1 }}>
                    {cert.certification}
                  </Box>
                  <Badge color={cert.passRate >= 70 ? 'green' : cert.passRate >= 60 ? 'orange' : 'red'}>
                    {cert.passRate}% Pass Rate
                  </Badge>
                  <Box variant="h4">
                    {cert.attempts.toLocaleString()} attempts
                  </Box>
                </SpaceBetween>
                
                <ProgressBar
                  value={cert.passRate}
                  additionalInfo={`${cert.attempts.toLocaleString()} total attempts`}
                  variant={cert.passRate >= 70 ? 'success' : 'error'}
                />
              </SpaceBetween>
            </Box>
          ))}
        </SpaceBetween>
      </Container>

      {/* Domain Performance Heatmap */}
      <Container
        header={
          <Header variant="h3" description="Average scores by domain">
            Domain Performance
          </Header>
        }
      >
        <BarChart
          series={[
            {
              title: 'Average Score',
              type: 'bar',
              data: getDomainPerformanceData(),
              color: '#d13212'
            }
          ]}
          xDomain={getDomainPerformanceData().map(d => d.x)}
          yDomain={[0, 1000]}
          xTitle="Domain"
          yTitle="Average Score"
          height={300}
          hideFilter
          hideLegend
          horizontalBars
        />
      </Container>

      {/* Question Performance Issues */}
      <Container
        header={
          <Header
            variant="h3"
            description="Questions with low correct rates that may need review"
            counter={`(${mockAdminData.questionPerformance.length})`}
          >
            Question Performance Issues
          </Header>
        }
      >
        <Table
          columnDefinitions={questionPerformanceColumns}
          items={mockAdminData.questionPerformance}
          loadingText="Loading question performance..."
          empty={
            <Box textAlign="center" color="inherit">
              <b>No performance issues found</b>
              <Box variant="p" color="inherit">
                All questions are performing well.
              </Box>
            </Box>
          }
          header={
            <Header
              description="Questions with correct rates below 50%"
            >
              Low-Performing Questions
            </Header>
          }
          sortingDisabled
        />
      </Container>

      {/* System Health Alerts */}
      <SpaceBetween direction="vertical" size="s">
        <Alert type="success" header="System Status: Healthy">
          All systems are operating normally. No issues detected.
        </Alert>
        
        <Alert type="warning" header="Content Review Needed">
          5 questions have correct rates below 30% and should be reviewed for accuracy.
        </Alert>
        
        <Alert type="info" header="Usage Trend">
          Platform usage has increased by 15% compared to last month. Consider scaling resources.
        </Alert>
      </SpaceBetween>
    </SpaceBetween>
  )
}

export default AdminDashboard