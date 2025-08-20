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
  Toggle,
  Tabs,
  RadioGroup,
  Checkbox
} from '@cloudscape-design/components'

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // General settings
    language: 'en',
    timezone: 'UTC',
    theme: 'light',
    
    // Study settings
    defaultPracticeMode: 'immediate-feedback',
    questionsPerSession: 25,
    showExplanations: true,
    showReferences: true,
    autoSave: true,
    
    // Notification settings
    emailNotifications: true,
    studyReminders: true,
    achievementNotifications: true,
    weeklyProgress: true,
    
    // Exam settings
    examWarnings: true,
    autoSubmit: false,
    reviewMode: 'full-review'
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings)
  }

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: 'Deutsch', value: 'de' },
    { label: '日本語', value: 'ja' }
  ]

  const timezoneOptions = [
    { label: 'UTC', value: 'UTC' },
    { label: 'Eastern Time (ET)', value: 'America/New_York' },
    { label: 'Central Time (CT)', value: 'America/Chicago' },
    { label: 'Mountain Time (MT)', value: 'America/Denver' },
    { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
    { label: 'Central European Time (CET)', value: 'Europe/Berlin' }
  ]

  const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Auto (System)', value: 'auto' }
  ]

  const practiceModeOptions = [
    { label: 'Immediate Feedback', value: 'immediate-feedback' },
    { label: 'End of Session', value: 'end-of-session' },
    { label: 'No Feedback (Exam Mode)', value: 'no-feedback' }
  ]

  const questionsPerSessionOptions = [
    { label: '10 questions', value: 10 },
    { label: '25 questions', value: 25 },
    { label: '50 questions', value: 50 },
    { label: '65 questions (Full exam)', value: 65 }
  ]

  const reviewModeOptions = [
    { label: 'Full Review', value: 'full-review' },
    { label: 'Incorrect Only', value: 'incorrect-only' },
    { label: 'Marked for Review', value: 'marked-only' }
  ]

  const tabs = [
    {
      id: 'general',
      label: 'General',
      content: (
        <SpaceBetween direction="vertical" size="l">
          <FormField label="Language">
            <Select
              selectedOption={languageOptions.find(opt => opt.value === settings.language)}
              onChange={({ detail }) => handleSettingChange('language', detail.selectedOption.value)}
              options={languageOptions}
            />
          </FormField>

          <FormField label="Timezone">
            <Select
              selectedOption={timezoneOptions.find(opt => opt.value === settings.timezone)}
              onChange={({ detail }) => handleSettingChange('timezone', detail.selectedOption.value)}
              options={timezoneOptions}
            />
          </FormField>

          <FormField label="Theme">
            <RadioGroup
              value={settings.theme}
              onChange={({ detail }) => handleSettingChange('theme', detail.value)}
              items={themeOptions}
            />
          </FormField>
        </SpaceBetween>
      )
    },
    {
      id: 'study',
      label: 'Study Preferences',
      content: (
        <SpaceBetween direction="vertical" size="l">
          <FormField label="Default Practice Mode">
            <Select
              selectedOption={practiceModeOptions.find(opt => opt.value === settings.defaultPracticeMode)}
              onChange={({ detail }) => handleSettingChange('defaultPracticeMode', detail.selectedOption.value)}
              options={practiceModeOptions}
            />
          </FormField>

          <FormField label="Questions per Practice Session">
            <Select
              selectedOption={questionsPerSessionOptions.find(opt => opt.value === settings.questionsPerSession)}
              onChange={({ detail }) => handleSettingChange('questionsPerSession', detail.selectedOption.value)}
              options={questionsPerSessionOptions}
            />
          </FormField>

          <FormField label="Study Features">
            <SpaceBetween direction="vertical" size="s">
              <Checkbox
                checked={settings.showExplanations}
                onChange={({ detail }) => handleSettingChange('showExplanations', detail.checked)}
              >
                Show explanations after answering
              </Checkbox>
              
              <Checkbox
                checked={settings.showReferences}
                onChange={({ detail }) => handleSettingChange('showReferences', detail.checked)}
              >
                Show reference links
              </Checkbox>
              
              <Checkbox
                checked={settings.autoSave}
                onChange={({ detail }) => handleSettingChange('autoSave', detail.checked)}
              >
                Auto-save progress
              </Checkbox>
            </SpaceBetween>
          </FormField>
        </SpaceBetween>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <SpaceBetween direction="vertical" size="l">
          <Alert type="info">
            Configure how and when you want to receive notifications about your study progress.
          </Alert>

          <FormField label="Email Notifications">
            <SpaceBetween direction="vertical" size="s">
              <Checkbox
                checked={settings.emailNotifications}
                onChange={({ detail }) => handleSettingChange('emailNotifications', detail.checked)}
              >
                Enable email notifications
              </Checkbox>
              
              <Checkbox
                checked={settings.studyReminders}
                onChange={({ detail }) => handleSettingChange('studyReminders', detail.checked)}
                disabled={!settings.emailNotifications}
              >
                Daily study reminders
              </Checkbox>
              
              <Checkbox
                checked={settings.achievementNotifications}
                onChange={({ detail }) => handleSettingChange('achievementNotifications', detail.checked)}
                disabled={!settings.emailNotifications}
              >
                Achievement notifications
              </Checkbox>
              
              <Checkbox
                checked={settings.weeklyProgress}
                onChange={({ detail }) => handleSettingChange('weeklyProgress', detail.checked)}
                disabled={!settings.emailNotifications}
              >
                Weekly progress reports
              </Checkbox>
            </SpaceBetween>
          </FormField>
        </SpaceBetween>
      )
    },
    {
      id: 'exam',
      label: 'Exam Settings',
      content: (
        <SpaceBetween direction="vertical" size="l">
          <Alert type="warning">
            These settings affect how mock exams behave. Choose carefully as they impact the exam experience.
          </Alert>

          <FormField label="Exam Behavior">
            <SpaceBetween direction="vertical" size="s">
              <Checkbox
                checked={settings.examWarnings}
                onChange={({ detail }) => handleSettingChange('examWarnings', detail.checked)}
              >
                Show warnings for unanswered questions
              </Checkbox>
              
              <Checkbox
                checked={settings.autoSubmit}
                onChange={({ detail }) => handleSettingChange('autoSubmit', detail.checked)}
              >
                Auto-submit when time expires
              </Checkbox>
            </SpaceBetween>
          </FormField>

          <FormField label="Review Mode">
            <Select
              selectedOption={reviewModeOptions.find(opt => opt.value === settings.reviewMode)}
              onChange={({ detail }) => handleSettingChange('reviewMode', detail.selectedOption.value)}
              options={reviewModeOptions}
            />
          </FormField>
        </SpaceBetween>
      )
    }
  ]

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={
            <Button variant="primary" onClick={handleSave}>
              Save Settings
            </Button>
          }
        >
          Settings
        </Header>
      }
    >
      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={tabs}
      />
    </Container>
  )
}

export default SettingsPage