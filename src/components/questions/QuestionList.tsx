import React, { useState } from 'react'
import {
  Table,
  Box,
  SpaceBetween,
  Button,
  Header,
  Pagination,
  TextFilter,
  Select,
  FormField,
  Modal,
  Alert,
  Badge,
  Link,
  CollectionPreferences,
  PropertyFilter
} from '@cloudscape-design/components'
import { useQuestions, useDeleteQuestion, usePrefetchQuestions } from '@/hooks/useQuestions'
import { formatDistanceToNow } from 'date-fns'
import type { Question, QuestionFilters } from '@/types'

interface QuestionListProps {
  onEdit?: (question: Question) => void
  onView?: (question: Question) => void
  selectable?: boolean
  selectedQuestions?: Question[]
  onSelectionChange?: (questions: Question[]) => void
}

const CERTIFICATION_OPTIONS = [
  { label: 'All Certifications', value: '' },
  { label: 'AWS Certified Cloud Practitioner', value: 'CLF-C01' },
  { label: 'AWS Certified Solutions Architect - Associate', value: 'SAA-C03' },
  { label: 'AWS Certified Developer - Associate', value: 'DVA-C01' },
  { label: 'AWS Certified SysOps Administrator - Associate', value: 'SOA-C02' }
]

const DIFFICULTY_OPTIONS = [
  { label: 'All Difficulties', value: '' },
  { label: 'Easy', value: 'EASY' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Hard', value: 'HARD' }
]

const DOMAIN_OPTIONS: Record<string, Array<{ label: string; value: string }>> = {
  'CLF-C01': [
    { label: 'Cloud Concepts', value: 'Cloud Concepts' },
    { label: 'Security and Compliance', value: 'Security and Compliance' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Billing and Pricing', value: 'Billing and Pricing' }
  ],
  'SAA-C03': [
    { label: 'Design Secure Architectures', value: 'Design Secure Architectures' },
    { label: 'Design Resilient Architectures', value: 'Design Resilient Architectures' },
    { label: 'Design High-Performing Architectures', value: 'Design High-Performing Architectures' },
    { label: 'Design Cost-Optimized Architectures', value: 'Design Cost-Optimized Architectures' }
  ]
}

const QuestionList: React.FC<QuestionListProps> = ({
  onEdit,
  onView,
  selectable = false,
  selectedQuestions = [],
  onSelectionChange
}) => {
  const [filters, setFilters] = useState<QuestionFilters>({
    certification: '',
    domain: '',
    difficulty: undefined,
    limit: 25
  })
  
  const [currentPageIndex, setCurrentPageIndex] = useState(1)
  const [textFilter, setTextFilter] = useState('')
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  
  const [preferences, setPreferences] = useState({
    pageSize: 25,
    visibleContent: ['questionText', 'certification', 'domain', 'difficulty', 'createdAt', 'actions']
  })

  const { data, isLoading, error } = useQuestions({
    ...filters,
    limit: preferences.pageSize
  })
  
  const deleteMutation = useDeleteQuestion()
  const { prefetchQuestions } = usePrefetchQuestions()

  const questions = data?.questions || []
  const totalCount = data?.total || 0

  const handleFilterChange = (newFilters: Partial<QuestionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPageIndex(1)
  }

  const handleDelete = async () => {
    if (!questionToDelete) return
    
    try {
      await deleteMutation.mutateAsync(questionToDelete.questionId)
      setDeleteModalVisible(false)
      setQuestionToDelete(null)
    } catch (error) {
      console.error('Failed to delete question:', error)
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    const colorMap = {
      EASY: 'green',
      MEDIUM: 'blue',
      HARD: 'red'
    }
    return (
      <Badge color={colorMap[difficulty as keyof typeof colorMap] || 'grey'}>
        {difficulty}
      </Badge>
    )
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const columnDefinitions = [
    {
      id: 'questionText',
      header: 'Question',
      cell: (item: Question) => (
        <Box>
          <Link onFollow={() => onView?.(item)}>
            {truncateText(item.questionText)}
          </Link>
          <Box variant="small" color="text-status-inactive">
            {item.questionType} • {item.options.length} options
          </Box>
        </Box>
      ),
      sortingField: 'questionText',
      isRowHeader: true
    },
    {
      id: 'certification',
      header: 'Certification',
      cell: (item: Question) => item.certification,
      sortingField: 'certification'
    },
    {
      id: 'domain',
      header: 'Domain',
      cell: (item: Question) => truncateText(item.domain, 30),
      sortingField: 'domain'
    },
    {
      id: 'difficulty',
      header: 'Difficulty',
      cell: (item: Question) => getDifficultyBadge(item.difficulty),
      sortingField: 'difficulty'
    },
    {
      id: 'tags',
      header: 'Tags',
      cell: (item: Question) => (
        <SpaceBetween direction="horizontal" size="xs">
          {item.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge>+{item.tags.length - 3}</Badge>
          )}
        </SpaceBetween>
      )
    },
    {
      id: 'createdAt',
      header: 'Created',
      cell: (item: Question) => (
        <Box>
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          <Box variant="small" color="text-status-inactive">
            by {item.createdBy}
          </Box>
        </Box>
      ),
      sortingField: 'createdAt'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item: Question) => (
        <SpaceBetween direction="horizontal" size="xs">
          <Button
            variant="inline-icon"
            iconName="edit"
            onClick={() => onEdit?.(item)}
          />
          <Button
            variant="inline-icon"
            iconName="remove"
            onClick={() => {
              setQuestionToDelete(item)
              setDeleteModalVisible(true)
            }}
          />
        </SpaceBetween>
      )
    }
  ]

  const visibleColumns = columnDefinitions.filter(col => 
    preferences.visibleContent.includes(col.id)
  )

  const propertyFilteringProperties = [
    {
      key: 'certification',
      operators: ['=', '!='],
      propertyLabel: 'Certification',
      groupValuesLabel: 'Certification values'
    },
    {
      key: 'domain',
      operators: ['=', '!=', ':'],
      propertyLabel: 'Domain',
      groupValuesLabel: 'Domain values'
    },
    {
      key: 'difficulty',
      operators: ['=', '!='],
      propertyLabel: 'Difficulty',
      groupValuesLabel: 'Difficulty values'
    },
    {
      key: 'tags',
      operators: [':', '!:'],
      propertyLabel: 'Tags',
      groupValuesLabel: 'Tag values'
    }
  ]

  return (
    <SpaceBetween direction="vertical" size="l">
      {error && (
        <Alert type="error" header="Error loading questions">
          {error.message}
        </Alert>
      )}

      <Table
        columnDefinitions={visibleColumns}
        items={questions}
        loading={isLoading}
        loadingText="Loading questions..."
        selectionType={selectable ? "multi" : undefined}
        selectedItems={selectedQuestions}
        onSelectionChange={({ detail }) => 
          onSelectionChange?.(detail.selectedItems)
        }
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          allItemsSelectionLabel: ({ selectedItems }) =>
            `${selectedItems.length} ${
              selectedItems.length === 1 ? "item" : "items"
            } selected`,
          itemSelectionLabel: ({ selectedItems }, item) => {
            const isItemSelected = selectedItems.filter(
              i => i.questionId === item.questionId
            ).length
            return `${item.questionText} is ${
              isItemSelected ? "" : "not "
            }selected`
          }
        }}
        header={
          <Header
            counter={`(${totalCount})`}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  onClick={() => {
                    // Prefetch next page
                    prefetchQuestions({
                      ...filters,
                      limit: preferences.pageSize
                    })
                  }}
                >
                  Refresh
                </Button>
              </SpaceBetween>
            }
          >
            Questions
          </Header>
        }
        filter={
          <SpaceBetween direction="vertical" size="s">
            <PropertyFilter
              query={undefined}
              onChange={({ detail }) => {
                // Handle property filter changes
                console.log('Property filter:', detail)
              }}
              countText={`${questions.length} matches`}
              expandToViewport={true}
              filteringProperties={propertyFilteringProperties}
              filteringPlaceholder="Find questions"
            />
            
            <SpaceBetween direction="horizontal" size="s">
              <FormField label="Certification">
                <Select
                  selectedOption={
                    CERTIFICATION_OPTIONS.find(opt => opt.value === filters.certification) || 
                    CERTIFICATION_OPTIONS[0]
                  }
                  onChange={({ detail }) => {
                    handleFilterChange({ 
                      certification: detail.selectedOption.value || undefined,
                      domain: '' // Reset domain when certification changes
                    })
                  }}
                  options={CERTIFICATION_OPTIONS}
                />
              </FormField>

              <FormField label="Domain">
                <Select
                  selectedOption={
                    filters.certification && DOMAIN_OPTIONS[filters.certification]
                      ? DOMAIN_OPTIONS[filters.certification].find(opt => opt.value === filters.domain) || 
                        { label: 'All Domains', value: '' }
                      : { label: 'All Domains', value: '' }
                  }
                  onChange={({ detail }) => {
                    handleFilterChange({ domain: detail.selectedOption.value || undefined })
                  }}
                  options={
                    filters.certification && DOMAIN_OPTIONS[filters.certification]
                      ? [{ label: 'All Domains', value: '' }, ...DOMAIN_OPTIONS[filters.certification]]
                      : [{ label: 'All Domains', value: '' }]
                  }
                  disabled={!filters.certification}
                />
              </FormField>

              <FormField label="Difficulty">
                <Select
                  selectedOption={
                    DIFFICULTY_OPTIONS.find(opt => opt.value === filters.difficulty) || 
                    DIFFICULTY_OPTIONS[0]
                  }
                  onChange={({ detail }) => {
                    handleFilterChange({ 
                      difficulty: detail.selectedOption.value as 'EASY' | 'MEDIUM' | 'HARD' | undefined 
                    })
                  }}
                  options={DIFFICULTY_OPTIONS}
                />
              </FormField>
            </SpaceBetween>
          </SpaceBetween>
        }
        pagination={
          <Pagination
            currentPageIndex={currentPageIndex}
            pagesCount={Math.ceil(totalCount / preferences.pageSize)}
            onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
          />
        }
        preferences={
          <CollectionPreferences
            title="Preferences"
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            preferences={preferences}
            onConfirm={({ detail }) => setPreferences(detail)}
            pageSizePreference={{
              title: "Page size",
              options: [
                { value: 10, label: "10 questions" },
                { value: 25, label: "25 questions" },
                { value: 50, label: "50 questions" }
              ]
            }}
            visibleContentPreference={{
              title: "Select visible columns",
              options: [
                {
                  label: "Question properties",
                  options: columnDefinitions.map(({ id, header }) => ({
                    id,
                    label: header,
                    editable: id !== 'questionText'
                  }))
                }
              ]
            }}
          />
        }
        empty={
          <Box textAlign="center" color="inherit">
            <b>No questions found</b>
            <Box variant="p" color="inherit">
              No questions match the current filters.
            </Box>
          </Box>
        }
      />

      <Modal
        visible={deleteModalVisible}
        onDismiss={() => setDeleteModalVisible(false)}
        header="Delete Question"
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setDeleteModalVisible(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={deleteMutation.isPending}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          <Box variant="span">
            Are you sure you want to delete this question? This action cannot be undone.
          </Box>
          {questionToDelete && (
            <Alert type="warning">
              <strong>Question:</strong> {truncateText(questionToDelete.questionText, 200)}
            </Alert>
          )}
        </SpaceBetween>
      </Modal>
    </SpaceBetween>
  )
}

export default QuestionList