import React, { useState, useEffect } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  RadioGroup,
  Checkbox,
  Button,
  Alert,
  ExpandableSection,
  Link,
  Badge
} from '@cloudscape-design/components'
import type { Question, Answer } from '@/types'

interface QuestionDisplayProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  currentAnswer?: Answer
  onAnswerChange: (answer: Answer) => void
  showExplanation?: boolean
  showCorrectAnswer?: boolean
  isReviewMode?: boolean
  timeSpentOnQuestion?: number
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswerChange,
  showExplanation = false,
  showCorrectAnswer = false,
  isReviewMode = false,
  timeSpentOnQuestion = 0
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    currentAnswer?.selectedOptions || []
  )
  const [startTime] = useState(Date.now())

  // Update selected options when currentAnswer changes
  useEffect(() => {
    setSelectedOptions(currentAnswer?.selectedOptions || [])
  }, [currentAnswer])

  // Update answer when selection changes
  useEffect(() => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const answer: Answer = {
      questionId: question.questionId,
      selectedOptions,
      timeSpent: timeSpentOnQuestion + timeSpent
    }

    // Only call onAnswerChange if there's actually a selection
    if (selectedOptions.length > 0) {
      onAnswerChange(answer)
    }
  }, [selectedOptions, question.questionId, onAnswerChange, startTime, timeSpentOnQuestion])

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (question.questionType === 'MCQ') {
      // Single choice - replace selection
      setSelectedOptions(checked ? [optionId] : [])
    } else {
      // Multiple choice - add/remove from selection
      setSelectedOptions(prev => 
        checked 
          ? [...prev, optionId]
          : prev.filter(id => id !== optionId)
      )
    }
  }

  const isOptionSelected = (optionId: string) => selectedOptions.includes(optionId)
  const isOptionCorrect = (optionId: string) => question.correctAnswers.includes(optionId)

  const getOptionStyle = (optionId: string) => {
    if (!showCorrectAnswer) return {}
    
    const isSelected = isOptionSelected(optionId)
    const isCorrect = isOptionCorrect(optionId)
    
    if (isCorrect) {
      return {
        backgroundColor: '#e8f5e8',
        border: '1px solid #4caf50',
        borderRadius: '4px',
        padding: '8px'
      }
    } else if (isSelected && !isCorrect) {
      return {
        backgroundColor: '#ffebee',
        border: '1px solid #f44336',
        borderRadius: '4px',
        padding: '8px'
      }
    }
    
    return {}
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

  return (
    <Container
      header={
        <Header
          variant="h3"
          description={`${question.certification} - ${question.domain}`}
          actions={
            <SpaceBetween direction="horizontal" size="s">
              {getDifficultyBadge(question.difficulty)}
              <Badge color={question.questionType === 'MCQ' ? 'blue' : 'purple'}>
                {question.questionType === 'MCQ' ? 'Single Answer' : 'Multiple Answers'}
              </Badge>
            </SpaceBetween>
          }
        >
          Question {questionNumber} of {totalQuestions}
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Question Text */}
        <Box>
          <Box variant="h4" margin={{ bottom: 's' }}>
            {question.questionText}
          </Box>
        </Box>

        {/* Instructions */}
        <Alert 
          type="info" 
          header={question.questionType === 'MCQ' ? 'Select ONE answer' : 'Select ALL correct answers'}
        >
          {question.questionType === 'MCQ' 
            ? 'Choose the single best answer from the options below.'
            : 'Choose all answers that apply. There may be more than one correct answer.'
          }
        </Alert>

        {/* Answer Options */}
        <Box>
          <SpaceBetween direction="vertical" size="s">
            {question.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index) // A, B, C, D...
              const isSelected = isOptionSelected(option.id)
              const isCorrect = isOptionCorrect(option.id)
              
              return (
                <div key={option.id} style={getOptionStyle(option.id)}>
                  <SpaceBetween direction="horizontal" size="s">
                    {question.questionType === 'MCQ' ? (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', width: '100%' }}>
                        <input
                          type="radio"
                          name={`question-${question.questionId}`}
                          checked={isSelected}
                          onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                          disabled={isReviewMode}
                          style={{ marginTop: '2px' }}
                        />
                        <Box style={{ flex: 1 }}>
                          <strong>{optionLetter}.</strong> {option.text}
                          {showCorrectAnswer && isCorrect && (
                            <Badge color="green" style={{ marginLeft: '8px' }}>
                              Correct
                            </Badge>
                          )}
                          {showCorrectAnswer && isSelected && !isCorrect && (
                            <Badge color="red" style={{ marginLeft: '8px' }}>
                              Incorrect
                            </Badge>
                          )}
                        </Box>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', width: '100%' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                          disabled={isReviewMode}
                          style={{ marginTop: '2px' }}
                        />
                        <Box style={{ flex: 1 }}>
                          <strong>{optionLetter}.</strong> {option.text}
                          {showCorrectAnswer && isCorrect && (
                            <Badge color="green" style={{ marginLeft: '8px' }}>
                              Correct
                            </Badge>
                          )}
                          {showCorrectAnswer && isSelected && !isCorrect && (
                            <Badge color="red" style={{ marginLeft: '8px' }}>
                              Incorrect
                            </Badge>
                          )}
                        </Box>
                      </div>
                    )}
                  </SpaceBetween>
                </div>
              )
            })}
          </SpaceBetween>
        </Box>

        {/* Answer Summary (when showing correct answers) */}
        {showCorrectAnswer && (
          <Alert 
            type={selectedOptions.length > 0 && selectedOptions.every(id => isOptionCorrect(id)) && 
                  question.correctAnswers.every(id => selectedOptions.includes(id)) ? 'success' : 'error'}
            header="Answer Summary"
          >
            <SpaceBetween direction="vertical" size="s">
              <Box>
                <strong>Your Answer:</strong> {
                  selectedOptions.length > 0 
                    ? selectedOptions.map(id => {
                        const option = question.options.find(opt => opt.id === id)
                        const index = question.options.findIndex(opt => opt.id === id)
                        return option ? `${String.fromCharCode(65 + index)}. ${option.text}` : ''
                      }).join(', ')
                    : 'No answer selected'
                }
              </Box>
              <Box>
                <strong>Correct Answer:</strong> {
                  question.correctAnswers.map(id => {
                    const option = question.options.find(opt => opt.id === id)
                    const index = question.options.findIndex(opt => opt.id === id)
                    return option ? `${String.fromCharCode(65 + index)}. ${option.text}` : ''
                  }).join(', ')
                }
              </Box>
            </SpaceBetween>
          </Alert>
        )}

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <ExpandableSection 
            headerText="Explanation" 
            defaultExpanded={showCorrectAnswer}
          >
            <Box>{question.explanation}</Box>
          </ExpandableSection>
        )}

        {/* References */}
        {showExplanation && question.references && question.references.length > 0 && (
          <ExpandableSection headerText="References">
            <SpaceBetween direction="vertical" size="s">
              {question.references.map((ref, index) => (
                <Box key={index}>
                  <Link external href={ref.url}>
                    {ref.title}
                  </Link>
                  <Box variant="small" color="text-status-inactive">
                    {ref.type}
                  </Box>
                </Box>
              ))}
            </SpaceBetween>
          </ExpandableSection>
        )}

        {/* Question Metadata (for practice mode) */}
        {showExplanation && (
          <ExpandableSection headerText="Question Details">
            <SpaceBetween direction="vertical" size="s">
              <Box>
                <strong>Domain:</strong> {question.domain}
              </Box>
              <Box>
                <strong>Difficulty:</strong> {question.difficulty}
              </Box>
              {question.tags && question.tags.length > 0 && (
                <Box>
                  <strong>Tags:</strong> {question.tags.join(', ')}
                </Box>
              )}
              {timeSpentOnQuestion > 0 && (
                <Box>
                  <strong>Time Spent:</strong> {Math.floor(timeSpentOnQuestion / 60)}m {timeSpentOnQuestion % 60}s
                </Box>
              )}
            </SpaceBetween>
          </ExpandableSection>
        )}
      </SpaceBetween>
    </Container>
  )
}

export default QuestionDisplay