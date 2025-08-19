import React from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Badge,
  Alert,
  ProgressBar,
  ColumnLayout,
  Button,
  Link
} from '@cloudscape-design/components'
import { formatDistanceToNow } from 'date-fns'
import type { ExamResult } from '@/types'

interface ResultsDisplayProps {
  result: ExamResult
  onViewDetailedResults?: () => void
  onRetakeExam?: () => void
  onExportPDF?: () => void
  showActions?: boolean
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  onViewDetailedResults,
  onRetakeExam,
  onExportPDF,
  showActions = true
}) => {
  const getScoreBadge = (score: number, passed: boolean) => {
    return (
      <Badge 
        color={passed ? 'green' : 'red'}
        size="large"
      >
        {passed ? 'PASS' : 'FAIL'}
      </Badge>
    )
  }

  const getScoreColor = (passed: boolean) => {
    return passed ? 'text-status-success' : 'text-status-error'
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'green' }
    if (percentage >= 80) return { level: 'Good', color: 'blue' }
    if (percentage >= 70) return { level: 'Satisfactory', color: 'orange' }
    return { level: 'Needs Improvement', color: 'red' }
  }

  const overallPercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100)
  const performance = getPerformanceLevel(overallPercentage)

  return (
    <Container
      header={
        <Header
          variant="h2"
          description={`${result.certification} ${result.examType} Exam Results`}
          actions={
            showActions && (
              <SpaceBetween direction="horizontal" size="xs">
                {onExportPDF && (
                  <Button
                    variant="normal"
                    iconName="download"
                    onClick={onExportPDF}
                  >
                    Export PDF
                  </Button>
                )}
                {onViewDetailedResults && (
                  <Button
                    variant="normal"
                    onClick={onViewDetailedResults}
                  >
                    View Details
                  </Button>
                )}
                {onRetakeExam && (
                  <Button
                    variant="primary"
                    onClick={onRetakeExam}
                  >
                    Retake Exam
                  </Button>
                )}
              </SpaceBetween>
            )
          }
        >
          Exam Results
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Main Score Display */}
        <div className="score-display">
          <SpaceBetween direction="vertical" size="m" alignItems="center">
            <Box variant="h1" className={`scaled-score ${result.passed ? 'pass' : 'fail'}`}>
              {result.scaledScore}
            </Box>
            <Box variant="small" color="text-status-inactive">
              Scaled Score (100-1000)
            </Box>
            <div className={`pass-indicator ${result.passed ? 'pass' : 'fail'}`}>
              {getScoreBadge(result.scaledScore, result.passed)}
            </div>
            <Box variant="h3" color={getScoreColor(result.passed)}>
              {result.passed ? 'Congratulations! You passed!' : 'You did not pass this time.'}
            </Box>
          </SpaceBetween>
        </div>

        {/* Pass/Fail Alert */}
        <Alert
          type={result.passed ? 'success' : 'error'}
          header={result.passed ? 'Exam Passed' : 'Exam Not Passed'}
        >
          <SpaceBetween direction="vertical" size="s">
            <Box>
              You scored <strong>{result.scaledScore}</strong> out of 1000. 
              The passing score is <strong>720</strong>.
            </Box>
            {result.passed ? (
              <Box>
                You have successfully demonstrated the knowledge and skills required for the {result.certification} certification.
              </Box>
            ) : (
              <Box>
                Don't be discouraged! Review the domain breakdown below to identify areas for improvement and try again.
              </Box>
            )}
          </SpaceBetween>
        </Alert>

        {/* Summary Statistics */}
        <ColumnLayout columns={4} variant="text-grid">
          <Box>
            <Box variant="awsui-key-label">Questions Answered</Box>
            <Box variant="h2">{result.correctAnswers}/{result.totalQuestions}</Box>
            <Box variant="small" color="text-status-inactive">
              {overallPercentage}% correct
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Time Spent</Box>
            <Box variant="h2">{formatDuration(result.timeSpent)}</Box>
            <Box variant="small" color="text-status-inactive">
              Total exam time
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Performance Level</Box>
            <Box variant="h2">
              <Badge color={performance.color}>{performance.level}</Badge>
            </Box>
            <Box variant="small" color="text-status-inactive">
              Based on score
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Completed</Box>
            <Box variant="h2">
              {formatDistanceToNow(new Date(result.completedAt), { addSuffix: true })}
            </Box>
            <Box variant="small" color="text-status-inactive">
              {new Date(result.completedAt).toLocaleDateString()}
            </Box>
          </Box>
        </ColumnLayout>

        {/* Domain Breakdown */}
        <Container
          header={
            <Header variant="h3" description="Performance by exam domain">
              Domain Breakdown
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="m">
            {result.domainBreakdown.map((domain, index) => {
              const domainPerformance = getPerformanceLevel(domain.percentage)
              
              return (
                <Box key={index}>
                  <SpaceBetween direction="vertical" size="s">
                    <SpaceBetween direction="horizontal" size="s">
                      <Box variant="h4" style={{ flex: 1 }}>
                        {domain.domain}
                      </Box>
                      <Badge color={domainPerformance.color}>
                        {domainPerformance.level}
                      </Badge>
                      <Box variant="h4" className="domain-score">
                        {domain.correctAnswers}/{domain.totalQuestions}
                      </Box>
                    </SpaceBetween>
                    
                    <ProgressBar
                      value={domain.percentage}
                      additionalInfo={`${domain.percentage}% (${domain.correctAnswers} of ${domain.totalQuestions} correct)`}
                      variant={domain.percentage >= 70 ? 'success' : 'error'}
                    />
                    
                    <Box variant="small" color="text-status-inactive">
                      Score: {domain.score}/1000
                    </Box>
                  </SpaceBetween>
                </Box>
              )
            })}
          </SpaceBetween>
        </Container>

        {/* Recommendations */}
        <Container
          header={
            <Header variant="h3">
              Recommendations
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="s">
            {result.passed ? (
              <>
                <Alert type="success" header="Great Job!">
                  You have demonstrated strong knowledge across all domains. Consider pursuing advanced certifications or specializations.
                </Alert>
                <Box>
                  <strong>Next Steps:</strong>
                  <ul>
                    <li>Apply your knowledge in real-world projects</li>
                    <li>Consider pursuing Professional or Specialty certifications</li>
                    <li>Share your achievement and help others prepare</li>
                    <li>Stay updated with AWS service updates and new features</li>
                  </ul>
                </Box>
              </>
            ) : (
              <>
                <Alert type="info" header="Areas for Improvement">
                  Focus your study efforts on the domains where you scored below 70%.
                </Alert>
                <Box>
                  <strong>Study Recommendations:</strong>
                  <ul>
                    {result.domainBreakdown
                      .filter(domain => domain.percentage < 70)
                      .map((domain, index) => (
                        <li key={index}>
                          <strong>{domain.domain}</strong> - {domain.percentage}% 
                          (Review AWS documentation and hands-on labs)
                        </li>
                      ))}
                  </ul>
                </Box>
                <Box>
                  <strong>Preparation Tips:</strong>
                  <ul>
                    <li>Take more practice exams in your weak areas</li>
                    <li>Review AWS whitepapers and documentation</li>
                    <li>Get hands-on experience with AWS services</li>
                    <li>Join study groups or online communities</li>
                  </ul>
                </Box>
              </>
            )}
          </SpaceBetween>
        </Container>

        {/* Exam Information */}
        <Container
          header={
            <Header variant="h3">
              Exam Information
            </Header>
          }
        >
          <ColumnLayout columns={2} variant="text-grid">
            <Box>
              <Box variant="awsui-key-label">Certification</Box>
              <Box>{result.certification}</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Exam Type</Box>
              <Box>{result.examType}</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Result ID</Box>
              <Box variant="small">{result.resultId}</Box>
            </Box>
            <Box>
              <Box variant="awsui-key-label">Session ID</Box>
              <Box variant="small">{result.sessionId}</Box>
            </Box>
          </ColumnLayout>
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
              <Link external href={`https://aws.amazon.com/certification/${result.certification.toLowerCase()}/`}>
                Official {result.certification} Certification Page
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
                AWS Whitepapers
              </Link>
            </Box>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Container>
  )
}

export default ResultsDisplay