import React from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Button,
  Alert,
  ColumnLayout,
  Badge,
  ProgressBar,
  Link
} from '@cloudscape-design/components'

interface PracticeResultsProps {
  sessionStats: {
    totalQuestions: number
    correctCount: number
    startTime: number
    timeSpent: number
  }
  certification: string
  domains: string[]
  onRestart: () => void
  onExit?: () => void
}

const PracticeResults: React.FC<PracticeResultsProps> = ({
  sessionStats,
  certification,
  domains,
  onRestart,
  onExit
}) => {
  const accuracy = sessionStats.totalQuestions > 0 
    ? Math.round((sessionStats.correctCount / sessionStats.totalQuestions) * 100)
    : 0

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'green', message: 'Outstanding performance! You have mastered this material.' }
    if (percentage >= 80) return { level: 'Good', color: 'blue', message: 'Great job! You have a solid understanding of the concepts.' }
    if (percentage >= 70) return { level: 'Satisfactory', color: 'orange', message: 'Good progress! Review the explanations to strengthen your knowledge.' }
    if (percentage >= 60) return { level: 'Needs Improvement', color: 'red', message: 'Keep practicing! Focus on the areas where you struggled.' }
    return { level: 'Needs Significant Improvement', color: 'red', message: 'More study is needed. Review the fundamentals and practice more.' }
  }

  const performance = getPerformanceLevel(accuracy)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const averageTimePerQuestion = sessionStats.totalQuestions > 0 
    ? Math.round(sessionStats.timeSpent / sessionStats.totalQuestions)
    : 0

  const getTimeAnalysis = () => {
    if (averageTimePerQuestion < 60) {
      return { message: 'You answered questions quickly. Make sure you read them carefully.', color: 'orange' }
    } else if (averageTimePerQuestion > 180) {
      return { message: 'Take your time to understand, but try to be more decisive in exams.', color: 'blue' }
    }
    return { message: 'Good pacing! You took appropriate time to consider each question.', color: 'green' }
  }

  const timeAnalysis = getTimeAnalysis()

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Review your practice session performance"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="normal"
                onClick={onRestart}
              >
                Practice More
              </Button>
              {onExit && (
                <Button
                  variant="primary"
                  onClick={onExit}
                >
                  Back to Dashboard
                </Button>
              )}
            </SpaceBetween>
          }
        >
          Practice Session Complete
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Performance Alert */}
        <Alert
          type={accuracy >= 70 ? 'success' : 'warning'}
          header={`${performance.level} Performance`}
        >
          {performance.message}
        </Alert>

        {/* Summary Statistics */}
        <ColumnLayout columns={4} variant="text-grid">
          <Box>
            <Box variant="awsui-key-label">Questions Answered</Box>
            <Box variant="h2">{sessionStats.totalQuestions}</Box>
            <Box variant="small" color="text-status-inactive">
              Total questions
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Correct Answers</Box>
            <Box variant="h2" color="text-status-success">
              {sessionStats.correctCount}
            </Box>
            <Box variant="small" color="text-status-inactive">
              Out of {sessionStats.totalQuestions}
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Accuracy</Box>
            <Box variant="h2">
              <Badge color={performance.color}>{accuracy}%</Badge>
            </Box>
            <Box variant="small" color="text-status-inactive">
              Success rate
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Total Time</Box>
            <Box variant="h2">{formatTime(sessionStats.timeSpent)}</Box>
            <Box variant="small" color="text-status-inactive">
              Session duration
            </Box>
          </Box>
        </ColumnLayout>

        {/* Performance Visualization */}
        <Container
          header={
            <Header variant="h3">
              Performance Analysis
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="m">
            <Box>
              <SpaceBetween direction="vertical" size="s">
                <Box variant="h4">Overall Accuracy</Box>
                <ProgressBar
                  value={accuracy}
                  additionalInfo={`${sessionStats.correctCount} correct out of ${sessionStats.totalQuestions} questions`}
                  variant={accuracy >= 70 ? 'success' : 'error'}
                />
              </SpaceBetween>
            </Box>

            <ColumnLayout columns={2} variant="text-grid">
              <Box>
                <Box variant="awsui-key-label">Average Time per Question</Box>
                <Box variant="h3">{formatTime(averageTimePerQuestion)}</Box>
                <Box variant="small" color={`text-status-${timeAnalysis.color}`}>
                  {timeAnalysis.message}
                </Box>
              </Box>
              <Box>
                <Box variant="awsui-key-label">Performance Level</Box>
                <Box variant="h3">
                  <Badge color={performance.color}>{performance.level}</Badge>
                </Box>
                <Box variant="small" color="text-status-inactive">
                  Based on accuracy
                </Box>
              </Box>
            </ColumnLayout>
          </SpaceBetween>
        </Container>

        {/* Study Recommendations */}
        <Container
          header={
            <Header variant="h3">
              Study Recommendations
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="s">
            {accuracy >= 90 ? (
              <>
                <Alert type="success" header="Excellent Work!">
                  You have demonstrated strong mastery of this material. Consider:
                </Alert>
                <Box>
                  <ul>
                    <li>Taking a mock exam to test your knowledge under time pressure</li>
                    <li>Exploring more advanced topics or different certification domains</li>
                    <li>Helping others by sharing your knowledge and study techniques</li>
                    <li>Reviewing the latest AWS service updates and new features</li>
                  </ul>
                </Box>
              </>
            ) : accuracy >= 70 ? (
              <>
                <Alert type="info" header="Good Progress!">
                  You're on the right track. To improve further:
                </Alert>
                <Box>
                  <ul>
                    <li>Review the explanations for questions you got wrong</li>
                    <li>Practice more questions in areas where you struggled</li>
                    <li>Read AWS documentation for services you're less familiar with</li>
                    <li>Take practice exams to build confidence</li>
                  </ul>
                </Box>
              </>
            ) : (
              <>
                <Alert type="warning" header="Keep Practicing!">
                  More study is needed to build confidence. Focus on:
                </Alert>
                <Box>
                  <ul>
                    <li>Reviewing fundamental AWS concepts and services</li>
                    <li>Reading AWS whitepapers and best practices guides</li>
                    <li>Getting hands-on experience with AWS services</li>
                    <li>Taking more practice questions to identify knowledge gaps</li>
                  </ul>
                </Box>
              </>
            )}
          </SpaceBetween>
        </Container>

        {/* Session Details */}
        <Container
          header={
            <Header variant="h3">
              Session Details
            </Header>
          }
        >
          <ColumnLayout columns={2} variant="text-grid">
            <Box>
              <Box variant="awsui-key-label">Certification</Box>
              <Box>{certification}</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Domains Practiced</Box>
              <Box>{domains.join(', ')}</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Session Started</Box>
              <Box>{new Date(sessionStats.startTime).toLocaleString()}</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Session Completed</Box>
              <Box>{new Date().toLocaleString()}</Box>
            </Box>
          </ColumnLayout>
        </Container>

        {/* Next Steps */}
        <Container
          header={
            <Header variant="h3">
              Next Steps
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="horizontal" size="s">
              <Button
                variant="primary"
                onClick={onRestart}
              >
                Continue Practicing
              </Button>
              <Button
                variant="normal"
                onClick={() => {
                  // Navigate to mock exam
                  console.log('Starting mock exam')
                }}
              >
                Take Mock Exam
              </Button>
            </SpaceBetween>

            <Box variant="small">
              <strong>Tip:</strong> Regular practice sessions help reinforce your learning. 
              Try to practice a little bit each day rather than cramming before the exam.
            </Box>
          </SpaceBetween>
        </Container>

        {/* Additional Resources */}
        <Container
          header={
            <Header variant="h3">
              Additional Resources
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="s">
            <Box>
              <Link external href={`https://aws.amazon.com/certification/${certification.toLowerCase()}/`}>
                Official {certification} Certification Guide
              </Link>
            </Box>
            <Box>
              <Link external href="https://aws.amazon.com/training/">
                AWS Training and Certification
              </Link>
            </Box>
            <Box>
              <Link external href="https://docs.aws.amazon.com/">
                AWS Documentation
              </Link>
            </Box>
            <Box>
              <Link external href="https://aws.amazon.com/whitepapers/">
                AWS Whitepapers and Guides
              </Link>
            </Box>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Container>
  )
}

export default PracticeResults