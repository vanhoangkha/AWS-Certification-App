// Core Types for AWS Certification Practice Platform

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

export interface QuestionOption {
  id: string
  text: string
  isCorrect?: boolean
}

export interface Reference {
  title: string
  url: string
  type: 'documentation' | 'whitepaper' | 'faq' | 'blog'
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

export interface QuestionInput {
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
}

export interface QuestionFilters {
  certification?: string
  domains?: string[]
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
  tags?: string[]
  limit?: number
  nextToken?: string
  createdBy?: string
}

export interface Answer {
  selectedOptions: string[]
  timestamp: string
}

export interface ExamSession {
  sessionId: string
  userId: string
  examType: 'MOCK' | 'PRACTICE' | 'CUSTOM'
  certification: string
  questions: string[]
  answers: Record<string, Answer>
  startTime: string
  endTime?: string
  timeLimit: number
  status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED'
  markedForReview: string[]
  createdAt: string
  updatedAt: string
}

export interface ExamResult {
  resultId: string
  sessionId: string
  userId: string
  certification: string
  examType: 'MOCK' | 'PRACTICE' | 'CUSTOM'
  scaledScore: number
  passed: boolean
  domainBreakdown: Record<string, any>
  totalQuestions: number
  correctAnswers: number
  completedAt: string
  timeSpent: number
  createdAt: string
  updatedAt: string
}

export interface StartExamInput {
  certification: string
  examType: 'MOCK' | 'PRACTICE' | 'CUSTOM'
  customOptions?: CustomExamOptions
}

export interface SaveProgressInput {
  sessionId: string
  answers: Record<string, Answer>
  markedForReview?: string[]
}

export interface CustomExamOptions {
  domains: string[]
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
  questionCount: number
}

export interface DomainScore {
  domain: string
  score: number
  percentage: number
  totalQuestions: number
  correctAnswers: number
}

export interface ExamTemplate {
  templateId: string
  certification: string
  name: string
  description: string
  timeLimit: number
  totalQuestions: number
  domainDistribution: DomainDistribution[]
  isActive: boolean
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

export interface ImportJob {
  jobId: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  fileName: string
  totalQuestions: number
  processedQuestions: number
  errors: ImportError[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ImportError {
  row: number
  field: string
  message: string
}

export interface UserProgress {
  userId: string
  certification: string
  totalAttempts: number
  bestScore: number
  averageScore: number
  domainProgress: DomainProgress[]
  achievements: Achievement[]
  streaks: StreakData
  lastActivity: string
  updatedAt: string
}

export interface DomainProgress {
  domain: string
  attempts: number
  averageScore: number
  bestScore: number
  trend: ScoreTrend[]
}

export interface ScoreTrend {
  date: string
  score: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  earnedAt: string
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null
}

export interface ProgressData {
  examAttempts: ExamResult[]
  domainProgress: DomainProgress[]
  achievements: Achievement[]
  streaks: StreakData[]
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  items: T[]
  nextToken?: string
  total: number
}

// Exam Configuration Types
export interface ExamConfig {
  certification: string
  totalQuestions: number
  timeLimit: number
  passingScore: number
  domains: ExamDomain[]
}

export interface ExamDomain {
  name: string
  weight: number
  description: string
}

// Analytics Types
export interface UserAnalytics {
  overview: OverviewStats
  performanceTrend: PerformanceTrend[]
  domainAnalysis: DomainAnalysis[]
  recommendations: Recommendation[]
  achievements: Achievement[]
  studyStreak: StreakData
  weakAreas: string[]
  readinessScore: number
}

export interface OverviewStats {
  totalExams: number
  averageScore: number
  bestScore: number
  passRate: number
  improvementRate: number
}

export interface PerformanceTrend {
  date: string
  score: number
  passed: boolean
  certification: string
  examType: string
}

export interface DomainAnalysis {
  domain: string
  attempts: number
  averageScore: number
  bestScore: number
  worstScore: number
  trend: ScoreTrend[]
}

export interface Recommendation {
  type: 'FOCUS_AREA' | 'STRATEGY' | 'RESOURCE' | 'PRACTICE'
  title: string
  description: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  url?: string
}

// Component Props Types
export interface QuestionComponentProps {
  question: Question
  selectedAnswers?: number[]
  onAnswerChange?: (answers: number[]) => void
  showExplanation?: boolean
  disabled?: boolean
}

export interface ExamTimerProps {
  timeLimit: number
  startTime: string
  onTimeUp: () => void
  paused?: boolean
}

export interface ProgressBarProps {
  current: number
  total: number
  variant?: 'default' | 'success' | 'warning' | 'error'
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark'
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

// Notification Types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  read: boolean
}

// Export all types as default export to avoid conflicts