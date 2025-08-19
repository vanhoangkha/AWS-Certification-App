// Scoring Engine Lambda Function
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const eventbridge = new AWS.EventBridge();

// Environment variables
const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE_NAME;
const EXAM_SESSIONS_TABLE = process.env.EXAM_SESSIONS_TABLE_NAME;
const RESULTS_TABLE = process.env.RESULTS_TABLE_NAME;
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME;

// Scoring configurations
const SCORING_CONFIG = {
  'CLF-C01': {
    passingScore: 700,
    scalingFactor: 1000,
    domains: [
      'Cloud Concepts',
      'Security and Compliance',
      'Technology',
      'Billing and Pricing'
    ]
  },
  'SAA-C03': {
    passingScore: 720,
    scalingFactor: 1000,
    domains: [
      'Design Secure Architectures',
      'Design Resilient Architectures',
      'Design High-Performing Architectures',
      'Design Cost-Optimized Architectures'
    ]
  }
};

// DynamoDB key utilities
const createExamSessionPK = (userId) => `USER#${userId}`;
const createExamSessionSK = (sessionId) => `EXAM#${sessionId}`;
const createResultPK = (userId) => `USER#${userId}`;
const createResultSK = (completedAt) => `RESULT#${completedAt}`;
const createResultGSI1PK = (certification, completedAt) => `${certification}#${completedAt}`;

