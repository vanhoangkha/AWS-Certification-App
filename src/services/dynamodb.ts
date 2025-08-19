// DynamoDB service utilities for AWS Certification Platform

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  QueryCommand, 
  UpdateCommand, 
  DeleteCommand,
  BatchWriteCommand,
  BatchGetCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb'
import { 
  QuestionRecord, 
  UserRecord, 
  ExamSessionRecord, 
  ResultRecord,
  DynamoDBKeys,
  DynamoDBHelpers
} from '@/types/dynamodb'
import type { 
  Question, 
  UserProfile, 
  ExamSession, 
  ExamResult,
  QuestionFilters 
} from '@/types'

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
})

const docClient = DynamoDBDocumentClient.from(client)

// Table names (will be set by environment variables)
const TABLES = {
  QUESTIONS: process.env.QUESTIONS_TABLE_NAME || 'awscertificationplatform-questions-dev',
  USERS: process.env.USERS_TABLE_NAME || 'awscertificationplatform-users-dev',
  EXAM_SESSIONS: process.env.EXAM_SESSIONS_TABLE_NAME || 'awscertificationplatform-exam-sessions-dev',
  RESULTS: process.env.RESULTS_TABLE_NAME || 'awscertificationplatform-results-dev',
  ANALYTICS: process.env.ANALYTICS_TABLE_NAME || 'awscertificationplatform-analytics-dev'
}

// Question operations
export class QuestionService {
  static async createQuestion(question: Question): Promise<Question> {
    const record = DynamoDBHelpers.questionToRecord(question)
    
    const command = new PutCommand({
      TableName: TABLES.QUESTIONS,
      Item: record,
      ConditionExpression: 'attribute_not_exists(PK)'
    })

    await docClient.send(command)
    return question
  }

  static async getQuestion(certification: string, domain: string, questionId: string): Promise<Question | null> {
    const command = new GetCommand({
      TableName: TABLES.QUESTIONS,
      Key: {
        PK: DynamoDBKeys.questionPK(certification, domain),
        SK: DynamoDBKeys.questionSK(questionId)
      }
    })

    const result = await docClient.send(command)
    return result.Item ? DynamoDBHelpers.recordToQuestion(result.Item as QuestionRecord) : null
  }

  static async updateQuestion(question: Partial<Question> & { questionId: string }): Promise<Question> {
    const { questionId, certification, domain, ...updates } = question
    
    if (!certification || !domain) {
      throw new Error('Certification and domain are required for updates')
    }

    const updateExpression: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateExpression.push(`#${key} = :${key}`)
        expressionAttributeNames[`#${key}`] = key
        expressionAttributeValues[`:${key}`] = typeof value === 'object' ? JSON.stringify(value) : value
      }
    })

    updateExpression.push('#updatedAt = :updatedAt')
    expressionAttributeNames['#updatedAt'] = 'updatedAt'
    expressionAttributeValues[':updatedAt'] = new Date().toISOString()

    const command = new UpdateCommand({
      TableName: TABLES.QUESTIONS,
      Key: {
        PK: DynamoDBKeys.questionPK(certification, domain),
        SK: DynamoDBKeys.questionSK(questionId)
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    })

    const result = await docClient.send(command)
    return DynamoDBHelpers.recordToQuestion(result.Attributes as QuestionRecord)
  }

  static async deleteQuestion(certification: string, domain: string, questionId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: TABLES.QUESTIONS,
      Key: {
        PK: DynamoDBKeys.questionPK(certification, domain),
        SK: DynamoDBKeys.questionSK(questionId)
      }
    })

    await docClient.send(command)
  }

  static async getQuestionsByFilters(filters: QuestionFilters): Promise<{
    questions: Question[]
    nextToken?: string
    total?: number
  }> {
    let command: QueryCommand | ScanCommand

    if (filters.certification && filters.domain) {
      // Query by certification and domain
      command = new QueryCommand({
        TableName: TABLES.QUESTIONS,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': DynamoDBKeys.questionPK(filters.certification, filters.domain)
        },
        Limit: filters.limit || 50,
        ExclusiveStartKey: filters.nextToken ? JSON.parse(filters.nextToken) : undefined
      })
    } else if (filters.difficulty) {
      // Query by difficulty using GSI1
      command = new QueryCommand({
        TableName: TABLES.QUESTIONS,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :gsi1pk',
        ExpressionAttributeValues: {
          ':gsi1pk': filters.difficulty
        },
        Limit: filters.limit || 50,
        ExclusiveStartKey: filters.nextToken ? JSON.parse(filters.nextToken) : undefined
      })
    } else if (filters.createdBy) {
      // Query by creator using GSI2
      command = new QueryCommand({
        TableName: TABLES.QUESTIONS,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :gsi2pk',
        ExpressionAttributeValues: {
          ':gsi2pk': DynamoDBKeys.questionGSI2PK(filters.createdBy)
        },
        Limit: filters.limit || 50,
        ExclusiveStartKey: filters.nextToken ? JSON.parse(filters.nextToken) : undefined
      })
    } else {
      // Scan all questions (use with caution)
      command = new ScanCommand({
        TableName: TABLES.QUESTIONS,
        Limit: filters.limit || 50,
        ExclusiveStartKey: filters.nextToken ? JSON.parse(filters.nextToken) : undefined
      })
    }

    const result = await docClient.send(command)
    const questions = (result.Items || []).map(item => 
      DynamoDBHelpers.recordToQuestion(item as QuestionRecord)
    )

    return {
      questions,
      nextToken: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : undefined,
      total: result.Count
    }
  }

  static async batchCreateQuestions(questions: Question[]): Promise<{
    successful: Question[]
    failed: { question: Question; error: string }[]
  }> {
    const successful: Question[] = []
    const failed: { question: Question; error: string }[] = []

    // Process in batches of 25 (DynamoDB limit)
    const batchSize = 25
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize)
      
      const writeRequests = batch.map(question => ({
        PutRequest: {
          Item: DynamoDBHelpers.questionToRecord(question)
        }
      }))

      try {
        const command = new BatchWriteCommand({
          RequestItems: {
            [TABLES.QUESTIONS]: writeRequests
          }
        })

        const result = await docClient.send(command)
        
        // Handle unprocessed items
        if (result.UnprocessedItems && result.UnprocessedItems[TABLES.QUESTIONS]) {
          const unprocessedCount = result.UnprocessedItems[TABLES.QUESTIONS].length
          successful.push(...batch.slice(0, batch.length - unprocessedCount))
          
          // Add unprocessed items to failed list
          batch.slice(batch.length - unprocessedCount).forEach(question => {
            failed.push({ question, error: 'Unprocessed by DynamoDB' })
          })
        } else {
          successful.push(...batch)
        }
      } catch (error) {
        batch.forEach(question => {
          failed.push({ question, error: error instanceof Error ? error.message : 'Unknown error' })
        })
      }
    }

    return { successful, failed }
  }
}

