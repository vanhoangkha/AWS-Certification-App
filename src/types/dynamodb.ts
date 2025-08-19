// DynamoDB table schemas and key structures

export interface DynamoDBTableConfig {
  tableName: string
  partitionKey: string
  sortKey?: string
  gsi?: GlobalSecondaryIndex[]
  ttl?: string
}

export interface GlobalSecondaryIndex {
  indexName: string
  partitionKey: string
  sortKey?: string
  projectionType: 'ALL' | 'KEYS_ONLY' | 'INCLUDE'
  projectedAttributes?: string[]
}

// Questions Table Schema
export interface QuestionRecord {
  PK: string // certification#domain (e.g., "SAA-C03#EC2")
  SK: string // Q#questionId
  questionId: string
  certification: string
  domain: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  questionText: string
  questionType: 'MCQ' | 'MRQ'
  options: string // JSON stringified QuestionOption[]
  correctAnswers: string // JSON stringified string[]
  explanation: string
  references: string // JSON stringified Reference[]
  tags: string // JSON stringified string[]
  createdBy: string
  createdAt: string
  updatedAt: string
  GSI1PK?: string // difficulty#createdAt
  GSI2PK?: string // createdBy#createdAt
}

// Users Table Schema
export interface UserRecord {
  PK: string // USER#userId
  userId: string
  email: string
  name: string
  targetCertifications: string // JSON stringified string[]
  preferences: string // JSON stringified UserPreferences
  createdAt: string
  updatedAt: string
  GSI1PK?: string // email (for email lookups)
}

// ExamSessions Table Schema
export interface ExamSessionRecord {
  PK: string // USER#userId
  SK: string // EXAM#sessionId
  sessionId: string
  userId: string
  examType: 'MOCK' | 'PRACTICE' | 'CUSTOM'
  certification: string
  questions: string // JSON stringified Question[]
  answers: string // JSON stringified Record<string, Answer>
  startTime: string
  endTime?: string
  timeLimit: number
  status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED'
  markedForReview: string // JSON stringified string[]
  expiresAt: number // TTL timestamp
  GSI1PK?: string // status#startTime (for active session queries)
}

// Results Table Schema
export interface ResultRecord {
  PK: string // USER#userId
  SK: string // RESULT#completedAt
  resultId: string
  sessionId: string
  userId: string
  scaledScore: number
  passed: boolean
  domainBreakdown: string // JSON stringified DomainScore[]
  totalQuestions: number
  correctAnswers: number
  completedAt: string
  timeSpent: number
  certification: string
  examType: string
  GSI1PK?: string // certification#completedAt (for certification-specific analytics)
}

// ExamTemplates Table Schema
export interface ExamTemplateRecord {
  PK: string // TEMPLATE#certification
  SK: string // templateId
  templateId: string
  certification: string
  name: string
  description: string
  timeLimit: number
  totalQuestions: number
  domainDistribution: string // JSON stringified DomainDistribution[]
  createdBy: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

// Table configurations
export const DYNAMODB_TABLES: Record<string, DynamoDBTableConfig> = {
  Questions: {
    tableName: 'aws-cert-platform-questions',
    partitionKey: 'PK',
    sortKey: 'SK',
    gsi: [
      {
        indexName: 'GSI1',
        partitionKey: 'GSI1PK',
        sortKey: 'createdAt',
        projectionType: 'ALL'
      },
      {
        indexName: 'GSI2',
        partitionKey: 'GSI2PK',
        sortKey: 'createdAt',
        projectionType: 'ALL'
      }
    ]
  },
  Users: {
    tableName: 'aws-cert-platform-users',
    partitionKey: 'PK',
    gsi: [
      {
        indexName: 'GSI1',
        partitionKey: 'GSI1PK',
        projectionType: 'ALL'
      }
    ]
  },
  ExamSessions: {
    tableName: 'aws-cert-platform-exam-sessions',
    partitionKey: 'PK',
    sortKey: 'SK',
    ttl: 'expiresAt',
    gsi: [
      {
        indexName: 'GSI1',
        partitionKey: 'GSI1PK',
        sortKey: 'startTime',
        projectionType: 'ALL'
      }
    ]
  },
  Results: {
    tableName: 'aws-cert-platform-results',
    partitionKey: 'PK',
    sortKey: 'SK',
    gsi: [
      {
        indexName: 'GSI1',
        partitionKey: 'GSI1PK',
        sortKey: 'completedAt',
        projectionType: 'ALL'
      }
    ]
  },
  ExamTemplates: {
    tableName: 'aws-cert-platform-exam-templates',
    partitionKey: 'PK',
    sortKey: 'SK'
  }
}

// Key generation utilities
export const DynamoDBKeys = {
  // Questions table keys
  questionPK: (certification: string, domain: string) => `${certification}#${domain}`,
  questionSK: (questionId: string) => `Q#${questionId}`,
  questionGSI1PK: (difficulty: string, createdAt: string) => `${difficulty}#${createdAt}`,
  questionGSI2PK: (createdBy: string) => `${createdBy}`,

  // Users table keys
  userPK: (userId: string) => `USER#${userId}`,
  userGSI1PK: (email: string) => email,

  // ExamSessions table keys
  examSessionPK: (userId: string) => `USER#${userId}`,
  examSessionSK: (sessionId: string) => `EXAM#${sessionId}`,
  examSessionGSI1PK: (status: string, startTime: string) => `${status}#${startTime}`,

  // Results table keys
  resultPK: (userId: string) => `USER#${userId}`,
  resultSK: (completedAt: string) => `RESULT#${completedAt}`,
  resultGSI1PK: (certification: string, completedAt: string) => `${certification}#${completedAt}`,

  // ExamTemplates table keys
  templatePK: (certification: string) => `TEMPLATE#${certification}`,
  templateSK: (templateId: string) => templateId
}

// Helper functions for data transformation
export const DynamoDBHelpers = {
  // Convert domain objects to DynamoDB records
  questionToRecord: (question: any): QuestionRecord => ({
    PK: DynamoDBKeys.questionPK(question.certification, question.domain),
    SK: DynamoDBKeys.questionSK(question.questionId),
    questionId: question.questionId,
    certification: question.certification,
    domain: question.domain,
    difficulty: question.difficulty,
    questionText: question.questionText,
    questionType: question.questionType,
    options: JSON.stringify(question.options),
    correctAnswers: JSON.stringify(question.correctAnswers),
    explanation: question.explanation,
    references: JSON.stringify(question.references),
    tags: JSON.stringify(question.tags),
    createdBy: question.createdBy,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
    GSI1PK: DynamoDBKeys.questionGSI1PK(question.difficulty, question.createdAt),
    GSI2PK: DynamoDBKeys.questionGSI2PK(question.createdBy)
  }),

  // Convert DynamoDB records to domain objects
  recordToQuestion: (record: QuestionRecord): any => ({
    questionId: record.questionId,
    certification: record.certification,
    domain: record.domain,
    difficulty: record.difficulty,
    questionText: record.questionText,
    questionType: record.questionType,
    options: JSON.parse(record.options),
    correctAnswers: JSON.parse(record.correctAnswers),
    explanation: record.explanation,
    references: JSON.parse(record.references),
    tags: JSON.parse(record.tags),
    createdBy: record.createdBy,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  })
}