// Main handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const { fieldName, arguments: args, identity } = event;
    const userId = identity?.sub || identity?.username;
    
    if (!userId) {
      throw new Error('User authentication required');
    }
    
    switch (fieldName) {
      case 'submitExam':
        return await submitExam(args.sessionId, userId);
      
      default:
        throw new Error(`Unknown field: ${fieldName}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Submit exam for scoring
const submitExam = async (sessionId, userId) => {
  // Get exam session
  const sessionResult = await dynamodb.get({
    TableName: EXAM_SESSIONS_TABLE,
    Key: {
      PK: createExamSessionPK(userId),
      SK: createExamSessionSK(sessionId)
    }
  }).promise();
  
  if (!sessionResult.Item) {
    throw new Error('Exam session not found');
  }
  
  const session = sessionResult.Item;
  
  // Validate session can be submitted
  if (session.status === 'COMPLETED') {
    throw new Error('Exam has already been submitted');
  }
  
  if (session.status === 'EXPIRED') {
    throw new Error('Exam session has expired');
  }
  
  // Get questions with correct answers
  const questions = await getQuestionsWithAnswers(JSON.parse(session.questions));
  const userAnswers = JSON.parse(session.answers);
  
  // Calculate scores
  const scoringResult = calculateScores(questions, userAnswers, session.certification);
  
  // Create exam result
  const completedAt = new Date().toISOString();
  const resultId = uuidv4();
  
  const examResult = {
    resultId,
    sessionId,
    userId,
    certification: session.certification,
    examType: session.examType,
    scaledScore: scoringResult.scaledScore,
    passed: scoringResult.passed,
    domainBreakdown: scoringResult.domainBreakdown,
    totalQuestions: questions.length,
    correctAnswers: scoringResult.correctAnswers,
    completedAt,
    timeSpent: calculateTimeSpent(session.startTime, completedAt)
  };
  
  // Save result to DynamoDB
  const resultItem = {
    PK: createResultPK(userId),
    SK: createResultSK(completedAt),
    ...examResult,
    domainBreakdown: JSON.stringify(examResult.domainBreakdown),
    GSI1PK: createResultGSI1PK(session.certification, completedAt)
  };
  
  await dynamodb.put({
    TableName: RESULTS_TABLE,
    Item: resultItem
  }).promise();
  
  // Update exam session status
  await dynamodb.update({
    TableName: EXAM_SESSIONS_TABLE,
    Key: {
      PK: createExamSessionPK(userId),
      SK: createExamSessionSK(sessionId)
    },
    UpdateExpression: 'SET #status = :status, endTime = :endTime',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':status': 'COMPLETED',
      ':endTime': completedAt
    }
  }).promise();
  
  // Publish exam completed event
  await publishEvent('ExamCompleted', {
    sessionId,
    userId,
    resultId,
    certification: session.certification,
    examType: session.examType,
    scaledScore: scoringResult.scaledScore,
    passed: scoringResult.passed,
    completedAt
  });
  
  return examResult;
};

// Get questions with correct answers
const getQuestionsWithAnswers = async (questionIds) => {
  const questions = [];
  
  // Batch get questions (DynamoDB batch get has 100 item limit)
  const batchSize = 100;
  for (let i = 0; i < questionIds.length; i += batchSize) {
    const batch = questionIds.slice(i, i + batchSize);
    
    // Since we need to query by questionId, we'll scan with filter
    // In production, consider maintaining a GSI for questionId lookups
    const scanParams = {
      TableName: QUESTIONS_TABLE,
      FilterExpression: 'questionId IN (' + batch.map((_, idx) => `:qid${idx}`).join(', ') + ')',
      ExpressionAttributeValues: {}
    };
    
    batch.forEach((qid, idx) => {
      scanParams.ExpressionAttributeValues[`:qid${idx}`] = qid;
    });
    
    const result = await dynamodb.scan(scanParams).promise();
    questions.push(...result.Items.map(transformDynamoDBToQuestion));
  }
  
  return questions;
};

// Calculate exam scores
const calculateScores = (questions, userAnswers, certification) => {
  const config = SCORING_CONFIG[certification];
  if (!config) {
    throw new Error(`Scoring configuration not found for certification: ${certification}`);
  }
  
  let correctAnswers = 0;
  const domainScores = {};
  
  // Initialize domain scores
  config.domains.forEach(domain => {
    domainScores[domain] = {
      domain,
      totalQuestions: 0,
      correctAnswers: 0,
      score: 0,
      percentage: 0
    };
  });
  
  // Score each question
  questions.forEach(question => {
    const userAnswer = userAnswers[question.questionId];
    const domain = question.domain;
    
    // Initialize domain if not exists
    if (!domainScores[domain]) {
      domainScores[domain] = {
        domain,
        totalQuestions: 0,
        correctAnswers: 0,
        score: 0,
        percentage: 0
      };
    }
    
    domainScores[domain].totalQuestions++;
    
    if (userAnswer && userAnswer.selectedOptions) {
      const isCorrect = arraysEqual(
        userAnswer.selectedOptions.sort(),
        question.correctAnswers.sort()
      );
      
      if (isCorrect) {
        correctAnswers++;
        domainScores[domain].correctAnswers++;
      }
    }
  });
  
  // Calculate domain percentages and scores
  Object.values(domainScores).forEach(domain => {
    if (domain.totalQuestions > 0) {
      domain.percentage = Math.round((domain.correctAnswers / domain.totalQuestions) * 100);
      domain.score = Math.round((domain.correctAnswers / domain.totalQuestions) * config.scalingFactor);
    }
  });
  
  // Calculate overall scaled score
  const rawPercentage = questions.length > 0 ? correctAnswers / questions.length : 0;
  const scaledScore = Math.round(rawPercentage * config.scalingFactor);
  const passed = scaledScore >= config.passingScore;
  
  return {
    scaledScore,
    passed,
    correctAnswers,
    domainBreakdown: Object.values(domainScores)
  };
};

// Calculate time spent in minutes
const calculateTimeSpent = (startTime, endTime) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.round((end - start) / (1000 * 60)); // Convert to minutes
};

// Utility functions
const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

const transformDynamoDBToQuestion = (item) => ({
  questionId: item.questionId,
  certification: item.certification,
  domain: item.domain,
  difficulty: item.difficulty,
  questionText: item.questionText,
  questionType: item.questionType,
  options: JSON.parse(item.options),
  correctAnswers: JSON.parse(item.correctAnswers),
  explanation: item.explanation,
  references: JSON.parse(item.references),
  tags: JSON.parse(item.tags),
  createdBy: item.createdBy,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt
});

const publishEvent = async (eventType, detail) => {
  try {
    await eventbridge.putEvents({
      Entries: [{
        Source: 'aws.certification.platform',
        DetailType: eventType,
        Detail: JSON.stringify(detail),
        EventBusName: EVENT_BUS_NAME
      }]
    }).promise();
  } catch (error) {
    console.error('Failed to publish event:', error);
    // Don't throw - event publishing is not critical for scoring functionality
  }
};