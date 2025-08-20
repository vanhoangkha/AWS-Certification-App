import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Select,
  FormField,
  Alert,
  Box,
  Cards,
  Icon,
  Badge,
  Grid,
  Modal,
  RadioGroup,
  Checkbox
} from '@cloudscape-design/components'
import { useNavigate } from 'react-router-dom'

const PracticePage: React.FC = () => {
  const navigate = useNavigate()
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [practiceMode, setPracticeMode] = useState('quick-practice')
  const [practiceConfig, setPracticeConfig] = useState({
    certification: 'CLF-C01',
    domains: [] as string[],
    difficulty: undefined as 'EASY' | 'MEDIUM' | 'HARD' | undefined,
    questionCount: 25,
    feedbackMode: 'immediate' as 'immediate' | 'end' | 'none'
  })

  const certificationOptions = [
    { label: 'AWS Certified Cloud Practitioner (CLF-C01)', value: 'CLF-C01' },
    { label: 'AWS Certified Solutions Architect - Associate (SAA-C03)', value: 'SAA-C03' },
    { label: 'AWS Certified Developer - Associate (DVA-C01)', value: 'DVA-C01' },
    { label: 'AWS Certified SysOps Administrator - Associate (SOA-C02)', value: 'SOA-C02' }
  ]

  const questionCountOptions = [
    { label: '10 questions (Quick practice)', value: '10' },
    { label: '25 questions (Standard)', value: '25' },
    { label: '50 questions (Extended)', value: '50' }
  ]

  const feedbackModeOptions = [
    { label: 'Immediate feedback', value: 'immediate' },
    { label: 'Feedback at the end', value: 'end' },
    { label: 'No feedback (Exam mode)', value: 'none' }
  ]

  const domainOptions: Record<string, string[]> = {
    'CLF-C01': [
      'Cloud Concepts',
      'Security and Compliance',
      'Technology',
      'Billing and Pricing'
    ],
    'SAA-C03': [
      'Design Secure Architectures',
      'Design Resilient Architectures',
      'Design High-Performing Architectures',
      'Design Cost-Optimized Architectures'
    ]
  }

  const practiceOptions = [
    {
      id: 'quick-practice',
      title: 'Quick Practice',
      description: 'Jump right into practice with default settings',
      icon: 'flash',
      color: '#146EB4',
      badge: 'Recommended',
      action: () => {
        // Start practice immediately with default settings
        console.log('Starting quick practice...')
      }
    },
    {
      id: 'custom-practice',
      title: 'Custom Practice',
      description: 'Configure your practice session settings',
      icon: 'settings',
      color: '#037F0C',
      badge: null,
      action: () => {
        setPracticeMode('custom-practice')
        setShowConfigModal(true)
      }
    },
    {
      id: 'domain-focus',
      title: 'Domain Focus',
      description: 'Practice specific certification domains',
      icon: 'folder',
      color: '#FF9900',
      badge: null,
      action: () => {
        setPracticeMode('domain-focus')
        setShowConfigModal(true)
      }
    },
    {
      id: 'weak-areas',
      title: 'Weak Areas',
      description: 'Focus on your challenging topics',
      icon: 'status-warning',
      color: '#D13212',
      badge: 'Smart',
      action: () => {
        console.log('Starting weak areas practice...')
      }
    }
  ]

  const recentSessions = [
    {
      date: '2024-02-12',
      certification: 'CLF-C01',
      score: 85,
      questions: 25,
      duration: '32 min',
      domains: ['Cloud Concepts', 'Security']
    },
    {
      date: '2024-02-11',
      certification: 'CLF-C01',
      score: 78,
      questions: 50,
      duration: '45 min',
      domains: ['Technology', 'Billing']
    },
    {
      date: '2024-02-10',
      certification: 'SAA-C03',
      score: 82,
      questions: 25,
      duration: '28 min',
      domains: ['Design Secure Architectures']
    }
  ]

  const handleStartPractice = () => {
    console.log('Starting practice with config:', practiceConfig)
    setShowConfigModal(false)
    // Navigate to practice interface or start practice session
  }

  return (
    <SpaceBetween direction="vertical" size="l">
      <Alert type="info" header="Practice Mode">
        Study AWS certification questions with instant feedback, detailed explanations, and reference links. 
        Choose your practice style below to get started.
      </Alert>

      {/* Practice Options */}
      <Container
        header={
          <Header variant="h2" description="Choose how you want to practice">
            Practice Options
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
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="h3">{item.title}</Box>
                  {item.badge && (
                    <Badge color={item.id === 'quick-practice' ? 'blue' : 'green'}>
                      {item.badge}
                    </Badge>
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
                      variant={item.id === 'quick-practice' ? 'primary' : 'normal'}
                      onClick={item.action}
                      fullWidth
                    >
                      {item.title}
                    </Button>
                  </SpaceBetween>
                )
              }
            ]
          }}
          items={practiceOptions}
          loadingText="Loading practice options"
          cardsPerRow={[
            { cards: 1 },
            { minWidth: 500, cards: 2 },
            { minWidth: 800, cards: 4 }
          ]}
        />
      </Container>

      {/* Recent Practice Sessions */}
      <Container
        header={
          <Header 
            variant="h2" 
            description="Your recent practice sessions"
            actions={
              <Button
                variant="normal"
                onClick={() => navigate('/results')}
              >
                View All Results
              </Button>
            }
          >
            Recent Sessions
          </Header>
        }
      >
        <Cards
          cardDefinition={{
            header: (item: any) => (
              <SpaceBetween direction="horizontal" size="s" alignItems="center">
                <Box variant="h3">{item.certification}</Box>
                <Box variant="small" color="text-status-inactive">{item.date}</Box>
              </SpaceBetween>
            ),
            sections: [
              {
                content: (item: any) => (
                  <SpaceBetween direction="vertical" size="s">
                    <Grid
                      gridDefinition={[
                        { colspan: 4 },
                        { colspan: 4 },
                        { colspan: 4 }
                      ]}
                    >
                      <SpaceBetween direction="vertical" size="xs">
                        <Box variant="awsui-key-label">Score</Box>
                        <Box fontSize="heading-m" fontWeight="bold">{item.score}%</Box>
                      </SpaceBetween>
                      <SpaceBetween direction="vertical" size="xs">
                        <Box variant="awsui-key-label">Questions</Box>
                        <Box fontSize="heading-m">{item.questions}</Box>
                      </SpaceBetween>
                      <SpaceBetween direction="vertical" size="xs">
                        <Box variant="awsui-key-label">Duration</Box>
                        <Box fontSize="heading-m">{item.duration}</Box>
                      </SpaceBetween>
                    </Grid>
                    <SpaceBetween direction="vertical" size="xs">
                      <Box variant="awsui-key-label">Domains Practiced</Box>
                      <SpaceBetween direction="horizontal" size="xs">
                        {item.domains.map((domain: string, index: number) => (
                          <Badge key={index}>{domain}</Badge>
                        ))}
                      </SpaceBetween>
                    </SpaceBetween>
                  </SpaceBetween>
                )
              }
            ]
          }}
          items={recentSessions}
          loadingText="Loading sessions"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No practice sessions yet</b>
              <Box variant="p" color="inherit">
                Start practicing to see your session history here.
              </Box>
            </Box>
          }
        />
      </Container>

      {/* Configuration Modal */}
      <Modal
        visible={showConfigModal}
        onDismiss={() => setShowConfigModal(false)}
        header={`Configure ${practiceMode === 'custom-practice' ? 'Custom Practice' : 'Domain Focus'}`}
        closeAriaLabel="Close modal"
        size="medium"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleStartPractice}>
                Start Practice
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="l">
          <FormField label="Certification">
            <Select
              selectedOption={certificationOptions.find(opt => opt.value === practiceConfig.certification) || null}
              onChange={({ detail }) => setPracticeConfig(prev => ({ 
                ...prev, 
                certification: detail.selectedOption.value! as any 
              }))}
              options={certificationOptions}
            />
          </FormField>

          {practiceMode === 'domain-focus' && (
            <FormField label="Domains to Practice">
              <SpaceBetween direction="vertical" size="s">
                {domainOptions[practiceConfig.certification]?.map((domain, index) => (
                  <Checkbox
                    key={index}
                    checked={practiceConfig.domains.includes(domain)}
                    onChange={({ detail }) => {
                      const newDomains = detail.checked
                        ? [...practiceConfig.domains, domain]
                        : practiceConfig.domains.filter(d => d !== domain)
                      setPracticeConfig(prev => ({ ...prev, domains: newDomains }))
                    }}
                  >
                    {domain}
                  </Checkbox>
                ))}
              </SpaceBetween>
            </FormField>
          )}

          <FormField label="Number of Questions">
            <Select
              selectedOption={questionCountOptions.find(opt => parseInt(opt.value) === practiceConfig.questionCount) || null}
              onChange={({ detail }) => setPracticeConfig(prev => ({ 
                ...prev, 
                questionCount: parseInt(detail.selectedOption.value!) 
              }))}
              options={questionCountOptions}
            />
          </FormField>

          <FormField label="Difficulty Level (Optional)">
            <RadioGroup
              value={practiceConfig.difficulty || ''}
              onChange={({ detail }) => setPracticeConfig(prev => ({ 
                ...prev, 
                difficulty: detail.value as any || undefined 
              }))}
              items={[
                { value: '', label: 'All difficulties' },
                { value: 'EASY', label: 'Easy' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HARD', label: 'Hard' }
              ]}
            />
          </FormField>

          <FormField label="Feedback Mode">
            <RadioGroup
              value={practiceConfig.feedbackMode}
              onChange={({ detail }) => setPracticeConfig(prev => ({ 
                ...prev, 
                feedbackMode: detail.value as any 
              }))}
              items={feedbackModeOptions}
            />
          </FormField>
        </SpaceBetween>
      </Modal>
    </SpaceBetween>
  )
}

export default PracticePage