// Core data models for AWS Certification Practice Platform

export interface UserProfile {
  userId: string
  email: string
  name: string
  targetCertifications: string[]
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
  autoSave: boolean
  examReminders: boolean
}

export interface Question {
  questionId: string
  certification: string
  domain: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  questionText: string
  questionType: 'MCQ' | 'MRQ'
  options: QuestionOption[]
  correctAnswers: string[]
  explanation: string
  references: Reference[]
  tags: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Reference {
  title: string
  url: string
  type: 'documentation' | 'whitepaper' | 'faq' | 'blog'
}

export interface ExamSession {
  sessionId: string
  userId: string
  examType: 'MOCK' | 'PRACTICE' | 'CUSTOM'
  certification: string
  questions: Question[]
  answers: Record<string, Answer>
  startTime: string
  endTime?: string
  timeLimit: number
  status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED'
  markedForReview: string[]
}

export interface Answer {
  questionId: string
  selectedOptions: string[]
  isCorrect?: boolean
  timeSpent: number
}

export interface ExamResult {
  resultId: string
  sessionId: string
  userId: string
  scaledScore: number
  passed: boolean
  domainBreakdown: DomainScore[]
  totalQuestions: number
  correctAnswers: number
  completedAt: string
  timeSpent: number
}

export interface DomainScore {
  domain: string
  score: number
  totalQuestions: number
  correctAnswers: number
  percentage: number
}

export interface ExamTemplate {
  templateId: string
  certification: string
  name: string
  description: string
  timeLimit: number
  totalQuestions: number
  domainDistribution: DomainDistribution[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface DomainDistribution {
  domain: string
  percentage: number
  minQuestions: number
  maxQuestions: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
    timestamp: string
    requestId: string
  }
}

// Authentication types
export interface AuthResult {
  user: UserProfile
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface UserCredentials {
  email: string
  password: string
}

// Exam types
export interface StartExamInput {
  certification: string
  examType: 'MOCK' | 'PRACTICE' | 'CUSTOM'
  customOptions?: CustomExamOptions
}

export interface CustomExamOptions {
  domains: string[]
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED'
  questionCount: number
}

export interface SaveProgressInput {
  sessionId: string
  answers: Record<string, Answer>
  markedForReview: string[]
}

// Question management types
export interface QuestionInput {
  certification: string
  domain: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  questionText: string
  questionType: 'MCQ' | 'MRQ'
  options: Omit<QuestionOption, 'id'>[]
  explanation: string
  references: Reference[]
  tags: string[]
}

export interface QuestionFilters {
  certification?: string
  domain?: string
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
  tags?: string[]
  createdBy?: string
  limit?: number
  nextToken?: string
}

export interface ImportResult {
  jobId: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  totalQuestions: number
  processedQuestions: number
  errors: ImportError[]
}

export interface ImportError {
  row: number
  field: string
  message: string
}

// Analytics types
export interface ProgressData {
  userId: string
  examAttempts: ExamAttempt[]
  domainProgress: DomainProgress[]
  achievements: Achievement[]
  streaks: Streak[]
}

export interface ExamAttempt {
  sessionId: string
  certification: string
  examType: string
  scaledScore: number
  passed: boolean
  completedAt: string
  timeSpent: number
}

export interface DomainProgress {
  domain: string
  averageScore: number
  totalAttempts: number
  improvement: number
  lastAttempt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: string
  category: 'exam' | 'practice' | 'streak' | 'improvement'
}

export interface Streak {
  type: 'daily' | 'weekly' | 'exam'
  current: number
  longest: number
  lastActivity: string
}

// Constants
export const CERTIFICATIONS = {
  'CLF-C01': 'AWS Certified Cloud Practitioner',
  'SAA-C03': 'AWS Certified Solutions Architect - Associate',
  'DVA-C01': 'AWS Certified Developer - Associate',
  'SOA-C02': 'AWS Certified SysOps Administrator - Associate',
  'SAP-C02': 'AWS Certified Solutions Architect - Professional',
  'DOP-C02': 'AWS Certified DevOps Engineer - Professional',
} as const

export const DOMAINS = {
  'CLF-C01': [
    'Cloud Concepts',
    'Security and Compliance',
    'Technology',
    'Billing and Pricing'
  ],
  'SAA-C03': [
    'Design Secure Architectures',
    'Design Resilient Architectures',
    'Design High-Performing Architectures',
    'Design Cost-Optimized Architectures'
  ],
  // Add other certification domains as needed
} as const

export type CertificationCode = keyof typeof CERTIFICATIONS
export type DomainName = string