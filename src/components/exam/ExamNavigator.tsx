import React from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Button,
  Badge,
  Grid
} from '@cloudscape-design/components'
import type { ExamSession, Answer } from '@/types'

interface ExamNavigatorProps {
  examSession: ExamSession
  currentQuestionIndex: number
  onQuestionSelect: (index: number) => void
  onMarkForReview: (questionId: string) => void
  onUnmarkForReview: (questionId: string) => void
}

const ExamNavigator: React.FC<ExamNavigatorProps> = ({
  examSession,
  currentQuestionIndex,
  onQuestionSelect,
  onMarkForReview,
  onUnmarkForReview
}) => {
  const getQuestionStatus = (questionIndex: number) => {
    const questionId = examSession.questions[questionIndex]
    const isAnswered = !!examSession.answers[questionId]
    const isMarked = examSession.markedForReview.includes(questionId)
    const isCurrent = questionIndex === currentQuestionIndex

    if (isCurrent) return 'current'
    if (isMarked) return 'marked'
    if (isAnswered) return 'answered'
    return 'unanswered'
  }

  const getQuestionStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'blue'
      case 'answered': return 'green'
      case 'marked': return 'orange'
      default: return 'grey'
    }
  }

  const getQuestionStatusText = (status: string) => {
    switch (status) {
      case 'current': return 'Current'
      case 'answered': return 'Answered'
      case 'marked': return 'Marked for Review'
      default: return 'Not Answered'
    }
  }

  const currentQuestionId = examSession.questions[currentQuestionIndex]
  const isCurrentMarked = examSession.markedForReview.includes(currentQuestionId)

  const answeredCount = Object.keys(examSession.answers).length
  const markedCount = examSession.markedForReview.length
  const unansweredCount = examSession.questions.length - answeredCount

  return (
    <div className="exam-sidebar">
      <Container
        header={
          <Header variant="h3">
            Question Navigator
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="l">
          {/* Current Question Actions */}
          <Box>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="h4">Current Question</Box>
              <Button
                variant={isCurrentMarked ? 'normal' : 'primary'}
                iconName={isCurrentMarked ? 'remove' : 'star'}
                onClick={() => {
                  if (isCurrentMarked) {
                    onUnmarkForReview(currentQuestionId)
                  } else {
                    onMarkForReview(currentQuestionId)
                  }
                }}
                fullWidth
              >
                {isCurrentMarked ? 'Unmark for Review' : 'Mark for Review'}
              </Button>
            </SpaceBetween>
          </Box>

          {/* Statistics */}
          <Box>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="h4">Progress Summary</Box>
              <SpaceBetween direction="vertical" size="xs">
                <Box>
                  <SpaceBetween direction="horizontal" size="s">
                    <Badge color="green">Answered: {answeredCount}</Badge>
                  </SpaceBetween>
                </Box>
                <Box>
                  <SpaceBetween direction="horizontal" size="s">
                    <Badge color="orange">Marked: {markedCount}</Badge>
                  </SpaceBetween>
                </Box>
                <Box>
                  <SpaceBetween direction="horizontal" size="s">
                    <Badge color="grey">Remaining: {unansweredCount}</Badge>
                  </SpaceBetween>
                </Box>
              </SpaceBetween>
            </SpaceBetween>
          </Box>

          {/* Question Grid */}
          <Box>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="h4">Questions</Box>
              <div className="question-navigator">
                <Grid
                  gridDefinition={[
                    { colspan: 2 }, { colspan: 2 }, { colspan: 2 }, { colspan: 2 }, { colspan: 2 }, { colspan: 2 }
                  ]}
                >
                  {examSession.questions.map((questionId, index) => {
                    const status = getQuestionStatus(index)
                    const statusColor = getQuestionStatusColor(status)
                    
                    return (
                      <Button
                        key={questionId}
                        variant={status === 'current' ? 'primary' : 'normal'}
                        onClick={() => onQuestionSelect(index)}
                        className={`question-nav-item ${status}`}
                        ariaLabel={`Question ${index + 1} - ${getQuestionStatusText(status)}`}
                      >
                        {index + 1}
                      </Button>
                    )
                  })}
                </Grid>
              </div>
            </SpaceBetween>
          </Box>

          {/* Legend */}
          <Box>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="h4">Legend</Box>
              <SpaceBetween direction="vertical" size="xs">
                <Box>
                  <SpaceBetween direction="horizontal" size="s">
                    <div 
                      className="question-nav-item current"
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}
                    >
                      N
                    </div>
                    <Box variant="small">Current Question</Box>
                  </SpaceBetween>
                </Box>
                <Box>
                  <SpaceBetween direction="horizontal" size="s">
                    <div 
                      className="question-nav-item answered"
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}
                    >
                      N
                    </div>
                    <Box variant="small">Answered</Box>
                  </SpaceBetween>
                </Box>
                <Box>
                  <SpaceBetween direction="horizontal" size="s">
                    <div 
                      className="question-nav-item marked"
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}
                    >
                      N
                    </div>
                    <Box variant="small">Marked for Review</Box>
                  </SpaceBetween>
                </Box>
                <Box>
                  <SpaceBetween direction="horizontal" size="s">
                    <div 
                      className="question-nav-item"
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        border: '1px solid #ccc'
                      }}
                    >
                      N
                    </div>
                    <Box variant="small">Not Answered</Box>
                  </SpaceBetween>
                </Box>
              </SpaceBetween>
            </SpaceBetween>
          </Box>

          {/* Quick Navigation */}
          <Box>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="h4">Quick Navigation</Box>
              <SpaceBetween direction="vertical" size="xs">
                <Button
                  variant="link"
                  onClick={() => {
                    // Find first unanswered question
                    const unansweredIndex = examSession.questions.findIndex((qId, idx) => 
                      !examSession.answers[qId] && idx !== currentQuestionIndex
                    )
                    if (unansweredIndex !== -1) {
                      onQuestionSelect(unansweredIndex)
                    }
                  }}
                  disabled={unansweredCount === 0}
                >
                  Next Unanswered
                </Button>
                <Button
                  variant="link"
                  onClick={() => {
                    // Find first marked question
                    const markedIndex = examSession.questions.findIndex((qId, idx) => 
                      examSession.markedForReview.includes(qId) && idx !== currentQuestionIndex
                    )
                    if (markedIndex !== -1) {
                      onQuestionSelect(markedIndex)
                    }
                  }}
                  disabled={markedCount === 0}
                >
                  Next Marked
                </Button>
                <Button
                  variant="link"
                  onClick={() => onQuestionSelect(0)}
                  disabled={currentQuestionIndex === 0}
                >
                  First Question
                </Button>
                <Button
                  variant="link"
                  onClick={() => onQuestionSelect(examSession.questions.length - 1)}
                  disabled={currentQuestionIndex === examSession.questions.length - 1}
                >
                  Last Question
                </Button>
              </SpaceBetween>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Container>
    </div>
  )
}

export default ExamNavigator