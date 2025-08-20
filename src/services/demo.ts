// Demo service for testing without AWS backend
import type { 
  Question, 
  QuestionInput, 
  ExamSession, 
  ExamResult, 
  UserProfile,
  StartExamInput,
  SaveProgressInput,
  QuestionFilters
} from '@/types'
import { sampleQuestions } from '../data/sample-questions'

// Convert sample questions to the expected format
const convertSampleQuestion = (q: any): Question => ({
  questionId: q.id,
  certification: q.certification,
  domain: q.domain,
  difficulty: q.difficulty,
  questionText: q.questionText,
  questionType: q.options.length > 4 ? 'MULTIPLE_SELECT' : 'MULTIPLE_CHOICE',
  options: q.options.map((opt: any) => opt.text || opt),
  correctAnswers: q.options
    .map((opt: any, index: number) => opt.isCorrect ? index : -1)
    .filter((index: number) => index !== -1),
  explanation: q.explanation,
  references: q.references?.map((ref: any) => ref.url || ref) || [],
  tags: q.tags || [],
  createdBy: 'admin',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z'
})

// Enhanced mock data with more comprehensive question bank
const mockQuestions: Question[] = [
  // Convert sample questions
  ...sampleQuestions.map(convertSampleQuestion),
  // Cloud Practitioner Questions
  {
    questionId: '1',
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
    explanation: 'The AWS shared responsibility model divides security responsibilities between AWS and the customer. AWS is responsible for security "of" the cloud (infrastructure, hardware, software, networking, and facilities), while customers are responsible for security "in" the cloud (customer data, platform, applications, identity and access management, operating system, network and firewall configuration).',
    references: ['https://aws.amazon.com/compliance/shared-responsibility-model/'],
    tags: ['security', 'fundamentals', 'responsibility'],
    createdBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    questionId: '2',
    certification: 'CLF-C01',
    domain: 'Cloud Concepts',
    difficulty: 'EASY',
    questionText: 'Which of the following are benefits of cloud computing? (Select TWO)',
    questionType: 'MULTIPLE_SELECT',
    options: [
      'Increased speed and agility',
      'Higher upfront capital expenses',
      'Variable expense instead of capital expense',
      'Decreased security',
      'Limited global reach'
    ],
    correctAnswers: [0, 2],
    explanation: 'Cloud computing provides increased speed and agility by allowing rapid deployment of resources, and converts capital expenses to variable expenses by paying only for what you use.',
    references: ['https://aws.amazon.com/what-is-cloud-computing/'],
    tags: ['benefits', 'fundamentals', 'economics'],
    createdBy: 'admin',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    questionId: '3',
    certification: 'CLF-C01',
    domain: 'Technology',
    difficulty: 'MEDIUM',
    questionText: 'What are the benefits of using Amazon CloudFront?',
    questionType: 'MULTIPLE_SELECT',
    options: [
      'Reduced latency for global users',
      'Improved security with AWS Shield integration',
      'Cost optimization through caching',
      'Automatic database scaling',
      'Built-in load balancing for EC2 instances'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'CloudFront is a CDN that reduces latency by caching content at edge locations, improves security through integration with AWS Shield and WAF, and optimizes costs by reducing origin server load.',
    references: ['https://aws.amazon.com/cloudfront/'],
    tags: ['cdn', 'performance', 'security', 'caching'],
    createdBy: 'admin',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  {
    questionId: '4',
    certification: 'CLF-C01',
    domain: 'Security and Compliance',
    difficulty: 'MEDIUM',
    questionText: 'Which AWS service helps you manage user permissions and access to AWS resources?',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'Amazon CloudWatch',
      'AWS Identity and Access Management (IAM)',
      'Amazon VPC',
      'AWS CloudTrail'
    ],
    correctAnswers: [1],
    explanation: 'AWS IAM enables you to manage access to AWS services and resources securely. You can create and manage AWS users and groups, and use permissions to allow and deny their access to AWS resources.',
    references: ['https://aws.amazon.com/iam/'],
    tags: ['iam', 'security', 'access-control', 'permissions'],
    createdBy: 'admin',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z'
  },
  {
    questionId: '5',
    certification: 'CLF-C01',
    domain: 'Billing and Pricing',
    difficulty: 'EASY',
    questionText: 'Which AWS pricing model allows you to pay only for the compute time you consume?',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'Reserved Instances',
      'Dedicated Hosts',
      'On-Demand Instances',
      'Spot Instances'
    ],
    correctAnswers: [2],
    explanation: 'On-Demand Instances let you pay for compute capacity by the hour or second with no long-term commitments. You only pay for what you use.',
    references: ['https://aws.amazon.com/ec2/pricing/on-demand/'],
    tags: ['pricing', 'on-demand', 'ec2', 'billing'],
    createdBy: 'admin',
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-19T14:20:00Z'
  },
  
  // Solutions Architect Associate Questions
  {
    questionId: '6',
    certification: 'SAA-C03',
    domain: 'Design Secure Architectures',
    difficulty: 'MEDIUM',
    questionText: 'Which AWS service provides DDoS protection for applications running on AWS?',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'AWS WAF',
      'AWS Shield',
      'AWS GuardDuty',
      'AWS Inspector'
    ],
    correctAnswers: [1],
    explanation: 'AWS Shield is a managed DDoS protection service that safeguards applications running on AWS. AWS Shield Standard is automatically included at no extra cost, while Shield Advanced provides additional protections.',
    references: ['https://aws.amazon.com/shield/'],
    tags: ['security', 'ddos', 'protection', 'shield'],
    createdBy: 'admin',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    questionId: '7',
    certification: 'SAA-C03',
    domain: 'Design Resilient Architectures',
    difficulty: 'HARD',
    questionText: 'A company needs to ensure their application can handle the failure of an entire AWS Availability Zone. Which design principles should they implement? (Select TWO)',
    questionType: 'MULTIPLE_SELECT',
    options: [
      'Deploy resources in multiple Availability Zones',
      'Use only one large EC2 instance',
      'Implement auto-scaling groups',
      'Store all data in a single EBS volume',
      'Use only on-premises backup solutions'
    ],
    correctAnswers: [0, 2],
    explanation: 'To handle AZ failures, deploy resources across multiple AZs and use auto-scaling groups to automatically replace failed instances. This ensures high availability and fault tolerance.',
    references: ['https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/'],
    tags: ['high-availability', 'fault-tolerance', 'multi-az', 'auto-scaling'],
    createdBy: 'admin',
    createdAt: '2024-01-20T16:45:00Z',
    updatedAt: '2024-01-20T16:45:00Z'
  },
  {
    questionId: '8',
    certification: 'SAA-C03',
    domain: 'Design High-Performing Architectures',
    difficulty: 'MEDIUM',
    questionText: 'Which Amazon S3 storage class is most cost-effective for data that is accessed infrequently but requires rapid access when needed?',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'S3 Standard',
      'S3 Standard-Infrequent Access (S3 Standard-IA)',
      'S3 Glacier',
      'S3 Glacier Deep Archive'
    ],
    correctAnswers: [1],
    explanation: 'S3 Standard-IA is designed for data that is accessed less frequently but requires rapid access when needed. It offers lower storage costs than S3 Standard with a small retrieval fee.',
    references: ['https://aws.amazon.com/s3/storage-classes/'],
    tags: ['s3', 'storage-classes', 'cost-optimization', 'infrequent-access'],
    createdBy: 'admin',
    createdAt: '2024-01-21T10:15:00Z',
    updatedAt: '2024-01-21T10:15:00Z'
  },
  {
    questionId: '9',
    certification: 'SAA-C03',
    domain: 'Design Cost-Optimized Architectures',
    difficulty: 'HARD',
    questionText: 'A company wants to reduce costs for their batch processing workload that can tolerate interruptions. Which EC2 purchasing option should they use?',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'On-Demand Instances',
      'Reserved Instances',
      'Spot Instances',
      'Dedicated Instances'
    ],
    correctAnswers: [2],
    explanation: 'Spot Instances are ideal for fault-tolerant, flexible workloads that can handle interruptions. They offer up to 90% cost savings compared to On-Demand prices.',
    references: ['https://aws.amazon.com/ec2/spot/'],
    tags: ['spot-instances', 'cost-optimization', 'batch-processing', 'interruption-tolerant'],
    createdBy: 'admin',
    createdAt: '2024-01-22T13:30:00Z',
    updatedAt: '2024-01-22T13:30:00Z'
  },
  
  // Developer Associate Questions
  {
    questionId: '10',
    certification: 'DVA-C01',
    domain: 'Development with AWS Services',
    difficulty: 'MEDIUM',
    questionText: 'Which AWS service should a developer use to store application configuration data that needs to be retrieved at runtime?',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'Amazon S3',
      'AWS Systems Manager Parameter Store',
      'Amazon CloudWatch',
      'AWS Lambda'
    ],
    correctAnswers: [1],
    explanation: 'AWS Systems Manager Parameter Store provides secure, hierarchical storage for configuration data management and secrets management. It integrates with other AWS services and supports encryption.',
    references: ['https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html'],
    tags: ['parameter-store', 'configuration', 'secrets-management', 'systems-manager'],
    createdBy: 'admin',
    createdAt: '2024-01-23T09:00:00Z',
    updatedAt: '2024-01-23T09:00:00Z'
  },
  
  // SysOps Administrator Questions
  {
    questionId: '11',
    certification: 'SOA-C02',
    domain: 'Monitoring and Reporting',
    difficulty: 'MEDIUM',
    questionText: 'Which AWS service provides detailed monitoring and alerting for AWS resources and applications?',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'AWS Config',
      'Amazon CloudWatch',
      'AWS CloudTrail',
      'AWS X-Ray'
    ],
    correctAnswers: [1],
    explanation: 'Amazon CloudWatch is a monitoring and observability service that provides data and actionable insights for AWS resources and applications. It collects metrics, logs, and events.',
    references: ['https://aws.amazon.com/cloudwatch/'],
    tags: ['cloudwatch', 'monitoring', 'metrics', 'alerting'],
    createdBy: 'admin',
    createdAt: '2024-01-24T11:45:00Z',
    updatedAt: '2024-01-24T11:45:00Z'
  },
  
  // Additional questions for better variety
  {
    questionId: '12',
    certification: 'CLF-C01',
    domain: 'Technology',
    difficulty: 'EASY',
    questionText: 'What is Amazon EC2?',
    questionType: 'MULTIPLE_CHOICE',
    options: [
      'A database service',
      'A virtual server in the cloud',
      'A content delivery network',
      'A storage service'
    ],
    correctAnswers: [1],
    explanation: 'Amazon Elastic Compute Cloud (EC2) provides scalable virtual servers in the cloud, allowing you to run applications on AWS infrastructure.',
    references: ['https://aws.amazon.com/ec2/'],
    tags: ['ec2', 'compute', 'virtual-servers', 'basics'],
    createdBy: 'admin',
    createdAt: '2024-01-25T08:30:00Z',
    updatedAt: '2024-01-25T08:30:00Z'
  }
]

