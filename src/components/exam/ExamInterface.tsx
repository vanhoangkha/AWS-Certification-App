import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  Grid,
  ColumnLayout,
  Alert,
  Modal,
  ProgressBar,
  Badge,
  StatusIndicator
} from '@cloudscape-design/components';
import { Question, ExamSession } from '@/types';
import { DemoAPI } from '@/services/demo';

interface ExamInterfaceProps {
  sessionId: string;
  onExamComplete: (resultId: string) => void;
  onExamExit: () => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ 
  sessionId, 
  onExamComplete, 
  onExamExit 
}) => {
  const [session, setSession] = useState<ExamSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  // Load exam session and questions
  useEffect(() => {
    loadExamSession();
  }, [sessionId]);

  // Timer effect
  useEffect(() => {
    if (!session || session.status !== 'IN_PROGRESS') return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(session.startTime).getTime();
      const timeLimit = session.timeLimit * 60 * 1000; // Convert to milliseconds
      const elapsed = now - startTime;
      const remaining = Math.max(0, timeLimit - elapsed);

      setTimeRemaining(remaining);

      // Auto-submit when time is up
      if (remaining <= 0 && !autoSubmitting) {
        setAutoSubmitting(true);
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session, autoSubmitting]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    if (!session || session.status !== 'IN_PROGRESS') return;

    const autoSave = setInterval(() => {
      saveProgress();
    }, 30000);

    return () => clearInterval(autoSave);
  }, [session, answers, markedForReview]);

  const loadExamSession = async () => {
    try {
      setLoading(true);
      const examSession = await DemoAPI.Exam.getExamSession(sessionId);
      if (!examSession) {
        throw new Error('Exam session not found');
      }

      setSession(examSession);
      setAnswers(examSession.answers);
      setMarkedForReview(examSession.markedForReview);

      // Load questions
      const questionPromises = examSession.questions.map(qId => 
        DemoAPI.Question.getQuestion(qId)
      );
      const loadedQuestions = await Promise.all(questionPromises);
      setQuestions(loadedQuestions.filter(q => q !== null) as Question[]);

    } catch (error) {
      console.error('Failed to load exam session:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    if (!session) return;

    try {
      await DemoAPI.Exam.saveExamProgress({
        sessionId: session.sessionId,
        answers,
        markedForReview
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleAnswerChange = (questionId: string, selectedAnswers: number[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswers
    }));
  };

  const handleMarkForReview = (questionId: string) => {
    setMarkedForReview(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = async () => {
    try {
      await saveProgress();
      const result = await DemoAPI.Exam.submitExam(sessionId);
      onExamComplete(result.resultId);
    } catch (error) {
      console.error('Failed to submit exam:', error);
    }
  };

  const handleAutoSubmit = async () => {
    try {
      await saveProgress();
      const result = await DemoAPI.Exam.submitExam(sessionId);
      onExamComplete(result.resultId);
    } catch (error) {
      console.error('Failed to auto-submit exam:', error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (questionId: string, index: number) => {
    const isAnswered = answers[questionId] && answers[questionId].length > 0;
    const isMarked = markedForReview.includes(questionId);
    const isCurrent = index === currentQuestionIndex;

    if (isCurrent) return 'current';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'blue';
      case 'answered': return 'green';
      case 'marked': return 'red';
      default: return 'grey';
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).filter(qId => answers[qId] && answers[qId].length > 0).length;

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="loading">Loading exam...</StatusIndicator>
        </Box>
      </Container>
    );
  }

  if (!session || !currentQuestion) {
    return (
      <Container>
        <Alert type="error">
          Failed to load exam session. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Exam Header */}
      <Box padding="s" variant="outlined">
        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
          <Box>
            <Header variant="h3">{session.certification} Exam</Header>
            <Badge color="blue">{session.examType}</Badge>
          </Box>
          <Box textAlign="center">
            <Header variant="h3">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Header>
            <ProgressBar value={progress} />
          </Box>
          <Box textAlign="right">
            <Header variant="h3" color={timeRemaining < 300000 ? 'error' : 'default'}>
              {formatTime(timeRemaining)}
            </Header>
            <div>Answered: {answeredCount}/{questions.length}</div>
          </Box>
        </Grid>
      </Box>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Question Content */}
        <div style={{ flex: 1, padding: '24px' }}>
          <SpaceBetween direction="vertical" size="l">
            {/* Question Text */}
            <Container>
              <Header variant="h2">
                Question {currentQuestionIndex + 1}
                {markedForReview.includes(currentQuestion.questionId) && (
                  <Badge color="red" style={{ marginLeft: '8px' }}>Marked for Review</Badge>
                )}
              </Header>
              <Box fontSize="body-m" padding={{ vertical: 'm' }}>
                {currentQuestion.questionText}
              </Box>
            </Container>

            {/* Answer Options */}
            <Container>
              <SpaceBetween direction="vertical" size="s">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion.questionId]?.includes(index) || false;
                  const isMultiSelect = currentQuestion.questionType === 'MULTIPLE_SELECT';

                  return (
                    <Box
                      key={index}
                      padding="s"
                      variant={isSelected ? 'highlighted' : 'default'}
                      onClick={() => {
                        const currentAnswers = answers[currentQuestion.questionId] || [];
                        let newAnswers: number[];

                        if (isMultiSelect) {
                          if (isSelected) {
                            newAnswers = currentAnswers.filter(a => a !== index);
                          } else {
                            newAnswers = [...currentAnswers, index];
                          }
                        } else {
                          newAnswers = isSelected ? [] : [index];
                        }

                        handleAnswerChange(currentQuestion.questionId, newAnswers);
                      }}
                      style={{ cursor: 'pointer', border: isSelected ? '2px solid #0073bb' : '1px solid #e9ebed' }}
                    >
                      <SpaceBetween direction="horizontal" size="s">
                        <Badge color={isSelected ? 'blue' : 'grey'}>
                          {String.fromCharCode(65 + index)}
                        </Badge>
                        <span>{option}</span>
                      </SpaceBetween>
                    </Box>
                  );
                })}
              </SpaceBetween>
            </Container>

            {/* Navigation Controls */}
            <Box>
              <SpaceBetween direction="horizontal" size="s">
                <Button
                  variant="normal"
                  disabled={currentQuestionIndex === 0}
                  onClick={handlePreviousQuestion}
                >
                  Previous
                </Button>
                <Button
                  variant="normal"
                  onClick={() => handleMarkForReview(currentQuestion.questionId)}
                >
                  {markedForReview.includes(currentQuestion.questionId) ? 'Unmark' : 'Mark for Review'}
                </Button>
                <Button
                  variant="normal"
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={handleNextQuestion}
                >
                  Next
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowSubmitModal(true)}
                >
                  End Exam
                </Button>
                <Button
                  variant="link"
                  onClick={() => setShowExitModal(true)}
                >
                  Exit
                </Button>
              </SpaceBetween>
            </Box>
          </SpaceBetween>
        </div>

        {/* Question Navigator Sidebar */}
        <Box padding="s" variant="outlined" style={{ width: '250px', overflowY: 'auto' }}>
          <Header variant="h4">Question Navigator</Header>
          <SpaceBetween direction="vertical" size="xs">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {questions.map((question, index) => {
                const status = getQuestionStatus(question.questionId, index);
                return (
                  <Button
                    key={question.questionId}
                    variant={status === 'current' ? 'primary' : 'normal'}
                    onClick={() => handleQuestionNavigation(index)}
                    style={{
                      minWidth: '40px',
                      backgroundColor: status === 'answered' ? '#d4edda' : 
                                     status === 'marked' ? '#f8d7da' : 'transparent'
                    }}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
            
            <Box padding={{ top: 's' }}>
              <SpaceBetween direction="vertical" size="xs">
                <div><Badge color="blue">Current</Badge> Current Question</div>
                <div><Badge color="green">Answered</Badge> Answered ({answeredCount})</div>
                <div><Badge color="red">Marked</Badge> Marked for Review ({markedForReview.length})</div>
                <div><Badge color="grey">Unanswered</Badge> Unanswered ({questions.length - answeredCount})</div>
              </SpaceBetween>
            </Box>
          </SpaceBetween>
        </Box>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        visible={showSubmitModal}
        onDismiss={() => setShowSubmitModal(false)}
        header="Submit Exam"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowSubmitModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmitExam}>
                Submit Exam
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          <Alert type="warning">
            Are you sure you want to submit your exam? This action cannot be undone.
          </Alert>
          <ColumnLayout columns={2}>
            <div>
              <strong>Answered Questions:</strong> {answeredCount}/{questions.length}
            </div>
            <div>
              <strong>Marked for Review:</strong> {markedForReview.length}
            </div>
          </ColumnLayout>
          {answeredCount < questions.length && (
            <Alert type="info">
              You have {questions.length - answeredCount} unanswered questions. 
              These will be marked as incorrect.
            </Alert>
          )}
        </SpaceBetween>
      </Modal>

      {/* Exit Confirmation Modal */}
      <Modal
        visible={showExitModal}
        onDismiss={() => setShowExitModal(false)}
        header="Exit Exam"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowExitModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onExamExit}>
                Exit Exam
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <Alert type="warning">
          Are you sure you want to exit the exam? Your progress will be saved, 
          but you may not be able to resume this session.
        </Alert>
      </Modal>
    </div>
  );
};

export default ExamInterface;