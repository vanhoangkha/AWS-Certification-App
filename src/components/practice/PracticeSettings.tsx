import React, { useState } from 'react'
import {
  SpaceBetween,
  Box,
  FormField,
  Select,
  Multiselect,
  RadioGroup,
  Checkbox,
  Button,
  Alert
} from '@cloudscape-design/components'
import { CERTIFICATIONS, DOMAINS } from '@/types'

interface PracticeSettingsProps {
  certification: string
  domains: string[]
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
  onSettingsChange: (settings: {
    certification: string
    domains: string[]
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
    showExplanations: boolean
    showReferences: boolean
    autoAdvance: boolean
  }) => void
}

const PracticeSettings: React.FC<PracticeSettingsProps> = ({
  certification,
  domains,
  difficulty,
  onSettingsChange
}) => {
  const [selectedCertification, setSelectedCertification] = useState(certification)
  const [selectedDomains, setSelectedDomains] = useState(domains)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(difficulty || 'MIXED')
  const [showExplanations, setShowExplanations] = useState(true)
  const [showReferences, setShowReferences] = useState(true)
  const [autoAdvance, setAutoAdvance] = useState(false)

  const certificationOptions = Object.entries(CERTIFICATIONS).map(([code, name]) => ({
    label: `${code} - ${name}`,
    value: code
  }))

  const domainOptions = selectedCertification && DOMAINS[selectedCertification as keyof typeof DOMAINS]
    ? DOMAINS[selectedCertification as keyof typeof DOMAINS].map(domain => ({
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

  const handleApplySettings = () => {
    onSettingsChange({
      certification: selectedCertification,
      domains: selectedDomains,
      difficulty: selectedDifficulty === 'MIXED' ? undefined : selectedDifficulty as 'EASY' | 'MEDIUM' | 'HARD',
      showExplanations,
      showReferences,
      autoAdvance
    })
  }

  return (
    <SpaceBetween direction="vertical" size="l">
      <Alert type="info" header="Practice Settings">
        Customize your practice session to focus on specific areas or adjust the learning experience.
      </Alert>

      {/* Certification Selection */}
      <FormField label="Certification" constraintText="Select the AWS certification you're preparing for">
        <Select
          selectedOption={
            certificationOptions.find(opt => opt.value === selectedCertification) ||
            certificationOptions[0]
          }
          onChange={({ detail }) => {
            setSelectedCertification(detail.selectedOption.value || '')
            setSelectedDomains([]) // Reset domains when certification changes
          }}
          options={certificationOptions}
        />
      </FormField>

      {/* Domain Selection */}
      <FormField 
        label="Domains" 
        constraintText="Select specific domains to focus on, or leave empty for all domains"
      >
        <Multiselect
          selectedOptions={selectedDomains.map(domain => ({ label: domain, value: domain }))}
          onChange={({ detail }) => {
            setSelectedDomains(detail.selectedOptions.map(opt => opt.value || ''))
          }}
          options={domainOptions}
          placeholder="Select domains (optional)"
          tokenLimit={3}
        />
      </FormField>

      {/* Difficulty Selection */}
      <FormField label="Difficulty Level" constraintText="Choose question difficulty">
        <RadioGroup
          onChange={({ detail }) => setSelectedDifficulty(detail.value)}
          value={selectedDifficulty}
          items={difficultyOptions}
        />
      </FormField>

      {/* Learning Options */}
      <FormField label="Learning Options" constraintText="Customize your learning experience">
        <SpaceBetween direction="vertical" size="s">
          <Checkbox
            checked={showExplanations}
            onChange={({ detail }) => setShowExplanations(detail.checked)}
          >
            Show detailed explanations after each question
          </Checkbox>
          
          <Checkbox
            checked={showReferences}
            onChange={({ detail }) => setShowReferences(detail.checked)}
          >
            Show AWS documentation references
          </Checkbox>
          
          <Checkbox
            checked={autoAdvance}
            onChange={({ detail }) => setAutoAdvance(detail.checked)}
          >
            Automatically advance to next question after 5 seconds
          </Checkbox>
        </SpaceBetween>
      </FormField>

      {/* Settings Summary */}
      <Box>
        <Box variant="h4" margin={{ bottom: 's' }}>Settings Summary</Box>
        <SpaceBetween direction="vertical" size="xs">
          <Box variant="small">
            <strong>Certification:</strong> {selectedCertification}
          </Box>
          <Box variant="small">
            <strong>Domains:</strong> {selectedDomains.length > 0 ? selectedDomains.join(', ') : 'All domains'}
          </Box>
          <Box variant="small">
            <strong>Difficulty:</strong> {selectedDifficulty === 'MIXED' ? 'All difficulties' : selectedDifficulty}
          </Box>
          <Box variant="small">
            <strong>Features:</strong> {[
              showExplanations && 'Explanations',
              showReferences && 'References',
              autoAdvance && 'Auto-advance'
            ].filter(Boolean).join(', ') || 'Basic mode'}
          </Box>
        </SpaceBetween>
      </Box>

      {/* Apply Button */}
      <Box>
        <Button
          variant="primary"
          onClick={handleApplySettings}
          disabled={!selectedCertification}
        >
          Apply Settings
        </Button>
      </Box>

      {/* Tips */}
      <Alert type="success" header="Practice Tips">
        <SpaceBetween direction="vertical" size="s">
          <Box>• Start with mixed difficulty to get a broad understanding</Box>
          <Box>• Focus on specific domains where you need improvement</Box>
          <Box>• Always read explanations to understand the reasoning</Box>
          <Box>• Use references to dive deeper into AWS documentation</Box>
          <Box>• Practice regularly for better retention</Box>
        </SpaceBetween>
      </Alert>
    </SpaceBetween>
  )
}

export default PracticeSettings