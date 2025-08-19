// Exam Engine Lambda Function
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const eventbridge = new AWS.EventBridge();

// Environment variables
const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE_NAME;
const EXAM_SESSIONS_TABLE = process.env.EXAM_SESSIONS_TABLE_NAME;
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME;

// Exam templates and configurations
const EXAM_TEMPLATES = {
  'CLF-C01': {
    totalQuestions: 65,
    timeLimit: 90, // minutes
    domains: [
      { name: 'Cloud Concepts', percentage: 26, minQuestions: 16, maxQuestions: 18 },
      { name: 'Security and Compliance', percentage: 25, minQuestions: 15, maxQuestions: 17 },
      { name: 'Technology', percentage: 33, minQuestions: 20, maxQuestions: 23 },
      { name: 'Billing and Pricing', percentage: 16, minQuestions: 10, maxQuestions: 12 }
    ]
  },
  'SAA-C03': {
    totalQuestions: 65,
    timeLimit: 130, // minutes
    domains: [
      { name: 'Design Secure Architectures', percentage: 30, minQuestions: 18, maxQuestions: 21 },
      { name: 'Design Resilient Architectures', percentage: 26, minQuestions: 16, maxQuestions: 18 },
      { name: 'Design High-Performing Architectures', percentage: 24, minQuestions: 14, maxQuestions: 17 },
      { name: 'Design Cost-Optimized Architectures', percentage: 20, minQuestions: 12, maxQuestions: 15 }
    ]
  }
};

