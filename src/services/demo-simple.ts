// Simplified demo service for testing
import type { 
  Question, 
  ExamSession, 
  ExamResult, 
  UserProfile,
  StartExamInput,
  SaveProgressInput,
  QuestionFilters
} from '@/types'

import { sapC02Questions } from '@/data/sap-c02-questions'

// Professional-level mock questions from SAP-C02
const mockQuestions: Question[] = [
  // Cloud Practitioner questions for beginners
  {
    questionId: 'clf-001',
    certification: 'CLF-C01',
    domain: 'Cloud Concepts',
    difficulty: 'EASY',
    questionText: 'What is the AWS shared responsibility model?',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'AWS is responsible for everything',
      'Customer is responsible for everything', 
      'AWS and customer share security responsibilities',
      'Only AWS support handles security'
    ],
    correctAnswers: [2],
    explanation: 'The AWS shared responsibility model divides security responsibilities between AWS and the customer. AWS manages security "of" the cloud (infrastructure, hardware, software, networking, facilities), while customers manage security "in" the cloud (customer data, platform, applications, identity and access management, operating system, network and firewall configuration).',
    references: ['https://aws.amazon.com/compliance/shared-responsibility-model/'],
    tags: ['security', 'fundamentals', 'shared-responsibility'],
    createdBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    questionId: 'clf-002',
    certification: 'CLF-C01',
    domain: 'Technology',
    difficulty: 'MEDIUM',
    questionText: 'A company wants to run a web application with high availability across multiple Availability Zones. Which AWS services should they use? (Select TWO)',
    questionType: 'MULTIPLE_SELECT',
    options: [
      'Amazon EC2 instances in multiple AZs',
      'Application Load Balancer',
      'Amazon S3 for static content',
      'Amazon RDS Single-AZ deployment',
      'AWS Direct Connect'
    ],
    correctAnswers: [0, 1],
    explanation: 'For high availability across multiple AZs, you need EC2 instances distributed across multiple AZs and an Application Load Balancer to distribute traffic between them. S3 is useful but not required for HA. RDS Single-AZ doesn\'t provide HA. Direct Connect is for network connectivity.',
    references: ['https://docs.aws.amazon.com/elasticloadbalancing/latest/application/', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html'],
    tags: ['high-availability', 'load-balancer', 'ec2', 'multi-az'],
    createdBy: 'admin',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  // Include professional-level SAP-C02 questions
  ...sapC02Questions
]

let mockExamSessions: ExamSession[] = []
let mockExamResults: ExamResult[] = []

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const generateId = () => Math.random().toString(36).substr(2, 9)

export class DemoQuestionAPI {
  static async getQuestionsByFilters(filters: QuestionFilters): Promise<{
    questions: Question[]
    nextToken?: string
    total: number
  }> {
    await delay(300)
    return {
      questions: mockQuestions,
      total: mockQuestions.length
    }
  }
}

export class DemoExamAPI {
  static async startExam(input: StartExamInput): Promise<ExamSession> {
    await delay(400)
    
    const session: ExamSession = {
      sessionId: generateId(),
      userId: input.userId,
      examType: input.examType as 'MOCK_EXAM',
      certification: input.certification,
      questions: mockQuestions.map(q => q.questionId),
      answers: {},
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + (input.timeLimit || 130) * 60 * 1000).toISOString(),
      timeLimit: input.timeLimit || 130,
      status: 'IN_PROGRESS',
      markedForReview: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockExamSessions.push(session)
    return session
  }

  static async getExamSession(sessionId: string): Promise<ExamSession | null> {
    await delay(200)
    return mockExamSessions.find(s => s.sessionId === sessionId) || null
  }

  static async saveExamProgress(input: SaveProgressInput): Promise<ExamSession> {
    await delay(200)
    
    const index = mockExamSessions.findIndex(s => s.sessionId === input.sessionId)
    if (index === -1) throw new Error('Session not found')
    
    const updatedSession = {
      ...mockExamSessions[index],
      answers: { ...mockExamSessions[index].answers, ...input.answers },
      markedForReview: input.markedForReview || mockExamSessions[index].markedForReview,
      updatedAt: new Date().toISOString()
    }
    
    mockExamSessions[index] = updatedSession
    return updatedSession
  }

  static async submitExam(sessionId: string): Promise<ExamResult> {
    await delay(500)
    
    const session = mockExamSessions.find(s => s.sessionId === sessionId)
    if (!session) throw new Error('Session not found')
    
    const result: ExamResult = {
      resultId: generateId(),
      sessionId,
      userId: session.userId,
      certification: session.certification,
      examType: session.examType,
      scaledScore: 750,
      passed: true,
      domainBreakdown: {
        'Cloud Concepts': { correct: 8, total: 10, percentage: 80 }
      },
      totalQuestions: 10,
      correctAnswers: 8,
      completedAt: new Date().toISOString(),
      timeSpent: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockExamResults.push(result)
    return result
  }
}

export const isDemoMode = () => true

export const DemoAPI = {
  Question: DemoQuestionAPI,
  Exam: DemoExamAPI
}