// User operations
export class UserService {
  static async createUser(user: UserProfile): Promise<UserProfile> {
    const record: UserRecord = {
      PK: DynamoDBKeys.userPK(user.userId),
      userId: user.userId,
      email: user.email,
      name: user.name,
      targetCertifications: JSON.stringify(user.targetCertifications),
      preferences: JSON.stringify(user.preferences),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      GSI1PK: DynamoDBKeys.userGSI1PK(user.email)
    }

    const command = new PutCommand({
      TableName: TABLES.USERS,
      Item: record,
      ConditionExpression: 'attribute_not_exists(PK)'
    })

    await docClient.send(command)
    return user
  }

  static async getUser(userId: string): Promise<UserProfile | null> {
    const command = new GetCommand({
      TableName: TABLES.USERS,
      Key: {
        PK: DynamoDBKeys.userPK(userId)
      }
    })

    const result = await docClient.send(command)
    if (!result.Item) return null

    const record = result.Item as UserRecord
    return {
      userId: record.userId,
      email: record.email,
      name: record.name,
      targetCertifications: JSON.parse(record.targetCertifications),
      preferences: JSON.parse(record.preferences),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }
  }

  static async getUserByEmail(email: string): Promise<UserProfile | null> {
    const command = new QueryCommand({
      TableName: TABLES.USERS,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    })

    const result = await docClient.send(command)
    if (!result.Items || result.Items.length === 0) return null

    const record = result.Items[0] as UserRecord
    return {
      userId: record.userId,
      email: record.email,
      name: record.name,
      targetCertifications: JSON.parse(record.targetCertifications),
      preferences: JSON.parse(record.preferences),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }
  }
}

// Exam Session operations
export class ExamSessionService {
  static async createExamSession(session: ExamSession): Promise<ExamSession> {
    const record: ExamSessionRecord = {
      PK: DynamoDBKeys.examSessionPK(session.userId),
      SK: DynamoDBKeys.examSessionSK(session.sessionId),
      sessionId: session.sessionId,
      userId: session.userId,
      examType: session.examType,
      certification: session.certification,
      questions: JSON.stringify(session.questions),
      answers: JSON.stringify(session.answers),
      startTime: session.startTime,
      endTime: session.endTime,
      timeLimit: session.timeLimit,
      status: session.status,
      markedForReview: JSON.stringify(session.markedForReview),
      expiresAt: Math.floor(Date.now() / 1000) + (session.timeLimit * 60) + 3600, // TTL: exam time + 1 hour buffer
      GSI1PK: DynamoDBKeys.examSessionGSI1PK(session.status, session.startTime)
    }

    const command = new PutCommand({
      TableName: TABLES.EXAM_SESSIONS,
      Item: record
    })

    await docClient.send(command)
    return session
  }

