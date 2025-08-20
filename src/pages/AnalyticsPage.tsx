import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Cards,
  ProgressBar,
  LineChart,
  BarChart,
  PieChart,
  Select,
  DateRangePicker,
  KpiCard,
  Grid
} from '@cloudscape-design/components'

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('last-30-days')
  const [certification, setCertification] = useState('all')

  const timeRangeOptions = [
    { label: 'Last 7 days', value: 'last-7-days' },
    { label: 'Last 30 days', value: 'last-30-days' },
    { label: 'Last 90 days', value: 'last-90-days' },
    { label: 'This year', value: 'this-year' }
  ]

  const certificationOptions = [
    { label: 'All Certifications', value: 'all' },
    { label: 'AWS Certified Cloud Practitioner', value: 'CLF-C01' },
    { label: 'AWS Certified Solutions Architect - Associate', value: 'SAA-C03' },
    { label: 'AWS Certified Developer - Associate', value: 'DVA-C01' }
  ]

  // Mock data for charts
  const studyProgressData = [
    { x: new Date('2024-01-01'), y: 45 },
    { x: new Date('2024-01-08'), y: 52 },
    { x: new Date('2024-01-15'), y: 58 },
    { x: new Date('2024-01-22'), y: 65 },
    { x: new Date('2024-01-29'), y: 72 },
    { x: new Date('2024-02-05'), y: 78 },
    { x: new Date('2024-02-12'), y: 82 }
  ]

  const domainPerformanceData = [
    { x: 'Cloud Concepts', y: 85 },
    { x: 'Security & Compliance', y: 72 },
    { x: 'Technology', y: 78 },
    { x: 'Billing & Pricing', y: 90 }
  ]

  const difficultyBreakdownData = [
    { title: 'Easy', value: 45, color: '#1f77b4' },
    { title: 'Medium', value: 35, color: '#ff7f0e' },
    { title: 'Hard', value: 20, color: '#d62728' }
  ]

  const weeklyActivityData = [
    { x: 'Mon', y: 2.5 },
    { x: 'Tue', y: 1.8 },
    { x: 'Wed', y: 3.2 },
    { x: 'Thu', y: 2.1 },
    { x: 'Fri', y: 1.5 },
    { x: 'Sat', y: 4.2 },
    { x: 'Sun', y: 3.8 }
  ]

  const kpiData = [
    {
      title: 'Overall Score',
      value: '78%',
      change: '+5%',
      changeType: 'positive' as const,
      description: 'Average across all practice sessions'
    },
    {
      title: 'Study Streak',
      value: '12 days',
      change: '+3 days',
      changeType: 'positive' as const,
      description: 'Current consecutive study days'
    },
    {
      title: 'Questions Answered',
      value: '1,247',
      change: '+89',
      changeType: 'positive' as const,
      description: 'Total questions completed'
    },
    {
      title: 'Time Studied',
      value: '24.5h',
      change: '+2.5h',
      changeType: 'positive' as const,
      description: 'This month'
    }
  ]

  const recentSessions = [
    {
      date: '2024-02-12',
      type: 'Practice',
      certification: 'CLF-C01',
      score: 85,
      questions: 25,
      duration: '32 min'
    },
    {
      date: '2024-02-11',
      type: 'Mock Exam',
      certification: 'CLF-C01',
      score: 78,
      questions: 65,
      duration: '95 min'
    },
    {
      date: '2024-02-10',
      type: 'Practice',
      certification: 'CLF-C01',
      score: 82,
      questions: 50,
      duration: '45 min'
    }
  ]

  return (
    <SpaceBetween direction="vertical" size="l">
      <Container
        header={
          <Header
            variant="h1"
            actions={
              <SpaceBetween direction="horizontal" size="s">
                <Select
                  selectedOption={certificationOptions.find(opt => opt.value === certification)}
                  onChange={({ detail }) => setCertification(detail.selectedOption.value!)}
                  options={certificationOptions}
                />
                <Select
                  selectedOption={timeRangeOptions.find(opt => opt.value === timeRange)}
                  onChange={({ detail }) => setTimeRange(detail.selectedOption.value!)}
                  options={timeRangeOptions}
                />
              </SpaceBetween>
            }
          >
            Study Analytics
          </Header>
        }
      >
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xs: 6, s: 3 } },
            { colspan: { default: 12, xs: 6, s: 3 } },
            { colspan: { default: 12, xs: 6, s: 3 } },
            { colspan: { default: 12, xs: 6, s: 3 } }
          ]}
        >
          {kpiData.map((kpi, index) => (
            <Box key={index}>
              <SpaceBetween direction="vertical" size="xs">
                <Box variant="awsui-key-label">{kpi.title}</Box>
                <Box fontSize="display-l" fontWeight="bold">{kpi.value}</Box>
                <Box variant="small" color="text-status-success">{kpi.change}</Box>
                <Box variant="small" color="text-status-inactive">{kpi.description}</Box>
              </SpaceBetween>
            </Box>
          ))}
        </Grid>
      </Container>

      <Grid
        gridDefinition={[
          { colspan: { default: 12, l: 8 } },
          { colspan: { default: 12, l: 4 } }
        ]}
      >
        <Container
          header={<Header variant="h2">Study Progress Over Time</Header>}
        >
          <LineChart
            series={[
              {
                title: 'Average Score (%)',
                type: 'line',
                data: studyProgressData
              }
            ]}
            xDomain={[new Date('2024-01-01'), new Date('2024-02-12')]}
            yDomain={[0, 100]}
            i18nStrings={{
              filterLabel: 'Filter displayed data',
              filterPlaceholder: 'Filter data',
              filterSelectedAriaLabel: 'selected',
              legendAriaLabel: 'Legend',
              chartAriaRoleDescription: 'line chart'
            }}
            ariaLabel="Study progress over time"
            height={300}
          />
        </Container>

        <Container
          header={<Header variant="h2">Question Difficulty</Header>}
        >
          <PieChart
            data={difficultyBreakdownData}
            ariaLabel="Question difficulty breakdown"
            i18nStrings={{
              filterLabel: 'Filter displayed data',
              filterPlaceholder: 'Filter data',
              filterSelectedAriaLabel: 'selected',
              detailPopoverDismissAriaLabel: 'Dismiss',
              legendAriaLabel: 'Legend',
              chartAriaRoleDescription: 'pie chart',
              segmentAriaRoleDescription: 'segment'
            }}
            hideFilter
            size="medium"
          />
        </Container>
      </Grid>

      <Grid
        gridDefinition={[
          { colspan: { default: 12, l: 6 } },
          { colspan: { default: 12, l: 6 } }
        ]}
      >
        <Container
          header={<Header variant="h2">Domain Performance</Header>}
        >
          <BarChart
            series={[
              {
                title: 'Score (%)',
                type: 'bar',
                data: domainPerformanceData
              }
            ]}
            xDomain={domainPerformanceData.map(d => d.x)}
            yDomain={[0, 100]}
            i18nStrings={{
              filterLabel: 'Filter displayed data',
              filterPlaceholder: 'Filter data',
              filterSelectedAriaLabel: 'selected',
              legendAriaLabel: 'Legend',
              chartAriaRoleDescription: 'bar chart'
            }}
            ariaLabel="Domain performance"
            height={300}
          />
        </Container>

        <Container
          header={<Header variant="h2">Weekly Study Activity</Header>}
        >
          <BarChart
            series={[
              {
                title: 'Hours Studied',
                type: 'bar',
                data: weeklyActivityData
              }
            ]}
            xDomain={weeklyActivityData.map(d => d.x)}
            yDomain={[0, 5]}
            i18nStrings={{
              filterLabel: 'Filter displayed data',
              filterPlaceholder: 'Filter data',
              filterSelectedAriaLabel: 'selected',
              legendAriaLabel: 'Legend',
              chartAriaRoleDescription: 'bar chart'
            }}
            ariaLabel="Weekly study activity"
            height={300}
          />
        </Container>
      </Grid>

      <Container
        header={<Header variant="h2">Recent Study Sessions</Header>}
      >
        <Cards
          cardDefinition={{
            header: (item: any) => (
              <SpaceBetween direction="horizontal" size="xs">
                <Box variant="h3">{item.type}</Box>
                <Box variant="small" color="text-status-inactive">{item.date}</Box>
              </SpaceBetween>
            ),
            sections: [
              {
                content: (item: any) => (
                  <SpaceBetween direction="vertical" size="s">
                    <SpaceBetween direction="horizontal" size="l">
                      <Box>
                        <Box variant="awsui-key-label">Score</Box>
                        <Box fontSize="heading-m" fontWeight="bold">{item.score}%</Box>
                      </Box>
                      <Box>
                        <Box variant="awsui-key-label">Questions</Box>
                        <Box fontSize="heading-m">{item.questions}</Box>
                      </Box>
                      <Box>
                        <Box variant="awsui-key-label">Duration</Box>
                        <Box fontSize="heading-m">{item.duration}</Box>
                      </Box>
                    </SpaceBetween>
                    <ProgressBar
                      value={item.score}
                      additionalInfo={`${item.certification} - ${item.score}%`}
                    />
                  </SpaceBetween>
                )
              }
            ]
          }}
          items={recentSessions}
          loadingText="Loading sessions"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No study sessions found</b>
              <Box variant="p" color="inherit">
                Start practicing to see your analytics here.
              </Box>
            </Box>
          }
        />
      </Container>
    </SpaceBetween>
  )
}

export default AnalyticsPage