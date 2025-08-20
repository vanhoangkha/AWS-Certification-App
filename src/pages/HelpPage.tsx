import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Tabs,
  ExpandableSection,
  Alert,
  Link,
  Cards,
  Badge,
  Button
} from '@cloudscape-design/components'

const HelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('getting-started')

  const faqItems = [
    {
      question: 'How do I start practicing for my AWS certification?',
      answer: 'Navigate to the Practice page from the sidebar. Select your target certification, choose the domains you want to focus on, and start practicing. You can choose between immediate feedback mode or exam simulation mode.'
    },
    {
      question: 'What is the difference between Practice Mode and Mock Exams?',
      answer: 'Practice Mode allows you to study with immediate feedback, explanations, and references. Mock Exams simulate the real certification experience with time limits and no immediate feedback until completion.'
    },
    {
      question: 'How is my score calculated?',
      answer: 'AWS uses a scaled scoring system from 100-1000, with 700 being the passing score. Our platform simulates this scoring to give you realistic feedback on your readiness.'
    },
    {
      question: 'Can I import my own questions?',
      answer: 'Yes! Administrators can import questions via CSV files. The format includes question text, options, correct answers, explanations, and metadata like certification and domain.'
    },
    {
      question: 'How do I track my progress?',
      answer: 'Visit the Analytics page to see detailed charts of your performance over time, domain-specific scores, and study statistics. The Dashboard also provides a quick overview of your progress.'
    },
    {
      question: 'What certifications are supported?',
      answer: 'Currently we support AWS Cloud Practitioner (CLF-C01), Solutions Architect Associate (SAA-C03), Developer Associate (DVA-C01), and SysOps Administrator Associate (SOA-C02).'
    }
  ]

  const studyTips = [
    {
      title: 'Create a Study Schedule',
      description: 'Consistency is key. Set aside dedicated time each day for studying, even if it\'s just 30 minutes.',
      icon: '📅'
    },
    {
      title: 'Focus on Weak Areas',
      description: 'Use the analytics to identify domains where you\'re struggling and spend extra time on those topics.',
      icon: '🎯'
    },
    {
      title: 'Take Regular Mock Exams',
      description: 'Simulate the real exam experience regularly to build confidence and identify knowledge gaps.',
      icon: '📝'
    },
    {
      title: 'Review Explanations',
      description: 'Always read the explanations for both correct and incorrect answers to deepen your understanding.',
      icon: '💡'
    },
    {
      title: 'Use AWS Documentation',
      description: 'Follow the reference links provided with questions to read official AWS documentation.',
      icon: '📚'
    },
    {
      title: 'Join Study Groups',
      description: 'Connect with other learners to discuss concepts and share study strategies.',
      icon: '👥'
    }
  ]

  const certificationGuides = [
    {
      certification: 'AWS Certified Cloud Practitioner (CLF-C01)',
      description: 'Entry-level certification covering basic AWS cloud concepts, services, security, architecture, pricing, and support.',
      domains: [
        'Cloud Concepts (26%)',
        'Security and Compliance (25%)',
        'Technology (33%)',
        'Billing and Pricing (16%)'
      ],
      examDetails: {
        duration: '90 minutes',
        questions: '65 questions',
        passingScore: '700/1000',
        cost: '$100 USD'
      }
    },
    {
      certification: 'AWS Certified Solutions Architect - Associate (SAA-C03)',
      description: 'Validates ability to design distributed systems on AWS with focus on scalability, security, and cost optimization.',
      domains: [
        'Design Secure Architectures (30%)',
        'Design Resilient Architectures (26%)',
        'Design High-Performing Architectures (24%)',
        'Design Cost-Optimized Architectures (20%)'
      ],
      examDetails: {
        duration: '130 minutes',
        questions: '65 questions',
        passingScore: '720/1000',
        cost: '$150 USD'
      }
    }
  ]

  const tabs = [
    {
      id: 'getting-started',
      label: 'Getting Started',
      content: (
        <SpaceBetween direction="vertical" size="l">
          <Alert type="info">
            Welcome to the AWS Certification Practice Platform! This guide will help you get started with your certification journey.
          </Alert>

          <ExpandableSection headerText="Step 1: Set Up Your Profile" defaultExpanded>
            <SpaceBetween direction="vertical" size="s">
              <Box>
                Visit your <Link href="/profile">Profile page</Link> to configure your study preferences:
              </Box>
              <ul>
                <li>Select your target certification</li>
                <li>Set your study goals</li>
                <li>Choose your AWS experience level</li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Step 2: Start Practicing">
            <SpaceBetween direction="vertical" size="s">
              <Box>
                Go to the <Link href="/practice">Practice page</Link> to begin studying:
              </Box>
              <ul>
                <li>Choose your certification and domains</li>
                <li>Select difficulty level (optional)</li>
                <li>Pick between immediate feedback or exam mode</li>
                <li>Start answering questions!</li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Step 3: Take Mock Exams">
            <SpaceBetween direction="vertical" size="s">
              <Box>
                When you feel ready, take <Link href="/exam">Mock Exams</Link> to simulate the real experience:
              </Box>
              <ul>
                <li>Full-length timed exams</li>
                <li>Realistic question distribution</li>
                <li>Scaled scoring like the real exam</li>
                <li>Detailed results and recommendations</li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Step 4: Track Your Progress">
            <SpaceBetween direction="vertical" size="s">
              <Box>
                Monitor your improvement using the <Link href="/analytics">Analytics page</Link>:
              </Box>
              <ul>
                <li>Performance trends over time</li>
                <li>Domain-specific scores</li>
                <li>Study statistics and streaks</li>
                <li>Readiness assessment</li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      )
    },
    {
      id: 'faq',
      label: 'FAQ',
      content: (
        <SpaceBetween direction="vertical" size="l">
          {faqItems.map((item, index) => (
            <ExpandableSection key={index} headerText={item.question}>
              <Box>{item.answer}</Box>
            </ExpandableSection>
          ))}
        </SpaceBetween>
      )
    },
    {
      id: 'study-tips',
      label: 'Study Tips',
      content: (
        <SpaceBetween direction="vertical" size="l">
          <Alert type="success">
            Follow these proven strategies to maximize your study effectiveness and pass your AWS certification exam.
          </Alert>

          <Cards
            cardDefinition={{
              header: (item: any) => (
                <SpaceBetween direction="horizontal" size="s">
                  <Box fontSize="heading-l">{item.icon}</Box>
                  <Box variant="h3">{item.title}</Box>
                </SpaceBetween>
              ),
              sections: [
                {
                  content: (item: any) => <Box>{item.description}</Box>
                }
              ]
            }}
            items={studyTips}
            loadingText="Loading study tips"
          />
        </SpaceBetween>
      )
    },
    {
      id: 'certifications',
      label: 'Certification Guides',
      content: (
        <SpaceBetween direction="vertical" size="l">
          {certificationGuides.map((cert, index) => (
            <Container
              key={index}
              header={<Header variant="h2">{cert.certification}</Header>}
            >
              <SpaceBetween direction="vertical" size="l">
                <Box>{cert.description}</Box>

                <SpaceBetween direction="horizontal" size="l">
                  <Box>
                    <Box variant="h3">Exam Domains</Box>
                    <SpaceBetween direction="vertical" size="xs">
                      {cert.domains.map((domain, domainIndex) => (
                        <Box key={domainIndex}>• {domain}</Box>
                      ))}
                    </SpaceBetween>
                  </Box>

                  <Box>
                    <Box variant="h3">Exam Details</Box>
                    <SpaceBetween direction="vertical" size="xs">
                      <Box><strong>Duration:</strong> {cert.examDetails.duration}</Box>
                      <Box><strong>Questions:</strong> {cert.examDetails.questions}</Box>
                      <Box><strong>Passing Score:</strong> {cert.examDetails.passingScore}</Box>
                      <Box><strong>Cost:</strong> {cert.examDetails.cost}</Box>
                    </SpaceBetween>
                  </Box>
                </SpaceBetween>
              </SpaceBetween>
            </Container>
          ))}
        </SpaceBetween>
      )
    },
    {
      id: 'support',
      label: 'Support',
      content: (
        <SpaceBetween direction="vertical" size="l">
          <Alert type="info">
            Need help? We're here to support your certification journey.
          </Alert>

          <Container header={<Header variant="h2">Contact Support</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <Box>
                <strong>Email:</strong> support@awscertplatform.com
              </Box>
              <Box>
                <strong>Response Time:</strong> Within 24 hours
              </Box>
              <Box>
                <strong>Available:</strong> Monday - Friday, 9 AM - 5 PM EST
              </Box>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Community</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <Box>
                Join our community forums to connect with other learners:
              </Box>
              <SpaceBetween direction="horizontal" size="s">
                <Button iconName="external">Discord Community</Button>
                <Button iconName="external">Reddit Forum</Button>
                <Button iconName="external">Study Groups</Button>
              </SpaceBetween>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Report Issues</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <Box>
                Found a bug or have a feature request? Let us know:
              </Box>
              <SpaceBetween direction="horizontal" size="s">
                <Button variant="primary">Report Bug</Button>
                <Button>Feature Request</Button>
              </SpaceBetween>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      )
    }
  ]

  return (
    <Container
      header={<Header variant="h1">Help & Documentation</Header>}
    >
      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={tabs}
      />
    </Container>
  )
}

export default HelpPage