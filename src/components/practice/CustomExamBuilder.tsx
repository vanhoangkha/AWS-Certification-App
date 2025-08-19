import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  FormField,
  Select,
  Multiselect,
  Input,
  RadioGroup,
  Button,
  Alert,
  ColumnLayout,
  Badge,
  Slider
} from '@cloudscape-design/components'
import { useStartExam } from '@/hooks/useExams'
import { useQuestionStats } from '@/hooks/useQuestions'
import { CERTIFICATIONS, DOMAINS } from '@/types'
import type { StartExamInput, CustomExamOptions } from '@/types'

interface CustomExamBuilderProps {
  onExamStarted?: (sessionId: string) => void
  onCancel?: () => void
}

const CustomExamBuilder: React.FC<CustomExamBuilderProps> = ({
  onExamStarted,
  onCancel
}) => {
  const [certification, setCertification] = useState('')
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState('MIXED')
  const [questionCount, setQuestionCount] = useState(25)
  const [examName, setExamName] = useState('')

  const startExamMutation = useStartExam()
  const { data: questionStats } = useQuestionStats({
    certification: certification || undefined,
    domains: selectedDomains
  })

  const certificationOptions = Object.entries(CERTIFICATIONS).map(([code, name]) => ({
    label: `${code} - ${name}`,
    value: code
  }))

  const domainOptions = certification && DOMAINS[certification as keyof typeof DOMAINS]
    ? DOMAINS[certification as keyof typeof DOMAINS].map(domain => ({
        label: domain,
        value: domain
      }))
    : []

  const difficultyOptions = [
    { label: 'Mixed (All Difficulties)', value: 'MIXED' },
    { label: 'Easy Questions Only', value: 'EASY' },
    { label: 'Medium Questions Only', value: 'MEDIUM' },
    { label: 'Hard Questions Only', value: 'HARD' }
  ]

  const handleCreateExam = async () => {
    if (!certification) return

    const customOptions: CustomExamOptions = {
      domains: selectedDomains.length > 0 ? selectedDomains : domainOptions.map(d => d.value),
      difficulty: difficulty === 'MIXED' ? 'MIXED' : difficulty as 'EASY' | 'MEDIUM' | 'HARD',
      questionCount
    }

    const examInput: StartExamInput = {
      certification,
      examType: 'CUSTOM',
      customOptions
    }

    try {
      const examSession = await startExamMutation.mutateAsync(examInput)
      onExamStarted?.(examSession.sessionId)
    } catch (error) {
      console.error('Failed to create custom exam:', error)
    }
  }

  const getAvailableQuestions = () => {
    if (!questionStats) return 0
    
    let total = questionStats.total || 0
    
    if (selectedDomains.length > 0) {
      total = selectedDomains.reduce((sum, domain) => {
        return sum + (questionStats.byDomain[domain] || 0)
      }, 0)
    }
    
    if (difficulty !== 'MIXED') {
      const difficultyCount = questionStats.byDifficulty[difficulty as keyof typeof questionStats.byDifficulty] || 0
      total = Math.min(total, difficultyCount)
    }
    
    return total
  }

  const availableQuestions = getAvailableQuestions()
  const canCreateExam = certification && questionCount > 0 && questionCount <= availableQuestions

  const getEstimatedTime = () => {
    // Estimate 2 minutes per question for custom exams
    return Math.round(questionCount * 2)
  }

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Create a personalized exam tailored to your study needs"
          actions={
            onCancel && (
              <Button variant="link" onClick={onCancel}>
                Cancel
              </Button>
            )
          }
        >
          Custom Exam Builder
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Instructions */}
        <Alert type="info" header="Create Your Custom Exam">
          Build a personalized exam by selecting specific domains, difficulty levels, and question count. 
          This is perfect for focusing on areas where you need more practice.
        </Alert>

        {/* Exam Configuration */}
        <ColumnLayout columns={2} variant="text-grid">
          {/* Left Column */}
          <SpaceBetween direction="vertical" size="m">
            <FormField label="Exam Name" constraintText="Optional name for your custom exam">
              <Input
                value={examName}
                onChange={({ detail }) => setExamName(detail.value)}
                placeholder="e.g., Security Focus Practice"
              />
            </FormField>

            <FormField label="Certification" constraintText="Required">
              <Select
                selectedOption={
                  certificationOptions.find(opt => opt.value === certification) || null
                }
                onChange={({ detail }) => {
                  setCertification(detail.selectedOption.value || '')
                  setSelectedDomains([]) // Reset domains when certification changes
                }}
                options={certificationOptions}
                placeholder="Select certification"
              />
            </FormField>

            <FormField 
              label="Domains" 
              constraintText="Select specific domains or leave empty for all domains"
            >
              <Multiselect
                selectedOptions={selectedDomains.map(domain => ({ label: domain, value: domain }))}
                onChange={({ detail }) => {
                  setSelectedDomains(detail.selectedOptions.map(opt => opt.value || ''))
                }}
                options={domainOptions}
                placeholder="Select domains (optional)"
                disabled={!certification}
                tokenLimit={3}
              />
            </FormField>
          </SpaceBetween>

          {/* Right Column */}
          <SpaceBetween direction="vertical" size="m">
            <FormField label="Difficulty Level">
              <RadioGroup
                onChange={({ detail }) => setDifficulty(detail.value)}
                value={difficulty}
                items={difficultyOptions}
              />
            </FormField>

            <FormField 
              label="Number of Questions" 
              constraintText={`Available: ${availableQuestions} questions`}
            >
              <Slider
                onChange={({ detail }) => setQuestionCount(detail.value)}
                value={questionCount}
                max={Math.min(availableQuestions, 100)}
                min={5}
                step={5}
                tickMarks
                hideFillLine={false}
              />
              <Box variant="small" margin={{ top: 'xs' }}>
                Selected: {questionCount} questions
              </Box>
            </FormField>
          </SpaceBetween>
        </ColumnLayout>

        {/* Exam Preview */}
        {certification && (
          <Container
            header={
              <Header variant="h3">
                Exam Preview
              </Header>
            }
          >
            <ColumnLayout columns={4} variant="text-grid">
              <Box>
                <Box variant="awsui-key-label">Certification</Box>
                <Badge>{certification}</Badge>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Questions</Box>
                <Box variant="h3">{questionCount}</Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Estimated Time</Box>
                <Box variant="h3">{getEstimatedTime()} min</Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Difficulty</Box>
                <Badge color={difficulty === 'MIXED' ? 'blue' : difficulty === 'EASY' ? 'green' : difficulty === 'MEDIUM' ? 'orange' : 'red'}>
                  {difficulty}
                </Badge>
              </Box>
            </ColumnLayout>

            {selectedDomains.length > 0 && (
              <Box margin={{ top: 'm' }}>
                <Box variant="awsui-key-label">Selected Domains</Box>
                <SpaceBetween direction="horizontal" size="xs">
                  {selectedDomains.map(domain => (
                    <Badge key={domain}>{domain}</Badge>
                  ))}
                </SpaceBetween>
              </Box>
            )}
          </Container>
        )}

        {/* Question Availability Warning */}
        {certification && questionCount > availableQuestions && (
          <Alert type="warning" header="Not Enough Questions">
            Only {availableQuestions} questions are available with your current selection. 
            Please reduce the question count or adjust your filters.
          </Alert>
        )}

        {/* Create Exam Button */}
        <Box>
          <SpaceBetween direction="horizontal" size="s">
            <Button
              variant="primary"
              onClick={handleCreateExam}
              disabled={!canCreateExam}
              loading={startExamMutation.isPending}
            >
              Create & Start Exam
            </Button>
            
            {onCancel && (
              <Button variant="normal" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </SpaceBetween>
        </Box>

        {/* Tips */}
        <Alert type="success" header="Custom Exam Tips">
          <SpaceBetween direction="vertical" size="s">
            <Box>• <strong>Focus Areas:</strong> Select specific domains to concentrate on weak areas</Box>
            <Box>• <strong>Difficulty Progression:</strong> Start with mixed difficulty, then focus on harder questions</Box>
            <Box>• <strong>Question Count:</strong> 25-50 questions work well for focused practice sessions</Box>
            <Box>• <strong>Time Management:</strong> Custom exams help you practice pacing without time pressure</Box>
          </SpaceBetween>
        </Alert>

        {/* Question Statistics */}
        {questionStats && certification && (
          <Container
            header={
              <Header variant="h3">
                Available Questions
              </Header>
            }
          >
            <ColumnLayout columns={3} variant="text-grid">
              <Box>
                <Box variant="awsui-key-label">Total Questions</Box>
                <Box variant="h3">{questionStats.total}</Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">By Difficulty</Box>
                <SpaceBetween direction="vertical" size="xs">
                  <Box variant="small">Easy: {questionStats.byDifficulty.EASY || 0}</Box>
                  <Box variant="small">Medium: {questionStats.byDifficulty.MEDIUM || 0}</Box>
                  <Box variant="small">Hard: {questionStats.byDifficulty.HARD || 0}</Box>
                </SpaceBetween>
              </Box>
              <Box>
                <Box variant="awsui-key-label">By Domain</Box>
                <SpaceBetween direction="vertical" size="xs">
                  {Object.entries(questionStats.byDomain).slice(0, 3).map(([domain, count]) => (
                    <Box key={domain} variant="small">
                      {domain.length > 20 ? domain.substring(0, 20) + '...' : domain}: {count}
                    </Box>
                  ))}
                  {Object.keys(questionStats.byDomain).length > 3 && (
                    <Box variant="small">
                      +{Object.keys(questionStats.byDomain).length - 3} more...
                    </Box>
                  )}
                </SpaceBetween>
              </Box>
            </ColumnLayout>
          </Container>
        )}
      </SpaceBetween>
    </Container>
  )
}

export default CustomExamBuilder