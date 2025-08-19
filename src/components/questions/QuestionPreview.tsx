import React from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Badge,
  Button,
  ExpandableSection,
  Alert,
  Link,
  TokenGroup,
  RadioGroup,
  Checkbox
} from '@cloudscape-design/components'
import type { Question } from '@/types'

interface QuestionPreviewProps {
  question: Question
  showAnswer?: boolean
  showExplanation?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  showAnswer = false,
  showExplanation = false,
  onEdit,
  onDelete
}) => {
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

  const getQuestionTypeBadge = (type: string) => {
    return (
      <Badge color={type === 'MCQ' ? 'blue' : 'purple'}>
        {type === 'MCQ' ? 'Single Answer' : 'Multiple Answers'}
      </Badge>
    )
  }

  return (
    <Container
      header={
        <Header
          variant="h3"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              {onEdit && (
                <Button variant="normal" iconName="edit" onClick={onEdit}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="normal" iconName="remove" onClick={onDelete}>
                  Delete
                </Button>
              )}
            </SpaceBetween>
          }
        >
          Question Preview
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Question Metadata */}
        <Box>
          <SpaceBetween direction="horizontal" size="s">
            <Badge>{question.certification}</Badge>
            <Badge color="grey">{question.domain}</Badge>
            {getDifficultyBadge(question.difficulty)}
            {getQuestionTypeBadge(question.questionType)}
          </SpaceBetween>
        </Box>

        {/* Question Text */}
        <Box>
          <Box variant="h4" margin={{ bottom: 's' }}>Question</Box>
          <Box>{question.questionText}</Box>
        </Box>

        {/* Answer Options */}
        <Box>
          <Box variant="h4" margin={{ bottom: 's' }}>Options</Box>
          <SpaceBetween direction="vertical" size="s">
            {question.options.map((option, index) => {
              const isCorrect = question.correctAnswers.includes(option.id)
              const optionLetter = String.fromCharCode(65 + index) // A, B, C, D...
              
              return (
                <Box key={option.id}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: showAnswer && isCorrect ? '#e8f5e8' : 'transparent',
                    border: showAnswer && isCorrect ? '1px solid #4caf50' : '1px solid transparent',
                    borderRadius: '4px'
                  }}>
                    {question.questionType === 'MCQ' ? (
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        border: '2px solid #ccc',
                        backgroundColor: showAnswer && isCorrect ? '#4caf50' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px'
                      }}>
                        {showAnswer && isCorrect && (
                          <div style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: 'white' 
                          }} />
                        )}
                      </div>
                    ) : (
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        border: '2px solid #ccc',
                        backgroundColor: showAnswer && isCorrect ? '#4caf50' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px'
                      }}>
                        {showAnswer && isCorrect && (
                          <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                        )}
                      </div>
                    )}
                    <Box>
                      <strong>{optionLetter}.</strong> {option.text}
                      {showAnswer && isCorrect && (
                        <Badge color="green" style={{ marginLeft: '8px' }}>Correct</Badge>
                      )}
                    </Box>
                  </div>
                </Box>
              )
            })}
          </SpaceBetween>
        </Box>

        {/* Correct Answers (when showing answers) */}
        {showAnswer && (
          <Alert type="success" header="Correct Answer(s)">
            <SpaceBetween direction="vertical" size="s">
              <Box>
                {question.correctAnswers.map(answerId => {
                  const option = question.options.find(opt => opt.id === answerId)
                  const index = question.options.findIndex(opt => opt.id === answerId)
                  const optionLetter = String.fromCharCode(65 + index)
                  return option ? (
                    <Box key={answerId}>
                      <strong>{optionLetter}.</strong> {option.text}
                    </Box>
                  ) : null
                })}
              </Box>
            </SpaceBetween>
          </Alert>
        )}

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <ExpandableSection headerText="Explanation" defaultExpanded={showAnswer}>
            <Box>{question.explanation}</Box>
          </ExpandableSection>
        )}

        {/* References */}
        {question.references && question.references.length > 0 && (
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

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <Box>
            <Box variant="h4" margin={{ bottom: 's' }}>Tags</Box>
            <TokenGroup
              items={question.tags.map(tag => ({ label: tag }))}
              readOnly
            />
          </Box>
        )}

        {/* Metadata */}
        <ExpandableSection headerText="Question Details">
          <SpaceBetween direction="vertical" size="s">
            <Box>
              <strong>Question ID:</strong> {question.questionId}
            </Box>
            <Box>
              <strong>Created by:</strong> {question.createdBy}
            </Box>
            <Box>
              <strong>Created:</strong> {new Date(question.createdAt).toLocaleString()}
            </Box>
            <Box>
              <strong>Last updated:</strong> {new Date(question.updatedAt).toLocaleString()}
            </Box>
          </SpaceBetween>
        </ExpandableSection>
      </SpaceBetween>
    </Container>
  )
}

export default QuestionPreview