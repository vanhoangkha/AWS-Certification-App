import React, { useState, useRef } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Button,
  Alert,
  ProgressBar,
  Modal,
  Table,
  Badge,
  FileUpload,
  FormField,
  Textarea,
  Link
} from '@cloudscape-design/components'
import { useMutation } from '@tanstack/react-query'
import type { ImportResult, ImportError } from '@/types'

interface QuestionImportProps {
  onImportComplete?: (result: ImportResult) => void
}

const QuestionImport: React.FC<QuestionImportProps> = ({ onImportComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [csvPreview, setCsvPreview] = useState<string[][]>([])
  const [showErrorModal, setShowErrorModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      // In a real implementation, this would upload to S3 and trigger the import Lambda
      const formData = new FormData()
      formData.append('file', file)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock result
      const mockResult: ImportResult = {
        jobId: 'job-' + Date.now(),
        status: 'COMPLETED',
        totalQuestions: 50,
        processedQuestions: 48,
        errors: [
          {
            row: 15,
            field: 'questionText',
            message: 'Question text is required'
          },
          {
            row: 32,
            field: 'options',
            message: 'At least 2 options are required'
          }
        ]
      }
      
      return mockResult
    },
    onSuccess: (result) => {
      setImportResult(result)
      onImportComplete?.(result)
    }
  })

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      
      // Preview CSV content
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split('\n').slice(0, 10) // Preview first 10 lines
        const preview = lines.map(line => line.split(','))
        setCsvPreview(preview)
      }
      reader.readAsText(file)
    }
  }

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile)
    }
  }

  const downloadTemplate = () => {
    const template = `certification,domain,difficulty,questionText,questionType,options,correctAnswers,explanation,references,tags
SAA-C03,Design Secure Architectures,MEDIUM,"Which AWS service provides network isolation for your resources?",MCQ,"[{""text"":""Amazon VPC"",""isCorrect"":true},{""text"":""Amazon EC2"",""isCorrect"":false},{""text"":""Amazon S3"",""isCorrect"":false},{""text"":""Amazon RDS"",""isCorrect"":false}]","[""Amazon VPC""]","Amazon VPC provides network isolation by allowing you to create a private network within AWS.","[{""title"":""Amazon VPC User Guide"",""url"":""https://docs.aws.amazon.com/vpc/"",""type"":""documentation""}]","[""networking"",""security"",""vpc""]"`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'question-import-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    const colorMap = {
      PENDING: 'grey',
      IN_PROGRESS: 'blue',
      COMPLETED: 'green',
      COMPLETED_WITH_ERRORS: 'orange',
      FAILED: 'red'
    }
    return (
      <Badge color={colorMap[status as keyof typeof colorMap] || 'grey'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const errorColumns = [
    {
      id: 'row',
      header: 'Row',
      cell: (item: ImportError) => item.row,
      sortingField: 'row'
    },
    {
      id: 'field',
      header: 'Field',
      cell: (item: ImportError) => item.field,
      sortingField: 'field'
    },
    {
      id: 'message',
      header: 'Error Message',
      cell: (item: ImportError) => item.message,
      sortingField: 'message'
    }
  ]

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Import questions from CSV file"
          actions={
            <Button variant="link" iconName="download" onClick={downloadTemplate}>
              Download Template
            </Button>
          }
        >
          Import Questions
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Instructions */}
        <Alert type="info" header="Import Instructions">
          <SpaceBetween direction="vertical" size="s">
            <Box>
              1. Download the CSV template to see the required format
            </Box>
            <Box>
              2. Fill in your questions following the template structure
            </Box>
            <Box>
              3. Upload your CSV file and review the preview
            </Box>
            <Box>
              4. Click Import to process your questions
            </Box>
          </SpaceBetween>
        </Alert>

        {/* File Upload */}
        <FormField label="CSV File" constraintText="Select a CSV file containing questions">
          <FileUpload
            onChange={({ detail }) => handleFileSelect(detail.value)}
            value={selectedFile ? [selectedFile] : []}
            i18nStrings={{
              uploadButtonText: e => e ? "Choose files" : "Choose file",
              dropzoneText: e => e ? "Drop files to upload" : "Drop file to upload",
              removeFileAriaLabel: e => `Remove file ${e + 1}`,
              limitShowFewer: "Show fewer files",
              limitShowMore: "Show more files",
              errorIconAriaLabel: "Error"
            }}
            showFileLastModified
            showFileSize
            showFileThumbnail
            tokenLimit={1}
            accept=".csv"
          />
        </FormField>

        {/* CSV Preview */}
        {selectedFile && csvPreview.length > 0 && (
          <Container header={<Header variant="h3">CSV Preview (First 10 rows)</Header>}>
            <Box>
              <Textarea
                value={csvPreview.map(row => row.join(',')).join('\n')}
                readOnly
                rows={10}
              />
            </Box>
          </Container>
        )}

        {/* Import Button */}
        {selectedFile && (
          <Box>
            <Button
              variant="primary"
              loading={importMutation.isPending}
              onClick={handleImport}
              disabled={!selectedFile}
            >
              Import Questions
            </Button>
          </Box>
        )}

        {/* Import Progress */}
        {importMutation.isPending && (
          <Container header={<Header variant="h3">Import Progress</Header>}>
            <SpaceBetween direction="vertical" size="s">
              <ProgressBar
                value={50}
                additionalInfo="Processing questions..."
                description="Validating and importing questions from CSV file"
              />
              <Box variant="small">
                This may take a few minutes depending on the number of questions.
              </Box>
            </SpaceBetween>
          </Container>
        )}

        {/* Import Results */}
        {importResult && (
          <Container
            header={
              <Header
                variant="h3"
                actions={
                  importResult.errors.length > 0 && (
                    <Button
                      variant="normal"
                      onClick={() => setShowErrorModal(true)}
                    >
                      View Errors ({importResult.errors.length})
                    </Button>
                  )
                }
              >
                Import Results
              </Header>
            }
          >
            <SpaceBetween direction="vertical" size="m">
              <Box>
                <SpaceBetween direction="horizontal" size="s">
                  <Box>Status:</Box>
                  {getStatusBadge(importResult.status)}
                </SpaceBetween>
              </Box>
              
              <Box>
                <strong>Total Questions:</strong> {importResult.totalQuestions}
              </Box>
              
              <Box>
                <strong>Successfully Processed:</strong> {importResult.processedQuestions}
              </Box>
              
              {importResult.errors.length > 0 && (
                <Box>
                  <strong>Errors:</strong> {importResult.errors.length}
                </Box>
              )}

              {importResult.status === 'COMPLETED' && importResult.errors.length === 0 && (
                <Alert type="success" header="Import Completed Successfully">
                  All {importResult.processedQuestions} questions have been imported successfully.
                </Alert>
              )}

              {importResult.status === 'COMPLETED_WITH_ERRORS' && (
                <Alert type="warning" header="Import Completed with Errors">
                  {importResult.processedQuestions} questions were imported successfully, 
                  but {importResult.errors.length} questions had errors and were skipped.
                </Alert>
              )}

              {importResult.status === 'FAILED' && (
                <Alert type="error" header="Import Failed">
                  The import process failed. Please check your CSV file format and try again.
                </Alert>
              )}
            </SpaceBetween>
          </Container>
        )}

        {/* Error Details Modal */}
        <Modal
          visible={showErrorModal}
          onDismiss={() => setShowErrorModal(false)}
          header="Import Errors"
          size="large"
          footer={
            <Box float="right">
              <Button variant="primary" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
            </Box>
          }
        >
          {importResult && (
            <Table
              columnDefinitions={errorColumns}
              items={importResult.errors}
              loadingText="Loading errors..."
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No errors found</b>
                </Box>
              }
              header={
                <Header
                  counter={`(${importResult.errors.length})`}
                  description="Review and fix these errors in your CSV file"
                >
                  Import Errors
                </Header>
              }
            />
          )}
        </Modal>

        {/* CSV Format Help */}
        <Container header={<Header variant="h3">CSV Format Requirements</Header>}>
          <SpaceBetween direction="vertical" size="s">
            <Box>
              <strong>Required Columns:</strong>
            </Box>
            <Box variant="small">
              • certification: AWS certification code (e.g., SAA-C03, CLF-C01)
            </Box>
            <Box variant="small">
              • domain: Certification domain name
            </Box>
            <Box variant="small">
              • difficulty: EASY, MEDIUM, or HARD
            </Box>
            <Box variant="small">
              • questionText: The question text
            </Box>
            <Box variant="small">
              • questionType: MCQ (single answer) or MRQ (multiple answers)
            </Box>
            <Box variant="small">
              • options: JSON array of option objects with text and isCorrect fields
            </Box>
            <Box variant="small">
              • correctAnswers: JSON array of correct answer texts
            </Box>
            <Box variant="small">
              • explanation: Explanation of the correct answer
            </Box>
            <Box variant="small">
              • references: JSON array of reference objects (optional)
            </Box>
            <Box variant="small">
              • tags: JSON array of tag strings (optional)
            </Box>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Container>
  )
}

export default QuestionImport