import React, { useState } from 'react'
import {
  AppLayout,
  SideNavigation,
  ContentLayout,
  Header,
  SpaceBetween,
  Button,
  Modal,
  Box,
  Alert,
  Tabs
} from '@cloudscape-design/components'
import QuestionList from './QuestionList'
import QuestionForm from './QuestionForm'
import QuestionPreview from './QuestionPreview'
import QuestionImport from './QuestionImport'
import { useQuestionStats } from '@/hooks/useQuestions'
import type { Question } from '@/types'

interface QuestionManagerProps {
  onNavigate?: (path: string) => void
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('list')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])

  // Get question statistics
  const { data: stats } = useQuestionStats({})

  const handleCreateQuestion = () => {
    setSelectedQuestion(null)
    setShowCreateForm(true)
  }

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question)
    setShowEditForm(true)
  }

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question)
    setShowPreview(true)
  }

  const handleFormSuccess = (question: Question) => {
    setShowCreateForm(false)
    setShowEditForm(false)
    setSelectedQuestion(null)
    // Optionally show success message or redirect
  }

  const handleFormCancel = () => {
    setShowCreateForm(false)
    setShowEditForm(false)
    setSelectedQuestion(null)
  }

  const handleBulkDelete = async () => {
    // Implement bulk delete functionality
    console.log('Bulk delete:', selectedQuestions.map(q => q.questionId))
    setSelectedQuestions([])
  }

  const handleBulkExport = () => {
    // Implement bulk export functionality
    const csvContent = generateCSV(selectedQuestions)
    downloadCSV(csvContent, 'questions-export.csv')
  }

  const generateCSV = (questions: Question[]): string => {
    const headers = [
      'certification',
      'domain', 
      'difficulty',
      'questionText',
      'questionType',
      'options',
      'correctAnswers',
      'explanation',
      'references',
      'tags'
    ]

    const rows = questions.map(q => [
      q.certification,
      q.domain,
      q.difficulty,
      `"${q.questionText.replace(/"/g, '""')}"`,
      q.questionType,
      `"${JSON.stringify(q.options).replace(/"/g, '""')}"`,
      `"${JSON.stringify(q.correctAnswers).replace(/"/g, '""')}"`,
      `"${q.explanation.replace(/"/g, '""')}"`,
      `"${JSON.stringify(q.references).replace(/"/g, '""')}"`,
      `"${JSON.stringify(q.tags).replace(/"/g, '""')}"`
    ])

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const navigationItems = [
    {
      type: 'section',
      text: 'Question Management',
      items: [
        {
          type: 'link',
          text: 'All Questions',
          href: '#list',
          info: stats?.total ? `${stats.total}` : undefined
        },
        {
          type: 'link',
          text: 'Import Questions',
          href: '#import'
        },
        {
          type: 'divider'
        },
        {
          type: 'link',
          text: 'Easy Questions',
          href: '#easy',
          info: stats?.byDifficulty?.EASY ? `${stats.byDifficulty.EASY}` : undefined
        },
        {
          type: 'link',
          text: 'Medium Questions', 
          href: '#medium',
          info: stats?.byDifficulty?.MEDIUM ? `${stats.byDifficulty.MEDIUM}` : undefined
        },
        {
          type: 'link',
          text: 'Hard Questions',
          href: '#hard', 
          info: stats?.byDifficulty?.HARD ? `${stats.byDifficulty.HARD}` : undefined
        }
      ]
    },
    {
      type: 'section',
      text: 'By Certification',
      items: Object.entries(stats?.byCertification || {}).map(([cert, count]) => ({
        type: 'link',
        text: cert,
        href: `#cert-${cert}`,
        info: `${count}`
      }))
    }
  ]

  const tabs = [
    {
      id: 'list',
      label: 'Questions',
      content: (
        <QuestionList
          onEdit={handleEditQuestion}
          onView={handleViewQuestion}
          selectable={true}
          selectedQuestions={selectedQuestions}
          onSelectionChange={setSelectedQuestions}
        />
      )
    },
    {
      id: 'import',
      label: 'Import',
      content: (
        <QuestionImport
          onImportComplete={(result) => {
            console.log('Import completed:', result)
            // Refresh question list
          }}
        />
      )
    }
  ]

  return (
    <AppLayout
      navigationOpen={true}
      navigation={
        <SideNavigation
          header={{
            href: '#/',
            text: 'Question Bank'
          }}
          items={navigationItems}
          onFollow={(event) => {
            event.preventDefault()
            const href = event.detail.href.replace('#', '')
            
            if (href === 'list') {
              setActiveTab('list')
            } else if (href === 'import') {
              setActiveTab('import')
            } else if (href.startsWith('cert-')) {
              // Filter by certification
              setActiveTab('list')
            } else if (['easy', 'medium', 'hard'].includes(href)) {
              // Filter by difficulty
              setActiveTab('list')
            }
          }}
        />
      }
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Manage your question bank for AWS certification practice"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  {selectedQuestions.length > 0 && (
                    <>
                      <Button
                        variant="normal"
                        iconName="download"
                        onClick={handleBulkExport}
                      >
                        Export Selected ({selectedQuestions.length})
                      </Button>
                      <Button
                        variant="normal"
                        iconName="remove"
                        onClick={handleBulkDelete}
                      >
                        Delete Selected ({selectedQuestions.length})
                      </Button>
                    </>
                  )}
                  <Button
                    variant="primary"
                    iconName="add-plus"
                    onClick={handleCreateQuestion}
                  >
                    Create Question
                  </Button>
                </SpaceBetween>
              }
            >
              Question Management
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="l">
            {/* Statistics Overview */}
            {stats && (
              <Alert type="info" header="Question Bank Statistics">
                <SpaceBetween direction="horizontal" size="l">
                  <Box>
                    <Box variant="awsui-key-label">Total Questions</Box>
                    <Box variant="h2">{stats.total}</Box>
                  </Box>
                  <Box>
                    <Box variant="awsui-key-label">Certifications</Box>
                    <Box variant="h2">{Object.keys(stats.byCertification).length}</Box>
                  </Box>
                  <Box>
                    <Box variant="awsui-key-label">Domains</Box>
                    <Box variant="h2">{Object.keys(stats.byDomain).length}</Box>
                  </Box>
                </SpaceBetween>
              </Alert>
            )}

            {/* Main Content Tabs */}
            <Tabs
              activeTabId={activeTab}
              onChange={({ detail }) => setActiveTab(detail.activeTabId)}
              tabs={tabs}
            />
          </SpaceBetween>
        </ContentLayout>
      }
      toolsHide={true}
    />
  )

  // Modals are rendered outside the main layout
  return (
    <>
      {/* Main Layout */}
      <AppLayout
        navigationOpen={true}
        navigation={
          <SideNavigation
            header={{
              href: '#/',
              text: 'Question Bank'
            }}
            items={navigationItems}
            onFollow={(event) => {
              event.preventDefault()
              const href = event.detail.href.replace('#', '')
              
              if (href === 'list') {
                setActiveTab('list')
              } else if (href === 'import') {
                setActiveTab('import')
              }
            }}
          />
        }
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                description="Manage your question bank for AWS certification practice"
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    {selectedQuestions.length > 0 && (
                      <>
                        <Button
                          variant="normal"
                          iconName="download"
                          onClick={handleBulkExport}
                        >
                          Export Selected ({selectedQuestions.length})
                        </Button>
                        <Button
                          variant="normal"
                          iconName="remove"
                          onClick={handleBulkDelete}
                        >
                          Delete Selected ({selectedQuestions.length})
                        </Button>
                      </>
                    )}
                    <Button
                      variant="primary"
                      iconName="add-plus"
                      onClick={handleCreateQuestion}
                    >
                      Create Question
                    </Button>
                  </SpaceBetween>
                }
              >
                Question Management
              </Header>
            }
          >
            <SpaceBetween direction="vertical" size="l">
              {stats && (
                <Alert type="info" header="Question Bank Statistics">
                  <SpaceBetween direction="horizontal" size="l">
                    <Box>
                      <Box variant="awsui-key-label">Total Questions</Box>
                      <Box variant="h2">{stats.total}</Box>
                    </Box>
                    <Box>
                      <Box variant="awsui-key-label">Certifications</Box>
                      <Box variant="h2">{Object.keys(stats.byCertification).length}</Box>
                    </Box>
                    <Box>
                      <Box variant="awsui-key-label">Domains</Box>
                      <Box variant="h2">{Object.keys(stats.byDomain).length}</Box>
                    </Box>
                  </SpaceBetween>
                </Alert>
              )}

              <Tabs
                activeTabId={activeTab}
                onChange={({ detail }) => setActiveTab(detail.activeTabId)}
                tabs={tabs}
              />
            </SpaceBetween>
          </ContentLayout>
        }
        toolsHide={true}
      />

      {/* Create Question Modal */}
      <Modal
        visible={showCreateForm}
        onDismiss={handleFormCancel}
        header="Create New Question"
        size="large"
        footer={null}
      >
        <QuestionForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Edit Question Modal */}
      <Modal
        visible={showEditForm}
        onDismiss={handleFormCancel}
        header="Edit Question"
        size="large"
        footer={null}
      >
        {selectedQuestion && (
          <QuestionForm
            question={selectedQuestion}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </Modal>

      {/* Question Preview Modal */}
      <Modal
        visible={showPreview}
        onDismiss={() => setShowPreview(false)}
        header="Question Preview"
        size="large"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              {selectedQuestion && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowPreview(false)
                    handleEditQuestion(selectedQuestion)
                  }}
                >
                  Edit Question
                </Button>
              )}
            </SpaceBetween>
          </Box>
        }
      >
        {selectedQuestion && (
          <QuestionPreview
            question={selectedQuestion}
            showAnswer={true}
            showExplanation={true}
          />
        )}
      </Modal>
    </>
  )
}

export default QuestionManager