let mockExamSessions: ExamSession[] = []
let mockExamResults: ExamResult[] = []
let mockUserProfiles: UserProfile[] = []

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const generateId = () => Math.random().toString(36).substring(2, 9)

// Demo API implementations
export class DemoQuestionAPI {
  static async getQuestion(questionId: string): Promise<Question | null> {
    await delay(300) // Simulate network delay
    return mockQuestions.find(q => q.questionId === questionId) || null
  }

  static async getQuestionsByFilters(filters: QuestionFilters): Promise<{
    questions: Question[]
    nextToken?: string
    total: number
  }> {
    await delay(500)
    
    let filteredQuestions = [...mockQuestions]
    
    if (filters.certification) {
      filteredQuestions = filteredQuestions.filter(q => q.certification === filters.certification)
    }
    
    if (filters.domain) {
      filteredQuestions = filteredQuestions.filter(q => q.domain === filters.domain)
    }
    
    if (filters.difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === filters.difficulty)
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => 
        filters.tags!.some(tag => q.tags.includes(tag))
      )
    }
    
    const limit = filters.limit || 25
    const offset = filters.offset || 0
    
    return {
      questions: filteredQuestions.slice(offset, offset + limit),
      total: filteredQuestions.length,
      nextToken: offset + limit < filteredQuestions.length ? `${offset + limit}` : undefined
    }
  }

  static async getNextPracticeQuestion(
    certification: string,
    domains: string[],
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD',
    excludeQuestions: string[] = []
  ): Promise<Question | null> {
    await delay(200)
    
    let availableQuestions = mockQuestions.filter(q => 
      q.certification === certification &&
      domains.includes(q.domain) &&
      !excludeQuestions.includes(q.questionId)
    )
    
    if (difficulty) {
      availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty)
    }
    
    if (availableQuestions.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    return availableQuestions[randomIndex]
  }

  static async createQuestion(input: QuestionInput): Promise<Question> {
    await delay(400)
    
    const newQuestion: Question = {
      questionId: generateId(),
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockQuestions.push(newQuestion)
    return newQuestion
  }

  static async updateQuestion(input: Partial<Question> & { questionId: string }): Promise<Question> {
    await delay(400)
    
    const index = mockQuestions.findIndex(q => q.questionId === input.questionId)
    if (index === -1) throw new Error('Question not found')
    
    const updatedQuestion = {
      ...mockQuestions[index],
      ...input,
      updatedAt: new Date().toISOString()
    }
    
    mockQuestions[index] = updatedQuestion
    return updatedQuestion
  }

  static async deleteQuestion(questionId: string): Promise<void> {
    await delay(300)
    
    const index = mockQuestions.findIndex(q => q.questionId === questionId)
    if (index === -1) throw new Error('Question not found')
    
    mockQuestions.splice(index, 1)
  }
}

