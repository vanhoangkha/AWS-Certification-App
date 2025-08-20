import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Badge,
  Alert,
  Cards,
  ProgressBar,
  Modal,
  Button,
  ColumnLayout,
  Tabs
} from '@cloudscape-design/components'
import { formatDistanceToNow } from 'date-fns'
import type { Achievement, Streak, ProgressData } from '@/types'

interface AchievementSystemProps {
  userId: string
  progressData?: ProgressData
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  userId,
  progressData
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [activeTab, setActiveTab] = useState('achievements')

  // Mock achievements data
  const mockAchievements: Achievement[] = [
    {
      id: 'first-exam',
      title: 'First Steps',
      description: 'Completed your first practice exam',
      icon: 'star',
      earnedAt: '2024-01-10T12:00:00Z',
      category: 'exam'
    },
    {
      id: 'first-pass',
      title: 'Success!',
      description: 'Passed your first mock exam',
      icon: 'check',
      earnedAt: '2024-01-12T15:30:00Z',
      category: 'exam'
    },
    {
      id: 'streak-7',
      title: 'Consistent Learner',
      description: 'Practiced for 7 consecutive days',
      icon: 'calendar',
      earnedAt: '2024-01-15T18:00:00Z',
      category: 'streak'
    },
    {
      id: 'domain-master',
      title: 'Domain Expert',
      description: 'Scored 90%+ in all domains',
      icon: 'thumbs-up',
      earnedAt: '2024-01-18T20:30:00Z',
      category: 'exam'
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Completed an exam in under 60 minutes',
      icon: 'clock',
      earnedAt: '2024-01-20T14:15:00Z',
      category: 'exam'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Scored 1000 on a practice exam',
      icon: 'star-filled',
      earnedAt: '2024-01-22T11:45:00Z',
      category: 'exam'
    }
  ]

  // Mock streaks data
  const mockStreaks: Streak[] = [
    {
      type: 'daily',
      current: 12,
      longest: 18,
      lastActivity: '2024-01-22T19:00:00Z'
    },
    {
      type: 'weekly',
      current: 3,
      longest: 5,
      lastActivity: '2024-01-22T19:00:00Z'
    },
    {
      type: 'exam',
      current: 4,
      longest: 6,
      lastActivity: '2024-01-22T16:30:00Z'
    }
  ]

  // Available achievements (not yet earned)
  const availableAchievements = [
    {
      id: 'century-club',
      title: 'Century Club',
      description: 'Complete 100 practice questions',
      icon: 'star',
      progress: 67,
      requirement: 100,
      category: 'practice'
    },
    {
      id: 'multi-cert',
      title: 'Multi-Certified',
      description: 'Pass exams for 3 different certifications',
      icon: 'thumbs-up',
      progress: 1,
      requirement: 3,
      category: 'exam'
    },
    {
      id: 'streak-30',
      title: 'Dedication',
      description: 'Practice for 30 consecutive days',
      icon: 'calendar',
      progress: 12,
      requirement: 30,
      category: 'streak'
    },
    {
      id: 'high-scorer',
      title: 'High Scorer',
      description: 'Achieve an average score above 850',
      icon: 'trending-up',
      progress: 780,
      requirement: 850,
      category: 'exam'
    }
  ]

  const getAchievementIcon = (category: string) => {
    const iconMap = {
      exam: 'star',
      practice: 'check',
      streak: 'calendar',
      improvement: 'trending-up'
    }
    return iconMap[category as keyof typeof iconMap] || 'star'
  }

  const getAchievementColor = (category: string) => {
    const colorMap = {
      exam: 'blue',
      practice: 'green',
      streak: 'orange',
      improvement: 'purple'
    }
    return colorMap[category as keyof typeof colorMap] || 'blue'
  }

  const getCategoryBadge = (category: string) => {
    const labelMap = {
      exam: 'Exam',
      practice: 'Practice',
      streak: 'Streak',
      improvement: 'Improvement'
    }
    return (
      <Badge color={getAchievementColor(category)}>
        {labelMap[category as keyof typeof labelMap] || category}
      </Badge>
    )
  }

