import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Form,
  FormField,
  Input,
  Select,
  Button,
  Box,
  Alert,
  Cards,
  Badge,
  ProgressBar
} from '@cloudscape-design/components'
import { useAuth } from '@/contexts/AuthContext'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    targetCertification: 'CLF-C01',
    studyGoal: 'pass-exam',
    experienceLevel: 'beginner'
  })

  const certificationOptions = [
    { label: 'AWS Certified Cloud Practitioner', value: 'CLF-C01' },
    { label: 'AWS Certified Solutions Architect - Associate', value: 'SAA-C03' },
    { label: 'AWS Certified Developer - Associate', value: 'DVA-C01' },
    { label: 'AWS Certified SysOps Administrator - Associate', value: 'SOA-C02' }
  ]

  const studyGoalOptions = [
    { label: 'Pass the certification exam', value: 'pass-exam' },
    { label: 'Improve AWS knowledge', value: 'improve-knowledge' },
    { label: 'Career advancement', value: 'career-advancement' },
    { label: 'Personal development', value: 'personal-development' }
  ]

  const experienceLevelOptions = [
    { label: 'Beginner (0-1 years)', value: 'beginner' },
    { label: 'Intermediate (1-3 years)', value: 'intermediate' },
    { label: 'Advanced (3+ years)', value: 'advanced' }
  ]

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const achievements = [
    {
      title: 'First Practice Session',
      description: 'Completed your first practice session',
      earned: true,
      date: '2024-01-15'
    },
    {
      title: 'Study Streak',
      description: 'Studied for 7 consecutive days',
      earned: true,
      date: '2024-01-20'
    },
    {
      title: 'Domain Master',
      description: 'Achieved 90% accuracy in a domain',
      earned: false,
      date: null
    },
    {
      title: 'Mock Exam Champion',
      description: 'Passed a mock exam with 80%+ score',
      earned: false,
      date: null
    }
  ]

  const studyStats = [
    { label: 'Total Study Hours', value: '24.5', trend: '+2.5 this week' },
    { label: 'Questions Answered', value: '1,247', trend: '+89 this week' },
    { label: 'Practice Sessions', value: '18', trend: '+3 this week' },
    { label: 'Average Score', value: '78%', trend: '+5% improvement' }
  ]

  return (
    <SpaceBetween direction="vertical" size="l">
      <Container
        header={
          <Header
            variant="h2"
            actions={
              <Button
                variant={isEditing ? 'primary' : 'normal'}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            }
          >
            Profile Settings
          </Header>
        }
      >
        <Form>
          <SpaceBetween direction="vertical" size="l">
            <FormField label="Full Name">
              <Input
                value={formData.name}
                onChange={({ detail }) => setFormData(prev => ({ ...prev, name: detail.value }))}
                disabled={!isEditing}
              />
            </FormField>

            <FormField label="Email Address">
              <Input
                value={formData.email}
                onChange={({ detail }) => setFormData(prev => ({ ...prev, email: detail.value }))}
                disabled={!isEditing}
                type="email"
              />
            </FormField>

            <FormField label="Target Certification">
              <Select
                selectedOption={certificationOptions.find(opt => opt.value === formData.targetCertification)}
                onChange={({ detail }) => setFormData(prev => ({ ...prev, targetCertification: detail.selectedOption.value! }))}
                options={certificationOptions}
                disabled={!isEditing}
              />
            </FormField>

            <FormField label="Study Goal">
              <Select
                selectedOption={studyGoalOptions.find(opt => opt.value === formData.studyGoal)}
                onChange={({ detail }) => setFormData(prev => ({ ...prev, studyGoal: detail.selectedOption.value! }))}
                options={studyGoalOptions}
                disabled={!isEditing}
              />
            </FormField>

            <FormField label="AWS Experience Level">
              <Select
                selectedOption={experienceLevelOptions.find(opt => opt.value === formData.experienceLevel)}
                onChange={({ detail }) => setFormData(prev => ({ ...prev, experienceLevel: detail.selectedOption.value! }))}
                options={experienceLevelOptions}
                disabled={!isEditing}
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </Container>

      <Container
        header={<Header variant="h2">Study Statistics</Header>}
      >
        <SpaceBetween direction="vertical" size="l">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {studyStats.map((stat, index) => (
              <Box key={index} padding="m" variant="div">
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="awsui-key-label">{stat.label}</Box>
                  <Box fontSize="display-l" fontWeight="bold">{stat.value}</Box>
                  <Box variant="small" color="text-status-success">{stat.trend}</Box>
                </SpaceBetween>
              </Box>
            ))}
          </div>

          <Box>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="h3">Study Progress</Box>
              <ProgressBar
                value={65}
                additionalInfo="65% towards certification readiness"
                description="Based on your practice performance and study consistency"
              />
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={<Header variant="h2">Achievements</Header>}
      >
        <Cards
          cardDefinition={{
            header: (item: any) => (
              <SpaceBetween direction="horizontal" size="xs">
                <Box variant="h3">{item.title}</Box>
                {item.earned ? (
                  <Badge color="green">Earned</Badge>
                ) : (
                  <Badge color="grey">Locked</Badge>
                )}
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
          items={achievements}
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
    </SpaceBetween>
  )
}

export default ProfilePage