export class DemoExamAPI {
  static async startExam(input: StartExamInput): Promise<ExamSession> {
    await delay(600)
    
    // Get questions for the exam
    const examQuestions = mockQuestions
      .filter(q => q.certification === input.certification)
      .slice(0, input.questionCount || 65)
    
    const session: ExamSession = {
      sessionId: generateId(),
      userId: input.userId,
      examType: input.examType,
      certification: input.certification,
      questions: examQuestions.map(q => q.questionId),
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
    await delay(300)
    
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
    await delay(800)
    
    const session = mockExamSessions.find(s => s.sessionId === sessionId)
    if (!session) throw new Error('Session not found')
    
    // Calculate score
    const questions = mockQuestions.filter(q => session.questions.includes(q.questionId))
    let correctCount = 0
    
    questions.forEach(question => {
      const userAnswer = session.answers[question.questionId]
      if (userAnswer && JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correctAnswers.sort())) {
        correctCount++
      }
    })
    
    const rawScore = (correctCount / questions.length) * 100
    const scaledScore = Math.round(100 + (rawScore - 70) * (900 / 30)) // AWS scaling formula approximation
    const passed = scaledScore >= 700
    
    // Domain breakdown
    const domainBreakdown: Record<string, { correct: number; total: number; percentage: number }> = {}
    
    questions.forEach(question => {
      if (!domainBreakdown[question.domain]) {
        domainBreakdown[question.domain] = { correct: 0, total: 0, percentage: 0 }
      }
      
      domainBreakdown[question.domain].total++
      
      const userAnswer = session.answers[question.questionId]
      if (userAnswer && JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correctAnswers.sort())) {
        domainBreakdown[question.domain].correct++
      }
    })
    
