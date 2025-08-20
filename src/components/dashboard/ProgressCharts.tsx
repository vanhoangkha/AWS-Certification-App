import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Select,
  LineChart,
  BarChart,
  PieChart,
  ColumnLayout,
  Badge,
  Button
} from '@cloudscape-design/components'
import { formatDistanceToNow } from 'date-fns'
import type { ExamResult, ProgressData } from '@/types'

interface ProgressChartsProps {
  userId: string
  progressData?: ProgressData
  recentResults?: ExamResult[]
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({
  userId,
  progressData,
  recentResults = []
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [selectedCertification, setSelectedCertification] = useState('all')

  // Mock data for demonstration
  const mockProgressData: ProgressData = progressData || {
    userId,
    examAttempts: [
      {
        sessionId: 'session-1',
        certification: 'SAA-C03',
        examType: 'MOCK',
        scaledScore: 650,
        passed: false,
        completedAt: '2024-01-10T10:00:00Z',
        timeSpent: 120
      },
      {
        sessionId: 'session-2',
        certification: 'SAA-C03',
        examType: 'PRACTICE',
        scaledScore: 720,
        passed: true,
        completedAt: '2024-01-12T14:30:00Z',
        timeSpent: 90
      },
      {
        sessionId: 'session-3',
        certification: 'SAA-C03',
        examType: 'MOCK',
        scaledScore: 780,
        passed: true,
        completedAt: '2024-01-15T09:15:00Z',
        timeSpent: 110
      },
      {
        sessionId: 'session-4',
        certification: 'SAA-C03',
        examType: 'CUSTOM',
        scaledScore: 820,
        passed: true,
        completedAt: '2024-01-18T16:45:00Z',
        timeSpent: 85
      },
      {
        sessionId: 'session-5',
        certification: 'CLF-C01',
        examType: 'MOCK',
        scaledScore: 750,
        passed: true,
        completedAt: '2024-01-20T11:20:00Z',
        timeSpent: 75
      }
    ],
    domainProgress: [
      {
        domain: 'Design Secure Architectures',
        averageScore: 750,
        totalAttempts: 8,
        improvement: 15,
        lastAttempt: '2024-01-20T10:00:00Z'
      },
      {
        domain: 'Design Resilient Architectures',
        averageScore: 680,
        totalAttempts: 6,
        improvement: -5,
        lastAttempt: '2024-01-19T14:30:00Z'
      },
      {
        domain: 'Design High-Performing Architectures',
        averageScore: 720,
        totalAttempts: 7,
        improvement: 25,
        lastAttempt: '2024-01-18T09:15:00Z'
      },
      {
        domain: 'Design Cost-Optimized Architectures',
        averageScore: 800,
        totalAttempts: 5,
        improvement: 10,
        lastAttempt: '2024-01-17T16:45:00Z'
      }
    ],
    achievements: [],
    streaks: []
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
    { label: 'DVA-C01', value: 'DVA-C01' }
  ]

  // Score trend data
  const getScoreTrendData = () => {
    const filteredAttempts = mockProgressData.examAttempts
      .filter(attempt => selectedCertification === 'all' || attempt.certification === selectedCertification)
      .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())

    return filteredAttempts.map((attempt, index) => ({
      x: new Date(attempt.completedAt).toLocaleDateString(),
      y: attempt.scaledScore
    }))
  }

  // Domain performance data
  const getDomainPerformanceData = () => {
    return mockProgressData.domainProgress.map(domain => ({
      x: domain.domain.replace('Design ', ''),
      y: domain.averageScore
    }))
  }

  // Exam type distribution
  const getExamTypeDistribution = () => {
    const distribution = mockProgressData.examAttempts.reduce((acc, attempt) => {
      acc[attempt.examType] = (acc[attempt.examType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(distribution).map(([type, count]) => ({
      title: type,
      value: count,
      color: type === 'MOCK' ? '#0073bb' : type === 'PRACTICE' ? '#037f0c' : '#d13212'
    }))
  }

  // Pass/Fail distribution
  const getPassFailDistribution = () => {
    const passed = mockProgressData.examAttempts.filter(a => a.passed).length
    const failed = mockProgressData.examAttempts.length - passed

    return [
      { title: 'Passed', value: passed, color: '#037f0c' },
      { title: 'Failed', value: failed, color: '#d13212' }
    ]
  }

  // Time spent analysis
  const getTimeSpentData = () => {
    return mockProgressData.examAttempts.map((attempt, index) => ({
      x: `Exam ${index + 1}`,
      y: attempt.timeSpent
    }))
  }

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
            placeholder="Select time range"
          />
          <Select
            selectedOption={
              certificationOptions.find(opt => opt.value === selectedCertification) ||
              certificationOptions[0]
            }
            onChange={({ detail }) => setSelectedCertification(detail.selectedOption.value || 'all')}
            options={certificationOptions}
            placeholder="Select certification"
          />
        </SpaceBetween>
      </Container>

      {/* Score Trend Chart */}
      <Container
        header={
          <Header
            variant="h3"
            description="Track your score improvement over time"
            actions={
              <Button variant="icon" iconName="refresh" onClick={() => {
                // Refresh data
                console.log('Refreshing score trend data')
              }} />
            }
          >
            Score Trend
          </Header>
        }
      >
        {getScoreTrendData().length > 0 ? (
          <LineChart
            series={[
              {
                title: 'Scaled Score',
                type: 'line',
                data: getScoreTrendData(),
                color: '#0073bb'
              }
            ]}
            xDomain={getScoreTrendData().map(d => d.x)}
            yDomain={[0, 1000]}
            xTitle="Exam Date"
            yTitle="Scaled Score"
            height={300}
            hideFilter
            hideLegend
            emphasizeBaselineAxis={false}
            xScaleType="categorical"
          />
        ) : (
          <Box textAlign="center" color="inherit">
            <b>No exam data available</b>
            <Box variant="p" color="inherit">
              Take your first exam to see your progress here.
            </Box>
          </Box>
        )}
      </Container>

      {/* Charts Grid */}
      <ColumnLayout columns={2} variant="text-grid">
        {/* Domain Performance */}
        <Container
          header={
            <Header variant="h3">
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
                color: '#037f0c'
              }
            ]}
            xDomain={getDomainPerformanceData().map(d => d.x)}
            yDomain={[0, 1000]}
            xTitle="Domain"
            yTitle="Average Score"
            height={250}
            hideFilter
            hideLegend
            horizontalBars
          />
        </Container>

        {/* Exam Type Distribution */}
        <Container
          header={
            <Header variant="h3">
              Exam Type Distribution
            </Header>
          }
        >
          <PieChart
            data={getExamTypeDistribution()}
            detailPopoverContent={(segment, sum) => [
              { key: 'Exam type', value: segment.title },
              { key: 'Attempts', value: segment.value },
              { key: 'Percentage', value: `${((segment.value / sum) * 100).toFixed(1)}%` }
            ]}
            segmentDescription={(segment, sum) => 
              `${segment.value} attempts, ${((segment.value / sum) * 100).toFixed(1)}%`
            }
            ariaDescription="Chart showing distribution of exam types"
            ariaLabel="Exam type distribution"
            errorText="Error loading data."
            loadingText="Loading chart"
            recoveryText="Retry"
            empty={
              <Box textAlign="center" color="inherit">
                <b>No data available</b>
              </Box>
            }
            hideFilter
            hideLegend={false}
            hideTitles={false}
            innerMetricDescription="exams"
            innerMetricValue={mockProgressData.examAttempts.length.toString()}
            variant="pie"
            size="medium"
          />
        </Container>
      </ColumnLayout>

      {/* Additional Charts */}
      <ColumnLayout columns={2} variant="text-grid">
        {/* Pass/Fail Distribution */}
        <Container
          header={
            <Header variant="h3">
              Pass/Fail Rate
            </Header>
          }
        >
          <PieChart
            data={getPassFailDistribution()}
            detailPopoverContent={(segment, sum) => [
              { key: 'Result', value: segment.title },
              { key: 'Count', value: segment.value },
              { key: 'Percentage', value: `${((segment.value / sum) * 100).toFixed(1)}%` }
            ]}
            segmentDescription={(segment, sum) => 
              `${segment.value} exams, ${((segment.value / sum) * 100).toFixed(1)}%`
            }
            ariaDescription="Chart showing pass/fail distribution"
            ariaLabel="Pass/fail rate"
            hideFilter
            hideLegend={false}
            innerMetricDescription="pass rate"
            innerMetricValue={`${Math.round((getPassFailDistribution()[0].value / mockProgressData.examAttempts.length) * 100)}%`}
            variant="pie"
            size="medium"
          />
        </Container>

        {/* Time Spent Analysis */}
        <Container
          header={
            <Header variant="h3">
              Time Spent per Exam
            </Header>
          }
        >
          <BarChart
            series={[
              {
                title: 'Time (minutes)',
                type: 'bar',
                data: getTimeSpentData(),
                color: '#d13212'
              }
            ]}
            xDomain={getTimeSpentData().map(d => d.x)}
            yDomain={[0, Math.max(...getTimeSpentData().map(d => d.y)) + 20]}
            xTitle="Exam"
            yTitle="Time (minutes)"
            height={250}
            hideFilter
            hideLegend
          />
        </Container>
      </ColumnLayout>

      {/* Performance Summary */}
      <Container
        header={
          <Header variant="h3">
            Performance Summary
          </Header>
        }
      >
        <ColumnLayout columns={4} variant="text-grid">
          <Box>
            <Box variant="awsui-key-label">Total Exams</Box>
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
            <Box variant="awsui-key-label">Average Score</Box>
            <Box variant="h2">
              {Math.round(mockProgressData.examAttempts.reduce((sum, a) => sum + a.scaledScore, 0) / mockProgressData.examAttempts.length)}
            </Box>
            <Box variant="small" color="text-status-inactive">
              Overall average
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Pass Rate</Box>
            <Box variant="h2">
              <Badge color="green">
                {Math.round((mockProgressData.examAttempts.filter(a => a.passed).length / mockProgressData.examAttempts.length) * 100)}%
              </Badge>
            </Box>
            <Box variant="small" color="text-status-inactive">
              Success rate
            </Box>
          </Box>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  )
}

export default ProgressCharts