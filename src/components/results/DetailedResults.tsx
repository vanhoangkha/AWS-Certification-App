import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Table,
  Badge,
  Button,
  Modal,
  Alert,
  Tabs,
  ColumnLayout,
  ProgressBar,
  ExpandableSection
} from '@cloudscape-design/components'
import QuestionPreview from '@/components/questions/QuestionPreview'
import type { ExamResult, Question, Answer } from '@/types'

interface DetailedResultsProps {
  result: ExamResult
  questions: Question[]
  userAnswers: Record<string, Answer>
  onClose?: () => void
}

interface QuestionResultItem {
  questionId: string
  question: Question
  userAnswer?: Answer
  isCorrect: boolean
  timeSpent: number
  domain: string
  difficulty: string
}

const DetailedResults: React.FC<DetailedResultsProps> = ({
  result,
  questions,
  userAnswers,
  onClose
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Process questions for detailed analysis
  const questionResults: QuestionResultItem[] = questions.map(question => {
    const userAnswer = userAnswers[question.questionId]
    const isCorrect = userAnswer ? 
      userAnswer.selectedOptions.length === question.correctAnswers.length &&
      userAnswer.selectedOptions.every(option => question.correctAnswers.includes(option)) :
      false

    return {
      questionId: question.questionId,
      question,
      userAnswer,
      isCorrect,
      timeSpent: userAnswer?.timeSpent || 0,
      domain: question.domain,
      difficulty: question.difficulty
    }
  })

  const correctQuestions = questionResults.filter(q => q.isCorrect)
  const incorrectQuestions = questionResults.filter(q => !q.isCorrect && q.userAnswer)
  const unansweredQuestions = questionResults.filter(q => !q.userAnswer)

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question)
    setShowQuestionModal(true)
  }

  const getStatusBadge = (item: QuestionResultItem) => {
    if (!item.userAnswer) return <Badge color="grey">Not Answered</Badge>
    if (item.isCorrect) return <Badge color="green">Correct</Badge>
    return <Badge color="red">Incorrect</Badge>
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const columnDefinitions = [
    {
      id: 'questionNumber',
      header: 'Question',
      cell: (item: QuestionResultItem, index: number) => (
        <Button
          variant="link"
          onClick={() => handleViewQuestion(item.question)}
        >
          Question {index + 1}
        </Button>
      ),
      sortingField: 'questionNumber'
    },
    {
      id: 'domain',
      header: 'Domain',
      cell: (item: QuestionResultItem) => (
        <Box>{item.domain}</Box>
      ),
      sortingField: 'domain'
    },
    {
      id: 'difficulty',
      header: 'Difficulty',
      cell: (item: QuestionResultItem) => getDifficultyBadge(item.difficulty),
      sortingField: 'difficulty'
    },
    {
      id: 'status',
      header: 'Result',
      cell: (item: QuestionResultItem) => getStatusBadge(item),
      sortingField: 'isCorrect'
    },
    {
      id: 'timeSpent',
      header: 'Time Spent',
      cell: (item: QuestionResultItem) => (
        <Box>{formatTime(item.timeSpent)}</Box>
      ),
      sortingField: 'timeSpent'
    }
  ]

  const overviewTab = (
    <SpaceBetween direction="vertical" size="l">
      {/* Summary Cards */}
      <ColumnLayout columns={4} variant="text-grid">
        <Box>
          <Box variant="awsui-key-label">Correct Answers</Box>
          <Box variant="h2" color="text-status-success">
            {correctQuestions.length}
          </Box>
          <Box variant="small" color="text-status-inactive">
            {Math.round((correctQuestions.length / questions.length) * 100)}%
          </Box>
        </Box>
        <Box>
          <Box variant="awsui-key-label">Incorrect Answers</Box>
          <Box variant="h2" color="text-status-error">
            {incorrectQuestions.length}
          </Box>
          <Box variant="small" color="text-status-inactive">
            {Math.round((incorrectQuestions.length / questions.length) * 100)}%
          </Box>
        </Box>
        <Box>
          <Box variant="awsui-key-label">Unanswered</Box>
          <Box variant="h2" color="text-status-inactive">
            {unansweredQuestions.length}
          </Box>
          <Box variant="small" color="text-status-inactive">
            {Math.round((unansweredQuestions.length / questions.length) * 100)}%
          </Box>
        </Box>
        <Box>
          <Box variant="awsui-key-label">Average Time</Box>
          <Box variant="h2">
            {formatTime(Math.round(questionResults.reduce((sum, q) => sum + q.timeSpent, 0) / questions.length))}
          </Box>
          <Box variant="small" color="text-status-inactive">
            Per question
          </Box>
        </Box>
      </ColumnLayout>

      {/* Performance by Difficulty */}
      <Container
        header={
          <Header variant="h3">
            Performance by Difficulty
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          {['EASY', 'MEDIUM', 'HARD'].map(difficulty => {
            const difficultyQuestions = questionResults.filter(q => q.difficulty === difficulty)
            const correctCount = difficultyQuestions.filter(q => q.isCorrect).length
            const percentage = difficultyQuestions.length > 0 ? 
              Math.round((correctCount / difficultyQuestions.length) * 100) : 0

            return (
              <Box key={difficulty}>
                <SpaceBetween direction="vertical" size="s">
                  <SpaceBetween direction="horizontal" size="s">
                    <Box style={{ flex: 1 }}>
                      {getDifficultyBadge(difficulty)}
                    </Box>
                    <Box>
                      {correctCount}/{difficultyQuestions.length}
                    </Box>
                  </SpaceBetween>
                  <ProgressBar
                    value={percentage}
                    additionalInfo={`${percentage}% correct`}
                    variant={percentage >= 70 ? 'success' : 'error'}
                  />
                </SpaceBetween>
              </Box>
            )
          })}
        </SpaceBetween>
      </Container>

      {/* Time Analysis */}
      <Container
        header={
          <Header variant="h3">
            Time Analysis
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="s">
          <ColumnLayout columns={3} variant="text-grid">
            <Box>
              <Box variant="awsui-key-label">Fastest Question</Box>
              <Box variant="h3">
                {formatTime(Math.min(...questionResults.map(q => q.timeSpent)))}
              </Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Slowest Question</Box>
              <Box variant="h3">
                {formatTime(Math.max(...questionResults.map(q => q.timeSpent)))}
              </Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Total Time</Box>
              <Box variant="h3">
                {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
              </Box>
            </Box>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  )

  const allQuestionsTab = (
    <Table
      columnDefinitions={columnDefinitions}
      items={questionResults}
      loadingText="Loading questions..."
      empty={
        <Box textAlign="center" color="inherit">
          <b>No questions found</b>
        </Box>
      }
      header={
        <Header
          counter={`(${questionResults.length})`}
          description="Click on a question to view details"
        >
          All Questions
        </Header>
      }
      pagination={{
        currentPageIndex: 1,
        pagesCount: Math.ceil(questionResults.length / 25),
        onChange: () => {}
      }}
    />
  )

  const incorrectTab = (
    <SpaceBetween direction="vertical" size="l">
      <Alert type="info" header="Review Incorrect Answers">
        Focus on understanding why these answers were incorrect to improve your knowledge.
      </Alert>
      <Table
        columnDefinitions={columnDefinitions}
        items={incorrectQuestions}
        loadingText="Loading questions..."
        empty={
          <Box textAlign="center" color="inherit">
            <b>No incorrect answers</b>
            <Box variant="p" color="inherit">
              Great job! You answered all attempted questions correctly.
            </Box>
          </Box>
        }
        header={
          <Header
            counter={`(${incorrectQuestions.length})`}
            description="Questions you answered incorrectly"
          >
            Incorrect Answers
          </Header>
        }
      />
    </SpaceBetween>
  )

  const unansweredTab = (
    <SpaceBetween direction="vertical" size="l">
      <Alert type="warning" header="Unanswered Questions">
        These questions were not answered and counted as incorrect in your final score.
      </Alert>
      <Table
        columnDefinitions={columnDefinitions}
        items={unansweredQuestions}
        loadingText="Loading questions..."
        empty={
          <Box textAlign="center" color="inherit">
            <b>No unanswered questions</b>
            <Box variant="p" color="inherit">
              Excellent! You answered all questions.
            </Box>
          </Box>
        }
        header={
          <Header
            counter={`(${unansweredQuestions.length})`}
            description="Questions you did not answer"
          >
            Unanswered Questions
          </Header>
        }
      />
    </SpaceBetween>
  )

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: overviewTab
    },
    {
      id: 'all',
      label: `All Questions (${questionResults.length})`,
      content: allQuestionsTab
    },
    {
      id: 'incorrect',
      label: `Incorrect (${incorrectQuestions.length})`,
      content: incorrectTab
    },
    {
      id: 'unanswered',
      label: `Unanswered (${unansweredQuestions.length})`,
      content: unansweredTab
    }
  ]

  return (
    <>
      <Container
        header={
          <Header
            variant="h2"
            description="Detailed analysis of your exam performance"
            actions={
              onClose && (
                <Button variant="primary" onClick={onClose}>
                  Close
                </Button>
              )
            }
          >
            Detailed Results
          </Header>
        }
      >
        <Tabs
          activeTabId={activeTab}
          onChange={({ detail }) => setActiveTab(detail.activeTabId)}
          tabs={tabs}
        />
      </Container>

      {/* Question Detail Modal */}
      <Modal
        visible={showQuestionModal}
        onDismiss={() => setShowQuestionModal(false)}
        header="Question Details"
        size="large"
        footer={
          <Box float="right">
            <Button variant="primary" onClick={() => setShowQuestionModal(false)}>
              Close
            </Button>
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

export default DetailedResults