// DynamoDB key utilities
const createExamSessionPK = (userId) => `USER#${userId}`;
const createExamSessionSK = (sessionId) => `EXAM#${sessionId}`;
const createGSI1PK = (status, startTime) => `${status}#${startTime}`;

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
      case 'startExam':
        return await startExam(args, userId);
      
      case 'saveExamProgress':
        return await saveExamProgress(args, userId);
      
      default:
        throw new Error(`Unknown field: ${fieldName}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Start a new exam
const startExam = async (args, userId) => {
  const { certification, examType, customOptions } = args.input;
  
  // Validate certification
  if (!EXAM_TEMPLATES[certification] && examType !== 'CUSTOM') {
    throw new Error(`Unsupported certification: ${certification}`);
  }
  
  const sessionId = uuidv4();
  const startTime = new Date().toISOString();
  
  let questions = [];
  let timeLimit = 130; // default
  
  if (examType === 'MOCK') {
    // Generate mock exam based on template
    const template = EXAM_TEMPLATES[certification];
    timeLimit = template.timeLimit;
    questions = await generateMockExam(certification, template);
    
  } else if (examType === 'CUSTOM') {
    // Generate custom exam
    if (!customOptions) {
      throw new Error('Custom options required for custom exam');
    }
    
    questions = await generateCustomExam(certification, customOptions);
    timeLimit = Math.max(60, Math.min(300, customOptions.questionCount * 2)); // 2 minutes per question
    
  } else if (examType === 'PRACTICE') {
    // Practice mode - single question at a time
    timeLimit = 60; // 1 hour for practice session
    questions = []; // Questions will be fetched on-demand
  }
  
  // Create exam session
  const examSession = {
    sessionId,
    userId,
    examType,
    certification,
    questions: examType === 'PRACTICE' ? [] : questions.map(q => q.questionId),
    answers: {},
    startTime,
    timeLimit,
    status: 'IN_PROGRESS',
    markedForReview: []
  };
  
  // Save to DynamoDB
  const dynamoItem = {
    PK: createExamSessionPK(userId),
    SK: createExamSessionSK(sessionId),
    ...examSession,
    questions: JSON.stringify(examSession.questions),
    answers: JSON.stringify(examSession.answers),
    markedForReview: JSON.stringify(examSession.markedForReview),
    expiresAt: Math.floor(Date.now() / 1000) + (timeLimit * 60) + 3600, // TTL: exam time + 1 hour buffer
    GSI1PK: createGSI1PK('IN_PROGRESS', startTime)
  };
  
  await dynamodb.put({
    TableName: EXAM_SESSIONS_TABLE,
    Item: dynamoItem,
    ConditionExpression: 'attribute_not_exists(PK)'
  }).promise();
  
  // Publish exam started event
  await publishEvent('ExamStarted', {
    sessionId,
    userId,
    certification,
    examType,
    startTime
  });
  
  // Return session with questions (excluding correct answers for mock exams)
  return {
    ...examSession,
    questions: examType === 'MOCK' ? 
      questions.map(q => ({
        ...q,
        correctAnswers: undefined, // Hide correct answers in mock mode
        explanation: undefined
      })) : 
      questions
  };
};

// Save exam progress
const saveExamProgress = async (args, userId) => {
  const { sessionId, answers, markedForReview } = args.input;
  
  // Get existing session
  const getResult = await dynamodb.get({
    TableName: EXAM_SESSIONS_TABLE,
    Key: {
      PK: createExamSessionPK(userId),
      SK: createExamSessionSK(sessionId)
    }
  }).promise();
  
  if (!getResult.Item) {
    throw new Error('Exam session not found');
  }
  
  const existingSession = getResult.Item;
  
  // Check if session is still active
  if (existingSession.status !== 'IN_PROGRESS') {
    throw new Error('Exam session is not active');
  }
  
  // Check if session has expired
  const now = Date.now();
  const startTime = new Date(existingSession.startTime).getTime();
  const timeLimit = existingSession.timeLimit * 60 * 1000; // convert to milliseconds
  
  if (now > startTime + timeLimit) {
    // Auto-submit expired exam
    return await autoSubmitExpiredExam(sessionId, userId);
  }
  
  // Update session
  const updateParams = {
    TableName: EXAM_SESSIONS_TABLE,
    Key: {
      PK: createExamSessionPK(userId),
      SK: createExamSessionSK(sessionId)
    },
    UpdateExpression: 'SET answers = :answers, markedForReview = :markedForReview, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':answers': JSON.stringify(answers),
      ':markedForReview': JSON.stringify(markedForReview),
      ':updatedAt': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  };
  
  const updateResult = await dynamodb.update(updateParams).promise();
  const updatedItem = updateResult.Attributes;
  
  // Transform back to exam session format
  return {
    sessionId: updatedItem.sessionId,
    userId: updatedItem.userId,
    examType: updatedItem.examType,
    certification: updatedItem.certification,
    questions: JSON.parse(updatedItem.questions),
    answers: JSON.parse(updatedItem.answers),
    startTime: updatedItem.startTime,
    endTime: updatedItem.endTime,
    timeLimit: updatedItem.timeLimit,
    status: updatedItem.status,
    markedForReview: JSON.parse(updatedItem.markedForReview)
  };
};

// Generate mock exam questions
const generateMockExam = async (certification, template) => {
  const questions = [];
  
  for (const domain of template.domains) {
    const questionCount = Math.floor(template.totalQuestions * domain.percentage / 100);
    
    // Get questions for this domain
    const queryParams = {
      TableName: QUESTIONS_TABLE,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${certification}#${domain.name}`
      }
    };
    
    const result = await dynamodb.query(queryParams).promise();
    const domainQuestions = result.Items;
    
    if (domainQuestions.length < questionCount) {
      console.warn(`Not enough questions for domain ${domain.name}. Need ${questionCount}, have ${domainQuestions.length}`);
    }
    
    // Randomly select questions
    const selectedQuestions = shuffleArray(domainQuestions).slice(0, questionCount);
    questions.push(...selectedQuestions.map(transformDynamoDBToQuestion));
  }
  
  // Shuffle final question order
  return shuffleArray(questions);
};

// Generate custom exam questions
const generateCustomExam = async (certification, customOptions) => {
  const { domains, difficulty, questionCount } = customOptions;
  const questions = [];
  
  for (const domain of domains) {
    const queryParams = {
      TableName: QUESTIONS_TABLE,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${certification}#${domain}`
      }
    };
    
    if (difficulty && difficulty !== 'MIXED') {
      queryParams.FilterExpression = 'difficulty = :difficulty';
      queryParams.ExpressionAttributeValues[':difficulty'] = difficulty;
    }
    
    const result = await dynamodb.query(queryParams).promise();
    questions.push(...result.Items);
  }
  
  // Randomly select requested number of questions
  const selectedQuestions = shuffleArray(questions).slice(0, questionCount);
  return selectedQuestions.map(transformDynamoDBToQuestion);
};

// Auto-submit expired exam
const autoSubmitExpiredExam = async (sessionId, userId) => {
  // Update session status to expired
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
      ':status': 'EXPIRED',
      ':endTime': new Date().toISOString()
    }
  }).promise();
  
  // Publish exam expired event
  await publishEvent('ExamExpired', {
    sessionId,
    userId,
    reason: 'TIME_LIMIT_EXCEEDED'
  });
  
  throw new Error('Exam session has expired and been auto-submitted');
};

// Utility functions
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
    // Don't throw - event publishing is not critical for exam functionality
  }
};