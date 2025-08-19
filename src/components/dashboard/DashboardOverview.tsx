import React from 'react'
import {
    Container,
    Header,
    SpaceBetween,
    Box,
    ColumnLayout,
    Badge,
    Button,
    Alert,
    Cards
} from '@cloudscape-design/components'
import { useAuth } from '@/contexts/AuthContext'

const DashboardOverview: React.FC = () => {
    const { user } = useAuth()

    const mockStats = {
        totalExams: 5,
        bestScore: 850,
        averageScore: 720,
        passRate: 80
    }

    const quickActions = [
        {
            title: 'Take Mock Exam',
            description: 'Full-length practice exam with timer',
            action: 'Start Mock Exam',
            href: '/exam/mock'
        },
        {
            title: 'Practice Questions',
            description: 'Study with immediate feedback',
            action: 'Start Practice',
            href: '/practice'
        },
        {
            title: 'Custom Exam',
            description: 'Create personalized exam',
            action: 'Build Exam',
            href: '/practice?tab=custom'
        },
        {
            title: 'View Results',
            description: 'Review past exam results',
            action: 'View Results',
            href: '/results'
        }
    ]

    return (
        <SpaceBetween direction="vertical" size="l">
            {/* Welcome Section */}
            <Container
                header={
                    <Header variant="h2">
                        Welcome back, {user?.name || 'Student'}!
                    </Header>
                }
            >
                <Alert type="info" header="Ready to practice?">
                    Choose from mock exams, practice questions, or create custom exams to focus on specific areas.
                </Alert>
            </Container>

            {/* Quick Stats */}
            <Container
                header={
                    <Header variant="h3">
                        Your Progress
                    </Header>
                }
            >
                <ColumnLayout columns={4} variant="text-grid">
                    <Box>
                        <Box variant="awsui-key-label">Total Exams</Box>
                        <Box variant="h2">{mockStats.totalExams}</Box>
                    </Box>
                    <Box>
                        <Box variant="awsui-key-label">Best Score</Box>
                        <Box variant="h2" color="text-status-success">{mockStats.bestScore}</Box>
                    </Box>
                    <Box>
                        <Box variant="awsui-key-label">Average Score</Box>
                        <Box variant="h2">{mockStats.averageScore}</Box>
                    </Box>
                    <Box>
                        <Box variant="awsui-key-label">Pass Rate</Box>
                        <Box variant="h2">
                            <Badge color="green">{mockStats.passRate}%</Badge>
                        </Box>
                    </Box>
                </ColumnLayout>
            </Container>

            {/* Quick Actions */}
            <Container
                header={
                    <Header variant="h3">
                        Quick Actions
                    </Header>
                }
            >
                <Cards
                    cardDefinition={{
                        header: (item: any) => item.title,
                        sections: [
                            {
                                content: (item: any) => item.description
                            },
                            {
                                content: (item: any) => (
                                    <Button variant="primary" href={item.href}>
                                        {item.action}
                                    </Button>
                                )
                            }
                        ]
                    }}
                    items={quickActions}
                    trackBy="title"
                    variant="full-page"
                />
            </Container>
        </SpaceBetween>
    )
}

export default DashboardOverview