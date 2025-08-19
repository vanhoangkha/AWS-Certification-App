import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ContentLayout,
  Header,
  SpaceBetween,
  Button,
  Alert,
  Box,
  Modal,
  Tabs
} from '@cloudscape-design/components'
import { useExamResult } from '@/hooks/useExams'
import { useAuth } from '@/contexts/AuthContext'
import ResultsDisplay from '@/components/results/ResultsDisplay'
import DetailedResults from '@/components/results/DetailedResults'
import ProgressDashboard from '@/components/results/ProgressDashboard'
import type { Question, Answer } from '@/types'

const ResultsPage: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [showDetailedResults, setShowDetailedResults] = useState(false)
  const [activeTab, setActiveTab] = useState('results')

  const { data: result, isLoading, error } = useExamResult(resultId!)

  // Mock data for questions and answers (in real app, these would come from API)
  const mockQuestions: Question[] = []
  const mockUserAnswers: Record<string, Answer> = {}

  const handleRetakeExam = () => {
    if (result) {
      // Navigate to start a new exam of the same type
      navigate('/dashboard', { 
        state: { 
          startExam: {
            certification: result.certification,
            examType: result.examType
          }
        }
      })
    }
  }

  const handleExportPDF = async () => {
    if (!result) return

    try {
      // In real implementation, this would call the PDF generation API
      console.log('Generating PDF for result:', result.resultId)
      
      // Mock PDF generation
      const pdfContent = generatePDFContent(result)
      downloadPDF(pdfContent, `exam-result-${result.resultId}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    }
  }

  const generatePDFContent = (result: any) => {
    // Mock PDF content generation
    return `
      AWS Certification Practice Platform
      Exam Results Report
      
      Certification: ${result.certification}
      Exam Type: ${result.examType}
      Date: ${new Date(result.completedAt).toLocaleDateString()}
      
      RESULTS:
      Scaled Score: ${result.scaledScore}/1000
      Result: ${result.passed ? 'PASS' : 'FAIL'}
      Questions Correct: ${result.correctAnswers}/${result.totalQuestions}
      Time Spent: ${Math.floor(result.timeSpent / 60)}m ${result.timeSpent % 60}s
      
      DOMAIN BREAKDOWN:
      ${result.domainBreakdown.map((domain: any) => 
        `${domain.domain}: ${domain.correctAnswers}/${domain.totalQuestions} (${domain.percentage}%)`
      ).join('\n')}
    `
  }

  const downloadPDF = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <ContentLayout
        header={
          <Header variant="h1">
            Loading Results...
          </Header>
        }
      >
        <Box>Loading your exam results...</Box>
      </ContentLayout>
    )
  }

  if (error || !result) {
    return (
      <ContentLayout
        header={
          <Header variant="h1">
            Results Not Found
          </Header>
        }
      >
        <Alert type="error" header="Error Loading Results">
          {error?.message || 'The requested exam results could not be found.'}
        </Alert>
      </ContentLayout>
    )
  }

  const tabs = [
    {
      id: 'results',
      label: 'Results',
      content: (
        <ResultsDisplay
          result={result}
          onViewDetailedResults={() => setShowDetailedResults(true)}
          onRetakeExam={handleRetakeExam}
          onExportPDF={handleExportPDF}
        />
      )
    },
    {
      id: 'progress',
      label: 'Progress',
      content: (
        <ProgressDashboard
          userId={user?.userId || ''}
          recentResults={[result]}
        />
      )
    }
  ]

  return (
    <>
      <ContentLayout
        header={
          <Header
            variant="h1"
            description="View your exam results and track your progress"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="normal"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRetakeExam}
                >
                  Take Another Exam
                </Button>
              </SpaceBetween>
            }
          >
            Exam Results
          </Header>
        }
      >
        <Tabs
          activeTabId={activeTab}
          onChange={({ detail }) => setActiveTab(detail.activeTabId)}
          tabs={tabs}
        />
      </ContentLayout>

      {/* Detailed Results Modal */}
      <Modal
        visible={showDetailedResults}
        onDismiss={() => setShowDetailedResults(false)}
        header="Detailed Results"
        size="max"
        footer={null}
      >
        <DetailedResults
          result={result}
          questions={mockQuestions}
          userAnswers={mockUserAnswers}
          onClose={() => setShowDetailedResults(false)}
        />
      </Modal>
    </>
  )
}

export default ResultsPage