    Object.keys(domainBreakdown).forEach(domain => {
      const breakdown = domainBreakdown[domain]
      breakdown.percentage = Math.round((breakdown.correct / breakdown.total) * 100)
    })
    
    const result: ExamResult = {
      resultId: generateId(),
      sessionId,
      userId: session.userId,
      certification: session.certification,
      examType: session.examType,
      scaledScore,
      passed,
      domainBreakdown,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      completedAt: new Date().toISOString(),
      timeSpent: Math.round((Date.now() - new Date(session.startTime).getTime()) / 1000 / 60),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Update session status
    const sessionIndex = mockExamSessions.findIndex(s => s.sessionId === sessionId)
    if (sessionIndex !== -1) {
      mockExamSessions[sessionIndex].status = 'COMPLETED'
    }
    
    mockExamResults.push(result)
    return result
  }
}

export class DemoResultAPI {
  static async getExamResult(resultId: string): Promise<ExamResult | null> {
    await delay(200)
    return mockExamResults.find(r => r.resultId === resultId) || null
  }

  static async getUserResults(userId: string): Promise<ExamResult[]> {
    await delay(300)
    return mockExamResults.filter(r => r.userId === userId)
  }
}

export class DemoUserAPI {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    await delay(200)
    return mockUserProfiles.find(u => u.userId === userId) || null
  }

  static async createUserProfile(input: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    await delay(400)
    
    const profile: UserProfile = {
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockUserProfiles.push(profile)
    return profile
  }

  static async updateUserProfile(input: Partial<UserProfile> & { userId: string }): Promise<UserProfile> {
    await delay(400)
    
    const index = mockUserProfiles.findIndex(u => u.userId === input.userId)
    if (index === -1) throw new Error('User profile not found')
    
    const updatedProfile = {
      ...mockUserProfiles[index],
      ...input,
      updatedAt: new Date().toISOString()
    }
    
    mockUserProfiles[index] = updatedProfile
    return updatedProfile
  }
}

// Demo mode flag
export const isDemoMode = () => {
  return !window.location.hostname.includes('amazonaws.com') && 
         process.env.NODE_ENV === 'development'
}

// Export demo APIs
export const DemoAPI = {
  Question: DemoQuestionAPI,
  Exam: DemoExamAPI,
  Result: DemoResultAPI,
  User: DemoUserAPI
}