  const handleViewAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setShowAchievementModal(true)
  }

  const achievementsTab = (
    <SpaceBetween direction="vertical" size="l">
      {/* Recent Achievement Alert */}
      {mockAchievements.length > 0 && (
        <Alert type="success" header="Latest Achievement Unlocked!">
          <SpaceBetween direction="horizontal" size="s">
            <Box>
              <strong>{mockAchievements[mockAchievements.length - 1].title}</strong> - {mockAchievements[mockAchievements.length - 1].description}
            </Box>
            <Box variant="small" color="text-status-inactive">
              {formatDistanceToNow(new Date(mockAchievements[mockAchievements.length - 1].earnedAt), { addSuffix: true })}
            </Box>
          </SpaceBetween>
        </Alert>
      )}

      {/* Earned Achievements */}
      <Container
        header={
          <Header
            variant="h3"
            counter={`(${mockAchievements.length})`}
            description="Achievements you've unlocked"
          >
            Earned Achievements
          </Header>
        }
      >
        <Cards
          cardDefinition={{
            header: (item: Achievement) => (
              <SpaceBetween direction="horizontal" size="s">
                <Box variant="h4">{item.title}</Box>
                {getCategoryBadge(item.category)}
              </SpaceBetween>
            ),
            sections: [
              {
                content: (item: Achievement) => item.description
              },
              {
                content: (item: Achievement) => (
                  <SpaceBetween direction="horizontal" size="s">
                    <Box variant="small" color="text-status-inactive">
                      Earned {formatDistanceToNow(new Date(item.earnedAt), { addSuffix: true })}
                    </Box>
                    <Button
                      variant="link"
                      onClick={() => handleViewAchievement(item)}
                    >
                      View Details
                    </Button>
                  </SpaceBetween>
                )
              }
            ]
          }}
          items={mockAchievements}
          trackBy="id"
          variant="full-page"
        />
      </Container>

      {/* Available Achievements */}
      <Container
        header={
          <Header
            variant="h3"
            counter={`(${availableAchievements.length})`}
            description="Achievements you can work towards"
          >
            Available Achievements
          </Header>
        }
      >
        <Cards
          cardDefinition={{
            header: (item: any) => (
              <SpaceBetween direction="horizontal" size="s">
                <Box variant="h4">{item.title}</Box>
                {getCategoryBadge(item.category)}
              </SpaceBetween>
            ),
            sections: [
              {
                content: (item: any) => item.description
              },
              {
                content: (item: any) => (
                  <SpaceBetween direction="vertical" size="s">
                    <ProgressBar
                      value={(item.progress / item.requirement) * 100}
                      additionalInfo={`${item.progress} / ${item.requirement}`}
                      description="Progress towards achievement"
                    />
                    <Box variant="small" color="text-status-inactive">
                      {item.requirement - item.progress} more to unlock
                    </Box>
                  </SpaceBetween>
                )
              }
            ]
          }}
          items={availableAchievements}
          trackBy="id"
          variant="full-page"
        />
      </Container>
    </SpaceBetween>
  )

  const streaksTab = (
    <SpaceBetween direction="vertical" size="l">
      {/* Current Streaks */}
      <Container
        header={
          <Header variant="h3" description="Your current learning streaks">
            Active Streaks
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          {mockStreaks.map((streak, index) => (
            <Box key={index}>
              <SpaceBetween direction="vertical" size="s">
                <Box variant="h4">
                  {streak.type === 'daily' ? 'Daily Practice' : 
                   streak.type === 'weekly' ? 'Weekly Consistency' : 
                   'Exam Streak'}
                </Box>
                <Box variant="h1" color="text-status-success">
                  {streak.current}
                </Box>
                <Box variant="small" color="text-status-inactive">
                  Current streak
                </Box>
                <Box variant="small">
                  <strong>Personal best:</strong> {streak.longest}
                </Box>
                <Box variant="small" color="text-status-inactive">
                  Last activity: {formatDistanceToNow(new Date(streak.lastActivity), { addSuffix: true })}
                </Box>
              </SpaceBetween>
            </Box>
          ))}
        </ColumnLayout>
      </Container>

      {/* Streak Tips */}
      <Alert type="info" header="Maintain Your Streaks">
        <SpaceBetween direction="vertical" size="s">
          <Box>• Practice a little bit each day to maintain your daily streak</Box>
          <Box>• Take at least one exam per week to keep your weekly streak alive</Box>
          <Box>• Consistent practice leads to better retention and improved scores</Box>
          <Box>• Set reminders to help maintain your learning momentum</Box>
        </SpaceBetween>
      </Alert>
    </SpaceBetween>
  )

  const tabs = [
    {
      id: 'achievements',
      label: `Achievements (${mockAchievements.length})`,
      content: achievementsTab
    },
    {
      id: 'streaks',
      label: 'Streaks',
      content: streaksTab
    }
  ]

  return (
    <>
      <Container
        header={
          <Header
            variant="h2"
            description="Track your learning milestones and maintain study streaks"
          >
            Achievements & Streaks
          </Header>
        }
      >
        <Tabs
          activeTabId={activeTab}
          onChange={({ detail }) => setActiveTab(detail.activeTabId)}
          tabs={tabs}
        />
      </Container>

      {/* Achievement Detail Modal */}
      <Modal
        visible={showAchievementModal}
        onDismiss={() => setShowAchievementModal(false)}
        header="Achievement Details"
        footer={
          <Box float="right">
            <Button variant="primary" onClick={() => setShowAchievementModal(false)}>
              Close
            </Button>
          </Box>
        }
      >
        {selectedAchievement && (
          <SpaceBetween direction="vertical" size="m">
            <Box textAlign="center">
              <SpaceBetween direction="vertical" size="s">
                <Box variant="h1">🏆</Box>
                <Box variant="h2">{selectedAchievement.title}</Box>
                <Box>{selectedAchievement.description}</Box>
                {getCategoryBadge(selectedAchievement.category)}
              </SpaceBetween>
            </Box>

            <Alert type="success" header="Achievement Unlocked!">
              <SpaceBetween direction="vertical" size="s">
                <Box>
                  Congratulations! You earned this achievement on{' '}
                  {new Date(selectedAchievement.earnedAt).toLocaleDateString()}.
                </Box>
                <Box variant="small" color="text-status-inactive">
                  Keep up the great work and continue your learning journey!
                </Box>
              </SpaceBetween>
            </Alert>

            <ColumnLayout columns={2} variant="text-grid">
              <Box>
                <Box variant="awsui-key-label">Category</Box>
                <Box>{selectedAchievement.category}</Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Earned</Box>
                <Box>{formatDistanceToNow(new Date(selectedAchievement.earnedAt), { addSuffix: true })}</Box>
              </Box>
            </ColumnLayout>
          </SpaceBetween>
        )}
      </Modal>
    </>
  )
}

export default AchievementSystem