  static async getExamSession(userId: string, sessionId: string): Promise<ExamSession | null> {
    const command = new GetCommand({
      TableName: TABLES.EXAM_SESSIONS,
      Key: {
        PK: DynamoDBKeys.examSessionPK(userId),
        SK: DynamoDBKeys.examSessionSK(sessionId)
      }
    })

    const result = await docClient.send(command)
    if (!result.Item) return null

    const record = result.Item as ExamSessionRecord
    return {
      sessionId: record.sessionId,
      userId: record.userId,
      examType: record.examType,
      certification: record.certification,
      questions: JSON.parse(record.questions),
      answers: JSON.parse(record.answers),
      startTime: record.startTime,
      endTime: record.endTime,
      timeLimit: record.timeLimit,
      status: record.status,
      markedForReview: JSON.parse(record.markedForReview)
    }
  }

  static async updateExamSession(session: Partial<ExamSession> & { 
    userId: string
    sessionId: string 
  }): Promise<ExamSession> {
    const { userId, sessionId, ...updates } = session

    const updateExpression: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateExpression.push(`#${key} = :${key}`)
        expressionAttributeNames[`#${key}`] = key
        expressionAttributeValues[`:${key}`] = typeof value === 'object' ? JSON.stringify(value) : value
      }
    })

    const command = new UpdateCommand({
      TableName: TABLES.EXAM_SESSIONS,
      Key: {
        PK: DynamoDBKeys.examSessionPK(userId),
        SK: DynamoDBKeys.examSessionSK(sessionId)
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    })

    const result = await docClient.send(command)
    const record = result.Attributes as ExamSessionRecord
    
    return {
      sessionId: record.sessionId,
      userId: record.userId,
      examType: record.examType,
      certification: record.certification,
      questions: JSON.parse(record.questions),
      answers: JSON.parse(record.answers),
      startTime: record.startTime,
      endTime: record.endTime,
      timeLimit: record.timeLimit,
      status: record.status,
      markedForReview: JSON.parse(record.markedForReview)
    }
  }
}

// Result operations
export class ResultService {
  static async createResult(result: ExamResult): Promise<ExamResult> {
    const record: ResultRecord = {
      PK: DynamoDBKeys.resultPK(result.userId),
      SK: DynamoDBKeys.resultSK(result.completedAt),
      resultId: result.resultId,
      sessionId: result.sessionId,
      userId: result.userId,
      scaledScore: result.scaledScore,
      passed: result.passed,
      domainBreakdown: JSON.stringify(result.domainBreakdown),
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      completedAt: result.completedAt,
      timeSpent: result.timeSpent,
      certification: result.certification,
      examType: result.examType,
      GSI1PK: DynamoDBKeys.resultGSI1PK(result.certification, result.completedAt)
    }

    const command = new PutCommand({
      TableName: TABLES.RESULTS,
      Item: record
    })

    await docClient.send(command)
    return result
  }

  static async getResult(userId: string, completedAt: string): Promise<ExamResult | null> {
    const command = new GetCommand({
      TableName: TABLES.RESULTS,
      Key: {
        PK: DynamoDBKeys.resultPK(userId),
        SK: DynamoDBKeys.resultSK(completedAt)
      }
    })

    const result = await docClient.send(command)
    if (!result.Item) return null

    const record = result.Item as ResultRecord
    return {
      resultId: record.resultId,
      sessionId: record.sessionId,
      userId: record.userId,
      scaledScore: record.scaledScore,
      passed: record.passed,
      domainBreakdown: JSON.parse(record.domainBreakdown),
      totalQuestions: record.totalQuestions,
      correctAnswers: record.correctAnswers,
      completedAt: record.completedAt,
      timeSpent: record.timeSpent,
      certification: record.certification,
      examType: record.examType
    }
  }

  static async getUserResults(userId: string, limit = 50): Promise<ExamResult[]> {
    const command = new QueryCommand({
      TableName: TABLES.RESULTS,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': DynamoDBKeys.resultPK(userId)
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit
    })

    const result = await docClient.send(command)
    return (result.Items || []).map(item => {
      const record = item as ResultRecord
      return {
        resultId: record.resultId,
        sessionId: record.sessionId,
        userId: record.userId,
        scaledScore: record.scaledScore,
        passed: record.passed,
        domainBreakdown: JSON.parse(record.domainBreakdown),
        totalQuestions: record.totalQuestions,
        correctAnswers: record.correctAnswers,
        completedAt: record.completedAt,
        timeSpent: record.timeSpent,
        certification: record.certification,
        examType: record.examType
      }
    })
  }
}

export { TABLES }