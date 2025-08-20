import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  Grid,
  ColumnLayout,
  Alert,
  Badge,
  ProgressBar,
  ExpandableSection,
  StatusIndicator,
  Link
} from '@cloudscape-design/components';
import { ExamResult, Question } from '@/types';
import { DemoAPI } from '@/services/demo';

interface ExamResultsDisplayProps {
  resultId: string;
  onBackToDashboard: () => void;
  onRetakeExam?: () => void;
}

const ExamResultsDisplay: React.FC<ExamResultsDisplayProps> = ({ 
  resultId, 
  onBackToDashboard, 
  onRetakeExam 
}) => {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  useEffect(() => {
    loadExamResult();
  }, [resultId]);

  const loadExamResult = async () => {
    try {
      setLoading(true);
      const examResult = await DemoAPI.Result.getExamResult(resultId);
      if (!examResult) {
        throw new Error('Exam result not found');
      }
      setResult(examResult);

      // Load questions if this was a practice exam
      if (examResult.examType === 'PRACTICE') {
        // In a real implementation, we'd get the questions from the session
        // For demo, we'll use sample questions
        setShowDetailedReview(true);
      }
    } catch (error) {
      console.error('Failed to load exam result:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const downloadUrl = await DemoAPI.Result.generatePDFReport(resultId);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate PDF report:', error);
    }
  };

  const getScoreColor = (score: number, passed: boolean) => {
    if (passed) return 'success';
    if (score >= 600) return 'warning';
    return 'error';
  };

  const getDomainPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="loading">Loading exam results...</StatusIndicator>
        </Box>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container>
        <Alert type="error">
          Failed to load exam results. Please try again.
        </Alert>
      </Container>
    );
  }

  const domainBreakdown = typeof result.domainBreakdown === 'string' 
    ? JSON.parse(result.domainBreakdown) 
    : result.domainBreakdown;

  const overallPercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  return (
    <Container
      header={
        <Header
          variant="h1"
          description={`Completed on ${new Date(result.completedAt).toLocaleDateString()}`}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="normal"
                onClick={handleDownloadPDF}
                iconName="download"
              >
                Download PDF
              </Button>
              {onRetakeExam && (
                <Button
                  variant="normal"
                  onClick={onRetakeExam}
                >
                  Retake Exam
                </Button>
              )}
              <Button
                variant="primary"
                onClick={onBackToDashboard}
              >
                Back to Dashboard
              </Button>
            </SpaceBetween>
          }
        >
          {result.certification} Exam Results
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Overall Result */}
        <Container>
          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <Box textAlign="center">
              <SpaceBetween direction="vertical" size="m">
                <div>
                  <Header variant="h1" color={result.passed ? 'success' : 'error'}>
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </Header>
                  <Badge 
                    color={result.passed ? 'green' : 'red'}
                    size="large"
                  >
                    {result.passed ? 'Congratulations!' : 'Keep studying!'}
                  </Badge>
                </div>
                
                <Box>
                  <Header variant="h2">{result.scaledScore}/1000</Header>
                  <div>Scaled Score</div>
                </Box>
              </SpaceBetween>
            </Box>

            <Box>
              <SpaceBetween direction="vertical" size="m">
                <ColumnLayout columns={2}>
                  <div>
                    <strong>Raw Score:</strong> {result.correctAnswers}/{result.totalQuestions}
                  </div>
                  <div>
                    <strong>Percentage:</strong> {overallPercentage}%
                  </div>
                  <div>
                    <strong>Time Spent:</strong> {result.timeSpent} minutes
                  </div>
                  <div>
                    <strong>Passing Score:</strong> {result.certification.startsWith('CLF') ? '700' : '720'}
                  </div>
                </ColumnLayout>

                <Box>
                  <Header variant="h4">Score Visualization</Header>
                  <ProgressBar
                    value={(result.scaledScore / 1000) * 100}
                    variant={getScoreColor(result.scaledScore, result.passed)}
                    description={`${result.scaledScore}/1000 points`}
                  />
                </Box>
              </SpaceBetween>
            </Box>
          </Grid>
        </Container>

        {/* Domain Breakdown */}
        <Container
          header={
            <Header variant="h2">
              Domain Performance Analysis
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="m">
            {Object.values(domainBreakdown).map((domain: any, index: number) => (
              <Box key={index} padding="s" variant="outlined">
                <SpaceBetween direction="vertical" size="s">
                  <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                    <div>
                      <Header variant="h4">{domain.domain}</Header>
                      <div>
                        {domain.correct}/{domain.total} questions correct
                      </div>
                    </div>
                    <Box textAlign="right">
                      <Badge color={getDomainPerformanceColor(domain.percentage)}>
                        {domain.percentage}%
                      </Badge>
                    </Box>
                  </Grid>
                  
                  <ProgressBar
                    value={domain.percentage}
                    variant={getDomainPerformanceColor(domain.percentage)}
                  />
                </SpaceBetween>
              </Box>
            ))}
          </SpaceBetween>
        </Container>

        {/* Performance Insights */}
        <Container
          header={
            <Header variant="h2">
              Performance Insights
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="m">
            {/* Strong Areas */}
            <Box>
              <Header variant="h3">Strong Areas</Header>
              <SpaceBetween direction="horizontal" size="xs">
                {Object.values(domainBreakdown)
                  .filter((domain: any) => domain.percentage >= 70)
                  .map((domain: any, index: number) => (
                    <Badge key={index} color="green">
                      {domain.domain} ({domain.percentage}%)
                    </Badge>
                  ))}
              </SpaceBetween>
            </Box>

            {/* Areas for Improvement */}
            <Box>
              <Header variant="h3">Areas for Improvement</Header>
              <SpaceBetween direction="vertical" size="s">
                {Object.values(domainBreakdown)
                  .filter((domain: any) => domain.percentage < 70)
                  .map((domain: any, index: number) => (
                    <Alert
                      key={index}
                      type="warning"
                      header={`${domain.domain} - ${domain.percentage}%`}
                    >
                      Consider reviewing this domain. You got {domain.correct} out of {domain.total} questions correct.
                    </Alert>
                  ))}
              </SpaceBetween>
            </Box>

            {/* Study Recommendations */}
            <Box>
              <Header variant="h3">Study Recommendations</Header>
              <SpaceBetween direction="vertical" size="s">
                <Alert type="info">
                  <strong>Next Steps:</strong>
                  <ul>
                    <li>Review AWS documentation for weak domains</li>
                    <li>Take more practice exams focusing on problem areas</li>
                    <li>Consider AWS training courses or hands-on labs</li>
                    <li>Join AWS study groups and forums</li>
                  </ul>
                </Alert>
              </SpaceBetween>
            </Box>
          </SpaceBetween>
        </Container>

        {/* Detailed Question Review (for Practice Mode) */}
        {showDetailedReview && result.examType === 'PRACTICE' && (
          <ExpandableSection headerText="Detailed Question Review">
            <Alert type="info">
              In practice mode, you can review each question with explanations and references.
              This feature helps you understand the concepts better and learn from mistakes.
            </Alert>
            
            <SpaceBetween direction="vertical" size="m">
              {/* This would show individual questions with explanations */}
              <Box>
                <Header variant="h4">Question Review</Header>
                <div>Detailed question review would be implemented here with:</div>
                <ul>
                  <li>Each question with your selected answer</li>
                  <li>Correct answer highlighted</li>
                  <li>Detailed explanations</li>
                  <li>Links to AWS documentation</li>
                  <li>Related topics and services</li>
                </ul>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        )}

        {/* Additional Actions */}
        <Container>
          <SpaceBetween direction="horizontal" size="s">
            <Button
              variant="normal"
              onClick={() => window.print()}
              iconName="print"
            >
              Print Results
            </Button>
            <Button
              variant="normal"
              onClick={() => {
                const shareData = {
                  title: `${result.certification} Exam Results`,
                  text: `I ${result.passed ? 'passed' : 'took'} the ${result.certification} exam with a score of ${result.scaledScore}/1000!`,
                  url: window.location.href
                };
                if (navigator.share) {
                  navigator.share(shareData);
                } else {
                  navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                }
              }}
              iconName="share"
            >
              Share Results
            </Button>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Container>
  );
};

export default ExamResultsDisplay;