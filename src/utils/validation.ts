// Data validation schemas and utilities

import { Question, QuestionInput, UserProfile, ExamSession, Answer } from '@/types'

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(`Validation error in ${field}: ${message}`)
    this.name = 'ValidationError'
  }
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// UUID validation
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Question validation
export const validateQuestion = (question: QuestionInput): void => {
  if (!question.questionText || question.questionText.trim().length === 0) {
    throw new ValidationError('questionText', 'Question text is required')
  }

  if (question.questionText.length > 2000) {
    throw new ValidationError('questionText', 'Question text must be less than 2000 characters')
  }

  if (!question.certification || question.certification.trim().length === 0) {
    throw new ValidationError('certification', 'Certification is required')
  }

  if (!question.domain || question.domain.trim().length === 0) {
    throw new ValidationError('domain', 'Domain is required')
  }

  if (!['EASY', 'MEDIUM', 'HARD'].includes(question.difficulty)) {
    throw new ValidationError('difficulty', 'Difficulty must be EASY, MEDIUM, or HARD')
  }

  if (!['MCQ', 'MRQ'].includes(question.questionType)) {
    throw new ValidationError('questionType', 'Question type must be MCQ or MRQ')
  }

  if (!question.options || question.options.length < 2) {
    throw new ValidationError('options', 'At least 2 options are required')
  }

  if (question.options.length > 6) {
    throw new ValidationError('options', 'Maximum 6 options allowed')
  }

  const correctOptions = question.options.filter(opt => opt.isCorrect)
  
  if (question.questionType === 'MCQ' && correctOptions.length !== 1) {
    throw new ValidationError('options', 'MCQ must have exactly 1 correct answer')
  }

  if (question.questionType === 'MRQ' && correctOptions.length < 1) {
    throw new ValidationError('options', 'MRQ must have at least 1 correct answer')
  }

  if (!question.explanation || question.explanation.trim().length === 0) {
    throw new ValidationError('explanation', 'Explanation is required')
  }

  if (question.explanation.length > 3000) {
    throw new ValidationError('explanation', 'Explanation must be less than 3000 characters')
  }

  // Validate references
  if (question.references) {
    question.references.forEach((ref, index) => {
      if (!ref.title || ref.title.trim().length === 0) {
        throw new ValidationError(`references[${index}].title`, 'Reference title is required')
      }
      if (!ref.url || !isValidUrl(ref.url)) {
        throw new ValidationError(`references[${index}].url`, 'Valid reference URL is required')
      }
      if (!['documentation', 'whitepaper', 'faq', 'blog'].includes(ref.type)) {
        throw new ValidationError(`references[${index}].type`, 'Invalid reference type')
      }
    })
  }

  // Validate tags
  if (question.tags) {
    if (question.tags.length > 10) {
      throw new ValidationError('tags', 'Maximum 10 tags allowed')
    }
    question.tags.forEach((tag, index) => {
      if (!tag || tag.trim().length === 0) {
        throw new ValidationError(`tags[${index}]`, 'Tag cannot be empty')
      }
      if (tag.length > 50) {
        throw new ValidationError(`tags[${index}]`, 'Tag must be less than 50 characters')
      }
    })
  }
}

// User profile validation
export const validateUserProfile = (user: Partial<UserProfile>): void => {
  if (user.email && !isValidEmail(user.email)) {
    throw new ValidationError('email', 'Invalid email format')
  }

  if (user.name && (user.name.trim().length === 0 || user.name.length > 100)) {
    throw new ValidationError('name', 'Name must be between 1 and 100 characters')
  }

  if (user.targetCertifications) {
    if (user.targetCertifications.length > 10) {
      throw new ValidationError('targetCertifications', 'Maximum 10 target certifications allowed')
    }
  }
}

// Exam session validation
export const validateExamSession = (session: Partial<ExamSession>): void => {
  if (session.examType && !['MOCK', 'PRACTICE', 'CUSTOM'].includes(session.examType)) {
    throw new ValidationError('examType', 'Invalid exam type')
  }

  if (session.timeLimit && (session.timeLimit < 60 || session.timeLimit > 300)) {
    throw new ValidationError('timeLimit', 'Time limit must be between 60 and 300 minutes')
  }

  if (session.questions && session.questions.length > 100) {
    throw new ValidationError('questions', 'Maximum 100 questions per exam')
  }
}

// Answer validation
export const validateAnswer = (answer: Answer): void => {
  if (!answer.questionId || !isValidUUID(answer.questionId)) {
    throw new ValidationError('questionId', 'Valid question ID is required')
  }

  if (!answer.selectedOptions || answer.selectedOptions.length === 0) {
    throw new ValidationError('selectedOptions', 'At least one option must be selected')
  }

  if (answer.timeSpent < 0) {
    throw new ValidationError('timeSpent', 'Time spent cannot be negative')
  }
}

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Sanitization utilities
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '')
}

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

// Batch validation for imports
export const validateQuestionBatch = (questions: QuestionInput[]): ValidationError[] => {
  const errors: ValidationError[] = []
  
  questions.forEach((question, index) => {
    try {
      validateQuestion(question)
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push(new ValidationError(`row[${index}].${error.field}`, error.message))
      }
    }
  })

  return errors
}

// Certification and domain validation
export const VALID_CERTIFICATIONS = [
  'CLF-C01', 'SAA-C03', 'DVA-C01', 'SOA-C02', 
  'SAP-C02', 'DOP-C02', 'ANS-C01', 'SCS-C01'
]

export const VALID_DOMAINS: Record<string, string[]> = {
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
  'DVA-C01': [
    'Development with AWS Services',
    'Security',
    'Deployment',
    'Troubleshooting and Optimization'
  ]
  // Add more as needed
}

export const isValidCertification = (certification: string): boolean => {
  return VALID_CERTIFICATIONS.includes(certification)
}

export const isValidDomain = (certification: string, domain: string): boolean => {
  const domains = VALID_DOMAINS[certification]
  return domains ? domains.includes(domain) : false
}

export const validateCertificationAndDomain = (certification: string, domain: string): void => {
  if (!isValidCertification(certification)) {
    throw new ValidationError('certification', `Invalid certification: ${certification}`)
  }
  
  if (!isValidDomain(certification, domain)) {
    throw new ValidationError('domain', `Invalid domain for ${certification}: ${domain}`)
  }
}