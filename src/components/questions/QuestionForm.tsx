import React, { useState, useEffect } from 'react'
import {
  Form,
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  Button,
  SpaceBetween,
  Container,
  Header,
  Alert,
  TokenGroup,
  Autosuggest,
  RadioGroup,
  Grid
} from '@cloudscape-design/components'
import { useCreateQuestion, useUpdateQuestion } from '@/hooks/useQuestions'
import { validateQuestion } from '@/utils/validation'
import type { Question, QuestionInput, QuestionOption } from '@/types'
import { CERTIFICATIONS, DOMAINS } from '@/types'

interface QuestionFormProps {
  question?: Question
  onSuccess?: (question: Question) => void
  onCancel?: () => void
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<QuestionInput>({
    certification: '',
    domain: '',
    difficulty: 'MEDIUM',
    questionText: '',
    questionType: 'MCQ',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    explanation: '',
    references: [],
    tags: []
  })

  const [errors, setErrors] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [newReference, setNewReference] = useState({ title: '', url: '', type: 'documentation' as const })

  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()

  // Initialize form with existing question data
  useEffect(() => {
    if (question) {
      setFormData({
        certification: question.certification,
        domain: question.domain,
        difficulty: question.difficulty,
        questionText: question.questionText,
        questionType: question.questionType,
        options: question.options,
        explanation: question.explanation,
        references: question.references,
        tags: question.tags
      })
    }
  }, [question])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    try {
      // Validate form data
      validateQuestion(formData)
      setErrors([])

      let result: Question
      if (question) {
        // Update existing question
        result = await updateMutation.mutateAsync({
          questionId: question.questionId,
          ...formData
        })
      } else {
        // Create new question
        result = await createMutation.mutateAsync(formData)
      }

      onSuccess?.(result)
    } catch (error) {
      if (error instanceof Error) {
        setErrors([error.message])
      } else {
        setErrors(['An unexpected error occurred'])
      }
    }
  }

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, { text: '', isCorrect: false }]
      }))
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }))
    }
  }

  const updateOption = (index: number, field: keyof QuestionOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addReference = () => {
    if (newReference.title.trim() && newReference.url.trim()) {
      setFormData(prev => ({
        ...prev,
        references: [...prev.references, { ...newReference }]
      }))
      setNewReference({ title: '', url: '', type: 'documentation' })
    }
  }

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }))
  }

  const certificationOptions = Object.entries(CERTIFICATIONS).map(([code, name]) => ({
    label: `${code} - ${name}`,
    value: code
  }))

  const domainOptions = formData.certification && DOMAINS[formData.certification as keyof typeof DOMAINS]
    ? DOMAINS[formData.certification as keyof typeof DOMAINS].map(domain => ({
        label: domain,
        value: domain
      }))
    : []

  const difficultyOptions = [
    { label: 'Easy', value: 'EASY' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Hard', value: 'HARD' }
  ]

  const questionTypeOptions = [
    { label: 'Multiple Choice (Single Answer)', value: 'MCQ' },
    { label: 'Multiple Response (Multiple Answers)', value: 'MRQ' }
  ]

  const referenceTypeOptions = [
    { label: 'Documentation', value: 'documentation' },
    { label: 'Whitepaper', value: 'whitepaper' },
    { label: 'FAQ', value: 'faq' },
    { label: 'Blog', value: 'blog' }
  ]

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Container
      header={
        <Header variant="h2">
          {question ? 'Edit Question' : 'Create New Question'}
        </Header>
      }
    >
      <form onSubmit={handleSubmit}>
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="primary" loading={isLoading} type="submit">
                {question ? 'Update Question' : 'Create Question'}
              </Button>
            </SpaceBetween>
          }
          errorText={errors.length > 0 ? errors.join(', ') : undefined}
        >
          <SpaceBetween direction="vertical" size="l">
            {errors.length > 0 && (
              <Alert type="error" header="Validation Errors">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <FormField label="Certification" constraintText="Required">
                <Select
                  selectedOption={
                    formData.certification
                      ? certificationOptions.find(opt => opt.value === formData.certification)
                      : null
                  }
                  onChange={({ detail }) => {
                    setFormData(prev => ({
                      ...prev,
                      certification: detail.selectedOption.value || '',
                      domain: '' // Reset domain when certification changes
                    }))
                  }}
                  options={certificationOptions}
                  placeholder="Select certification"
                />
              </FormField>

              <FormField label="Domain" constraintText="Required">
                <Select
                  selectedOption={
                    formData.domain
                      ? domainOptions.find(opt => opt.value === formData.domain)
                      : null
                  }
                  onChange={({ detail }) => {
                    setFormData(prev => ({
                      ...prev,
                      domain: detail.selectedOption.value || ''
                    }))
                  }}
                  options={domainOptions}
                  placeholder="Select domain"
                  disabled={!formData.certification}
                />
              </FormField>
            </Grid>

            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <FormField label="Difficulty">
                <RadioGroup
                  onChange={({ detail }) => {
                    setFormData(prev => ({
                      ...prev,
                      difficulty: detail.value as 'EASY' | 'MEDIUM' | 'HARD'
                    }))
                  }}
                  value={formData.difficulty}
                  items={difficultyOptions}
                />
              </FormField>

              <FormField label="Question Type">
                <RadioGroup
                  onChange={({ detail }) => {
                    setFormData(prev => ({
                      ...prev,
                      questionType: detail.value as 'MCQ' | 'MRQ'
                    }))
                  }}
                  value={formData.questionType}
                  items={questionTypeOptions}
                />
              </FormField>
            </Grid>

            <FormField label="Question Text" constraintText="Required">
              <Textarea
                value={formData.questionText}
                onChange={({ detail }) => {
                  setFormData(prev => ({
                    ...prev,
                    questionText: detail.value
                  }))
                }}
                placeholder="Enter the question text..."
                rows={4}
              />
            </FormField>

            <FormField 
              label="Answer Options" 
              constraintText={`${formData.questionType === 'MCQ' ? 'Select exactly 1 correct answer' : 'Select 1 or more correct answers'}`}
            >
              <SpaceBetween direction="vertical" size="s">
                {formData.options.map((option, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={({ detail }) => {
                        if (formData.questionType === 'MCQ' && detail.checked) {
                          // For MCQ, uncheck all other options
                          setFormData(prev => ({
                            ...prev,
                            options: prev.options.map((opt, i) => ({
                              ...opt,
                              isCorrect: i === index
                            }))
                          }))
                        } else {
                          updateOption(index, 'isCorrect', detail.checked)
                        }
                      }}
                    />
                    <Input
                      value={option.text}
                      onChange={({ detail }) => updateOption(index, 'text', detail.value)}
                      placeholder={`Option ${index + 1}`}
                      style={{ flex: 1 }}
                    />
                    {formData.options.length > 2 && (
                      <Button
                        variant="icon"
                        iconName="remove"
                        onClick={() => removeOption(index)}
                      />
                    )}
                  </div>
                ))}
                {formData.options.length < 6 && (
                  <Button variant="link" iconName="add-plus" onClick={addOption}>
                    Add Option
                  </Button>
                )}
              </SpaceBetween>
            </FormField>

            <FormField label="Explanation" constraintText="Required">
              <Textarea
                value={formData.explanation}
                onChange={({ detail }) => {
                  setFormData(prev => ({
                    ...prev,
                    explanation: detail.value
                  }))
                }}
                placeholder="Explain why the correct answer(s) are correct..."
                rows={4}
              />
            </FormField>

            <FormField label="References" constraintText="Links to AWS documentation, whitepapers, etc.">
              <SpaceBetween direction="vertical" size="s">
                {formData.references.map((ref, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ minWidth: '100px' }}>{ref.type}</span>
                    <span style={{ flex: 1 }}>{ref.title}</span>
                    <Button
                      variant="icon"
                      iconName="remove"
                      onClick={() => removeReference(index)}
                    />
                  </div>
                ))}
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
                  <FormField label="Type" style={{ minWidth: '120px' }}>
                    <Select
                      selectedOption={referenceTypeOptions.find(opt => opt.value === newReference.type)}
                      onChange={({ detail }) => {
                        setNewReference(prev => ({
                          ...prev,
                          type: detail.selectedOption.value as any
                        }))
                      }}
                      options={referenceTypeOptions}
                    />
                  </FormField>
                  <FormField label="Title" style={{ flex: 1 }}>
                    <Input
                      value={newReference.title}
                      onChange={({ detail }) => {
                        setNewReference(prev => ({
                          ...prev,
                          title: detail.value
                        }))
                      }}
                      placeholder="Reference title"
                    />
                  </FormField>
                  <FormField label="URL" style={{ flex: 1 }}>
                    <Input
                      value={newReference.url}
                      onChange={({ detail }) => {
                        setNewReference(prev => ({
                          ...prev,
                          url: detail.value
                        }))
                      }}
                      placeholder="https://..."
                    />
                  </FormField>
                  <Button variant="primary" onClick={addReference}>
                    Add
                  </Button>
                </div>
              </SpaceBetween>
            </FormField>

            <FormField label="Tags" constraintText="Add relevant tags for categorization">
              <SpaceBetween direction="vertical" size="s">
                {formData.tags.length > 0 && (
                  <TokenGroup
                    onDismiss={({ detail }) => removeTag(detail.itemIndex)}
                    items={formData.tags.map(tag => ({ label: tag, dismissLabel: `Remove ${tag}` }))}
                  />
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    value={newTag}
                    onChange={({ detail }) => setNewTag(detail.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button onClick={addTag}>Add Tag</Button>
                </div>
              </SpaceBetween>
            </FormField>
          </SpaceBetween>
        </Form>
      </form>
    </Container>
  )
}

export default QuestionForm