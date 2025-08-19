// Question Management Lambda Function
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Environment variables
const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE_NAME;
const IMPORT_BUCKET = process.env.IMPORT_BUCKET_NAME;

// Validation utilities
const validateQuestion = (question) => {
  const errors = [];
  
  if (!question.questionText || question.questionText.trim().length === 0) {
    errors.push('Question text is required');
  }
  
  if (!question.certification || question.certification.trim().length === 0) {
    errors.push('Certification is required');
  }
  
  if (!question.domain || question.domain.trim().length === 0) {
    errors.push('Domain is required');
  }
  
  if (!['EASY', 'MEDIUM', 'HARD'].includes(question.difficulty)) {
    errors.push('Difficulty must be EASY, MEDIUM, or HARD');
  }
  
  if (!['MCQ', 'MRQ'].includes(question.questionType)) {
    errors.push('Question type must be MCQ or MRQ');
  }
  
  if (!question.options || question.options.length < 2) {
    errors.push('At least 2 options are required');
  }
  
  if (question.options && question.options.length > 6) {
    errors.push('Maximum 6 options allowed');
  }
  
  const correctOptions = question.options ? question.options.filter(opt => opt.isCorrect) : [];
  
  if (question.questionType === 'MCQ' && correctOptions.length !== 1) {
    errors.push('MCQ must have exactly 1 correct answer');
  }
  
  if (question.questionType === 'MRQ' && correctOptions.length < 1) {
    errors.push('MRQ must have at least 1 correct answer');
  }
  
  return errors;
};

// DynamoDB key utilities
const createQuestionPK = (certification, domain) => `${certification}#${domain}`;
const createQuestionSK = (questionId) => `Q#${questionId}`;
const createGSI1PK = (difficulty, createdAt) => `${difficulty}#${createdAt}`;
const createGSI2PK = (createdBy) => createdBy;

// Main handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const { fieldName, arguments: args, identity } = event;
    const userId = identity?.sub || identity?.username || 'system';
    
    switch (fieldName) {
      case 'getQuestionsByFilters':
        return await getQuestionsByFilters(args);
      
      case 'getNextPracticeQuestion':
        return await getNextPracticeQuestion(args);
      
      case 'importQuestions':
        return await importQuestions(args, userId);
      
      case 'bulkUpdateQuestions':
        return await bulkUpdateQuestions(args, userId);
      
      default:
        throw new Error(`Unknown field: ${fieldName}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Get questions by filters
const getQuestionsByFilters = async (args) => {
  const { certification, domains, difficulty, limit = 50, nextToken } = args;
  
  let params = {
    TableName: QUESTIONS_TABLE,
    Limit: limit
  };
  
  if (nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(nextToken, 'base64').toString());
  }
  
  // Query strategy based on available filters
  if (certification && domains && domains.length === 1) {
    // Query specific certification and domain
    params.KeyConditionExpression = 'PK = :pk';
    params.ExpressionAttributeValues = {
      ':pk': createQuestionPK(certification, domains[0])
    };
    
    if (difficulty) {
      params.FilterExpression = 'difficulty = :difficulty';
      params.ExpressionAttributeValues[':difficulty'] = difficulty;
    }
  } else if (difficulty) {
    // Query by difficulty using GSI1
    params.IndexName = 'GSI1';
    params.KeyConditionExpression = 'GSI1PK BEGINS_WITH :difficulty';
    params.ExpressionAttributeValues = {
      ':difficulty': difficulty
    };
    
    if (certification) {
      params.FilterExpression = 'certification = :certification';
      params.ExpressionAttributeValues[':certification'] = certification;
    }
  } else {
    // Scan with filters
    const filterExpressions = [];
    const expressionAttributeValues = {};
    
    if (certification) {
      filterExpressions.push('certification = :certification');
      expressionAttributeValues[':certification'] = certification;
    }
    
    if (domains && domains.length > 0) {
      filterExpressions.push('domain IN (' + domains.map((_, i) => `:domain${i}`).join(', ') + ')');
      domains.forEach((domain, i) => {
        expressionAttributeValues[`:domain${i}`] = domain;
      });
    }
    
    if (difficulty) {
      filterExpressions.push('difficulty = :difficulty');
      expressionAttributeValues[':difficulty'] = difficulty;
    }
    
    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
      params.ExpressionAttributeValues = expressionAttributeValues;
    }
  }
  
  const result = await dynamodb.query(params).promise().catch(async (error) => {
    if (error.code === 'ValidationException') {
      // Fallback to scan if query fails
      delete params.KeyConditionExpression;
      delete params.IndexName;
      return await dynamodb.scan(params).promise();
    }
    throw error;
  });
  
  const items = result.Items.map(transformDynamoDBToQuestion);
  
  return {
    items,
    nextToken: result.LastEvaluatedKey ? 
      Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64') : null,
    total: result.Count
  };
};

// Get next practice question
const getNextPracticeQuestion = async (args) => {
  const { certification, domains, difficulty, excludeQuestions = [] } = args;
  
  // Get questions from specified domains
  const allQuestions = [];
  
  for (const domain of domains) {
    const params = {
      TableName: QUESTIONS_TABLE,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': createQuestionPK(certification, domain)
      }
    };
    
    if (difficulty) {
      params.FilterExpression = 'difficulty = :difficulty';
      params.ExpressionAttributeValues[':difficulty'] = difficulty;
    }
    
    const result = await dynamodb.query(params).promise();
    allQuestions.push(...result.Items);
  }
  
  // Filter out excluded questions
  const availableQuestions = allQuestions.filter(q => 
    !excludeQuestions.includes(q.questionId)
  );
  
  if (availableQuestions.length === 0) {
    return null;
  }
  
  // Return random question
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return transformDynamoDBToQuestion(availableQuestions[randomIndex]);
};

// Import questions from CSV
const importQuestions = async (args, userId) => {
  const { s3Key, fileName } = args.input;
  const jobId = uuidv4();
  
  try {
    // Get CSV file from S3
    const s3Object = await s3.getObject({
      Bucket: IMPORT_BUCKET,
      Key: s3Key
    }).promise();
    
    const csvContent = s3Object.Body.toString('utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const questions = [];
    const errors = [];
    
    // Parse CSV rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const question = {};
        
        headers.forEach((header, index) => {
          question[header] = values[index];
        });
        
        // Transform and validate
        const transformedQuestion = {
          questionId: uuidv4(),
          certification: question.certification,
          domain: question.domain,
          difficulty: question.difficulty,
          questionText: question.questionText,
          questionType: question.questionType,
          options: JSON.parse(question.options || '[]'),
          correctAnswers: JSON.parse(question.correctAnswers || '[]'),
          explanation: question.explanation || '',
          references: JSON.parse(question.references || '[]'),
          tags: JSON.parse(question.tags || '[]'),
          createdBy: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const validationErrors = validateQuestion(transformedQuestion);
        if (validationErrors.length > 0) {
          errors.push({
            row: i + 1,
            field: 'validation',
            message: validationErrors.join(', ')
          });
          continue;
        }
        
        questions.push(transformedQuestion);
      } catch (error) {
        errors.push({
          row: i + 1,
          field: 'parsing',
          message: error.message
        });
      }
    }
    
    // Batch write questions to DynamoDB
    let processedQuestions = 0;
    const batchSize = 25;
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const writeRequests = batch.map(question => ({
        PutRequest: {
          Item: transformQuestionToDynamoDB(question)
        }
      }));
      
      try {
        await dynamodb.batchWrite({
          RequestItems: {
            [QUESTIONS_TABLE]: writeRequests
          }
        }).promise();
        
        processedQuestions += batch.length;
      } catch (error) {
        errors.push({
          row: `batch-${Math.floor(i / batchSize) + 1}`,
          field: 'dynamodb',
          message: error.message
        });
      }
    }
    
    return {
      jobId,
      status: errors.length > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
      totalQuestions: questions.length,
      processedQuestions,
      errors
    };
    
  } catch (error) {
    return {
      jobId,
      status: 'FAILED',
      totalQuestions: 0,
      processedQuestions: 0,
      errors: [{
        row: 0,
        field: 'system',
        message: error.message
      }]
    };
  }
};

// Bulk update questions
const bulkUpdateQuestions = async (args, userId) => {
  const { questionIds, updates } = args.input;
  const results = [];
  
  for (const questionId of questionIds) {
    try {
      // First get the question to know its PK
      const scanParams = {
        TableName: QUESTIONS_TABLE,
        FilterExpression: 'questionId = :questionId',
        ExpressionAttributeValues: {
          ':questionId': questionId
        }
      };
      
      const scanResult = await dynamodb.scan(scanParams).promise();
      if (scanResult.Items.length === 0) {
        results.push({
          questionId,
          success: false,
          error: 'Question not found'
        });
        continue;
      }
      
      const existingItem = scanResult.Items[0];
      
      // Build update expression
      const updateExpression = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};
      
      Object.entries(JSON.parse(updates)).forEach(([key, value]) => {
        if (value !== undefined && key !== 'questionId') {
          updateExpression.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = typeof value === 'object' ? JSON.stringify(value) : value;
        }
      });
      
      updateExpression.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();
      
      await dynamodb.update({
        TableName: QUESTIONS_TABLE,
        Key: {
          PK: existingItem.PK,
          SK: existingItem.SK
        },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      }).promise();
      
      results.push({
        questionId,
        success: true
      });
      
    } catch (error) {
      results.push({
        questionId,
        success: false,
        error: error.message
      });
    }
  }
  
  return results.filter(r => r.success).map(r => ({ questionId: r.questionId }));
};

// Transform DynamoDB item to Question
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

// Transform Question to DynamoDB item
const transformQuestionToDynamoDB = (question) => ({
  PK: createQuestionPK(question.certification, question.domain),
  SK: createQuestionSK(question.questionId),
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
  GSI1PK: createGSI1PK(question.difficulty, question.createdAt),
  GSI1SK: question.createdAt,
  GSI2PK: createGSI2PK(question.createdBy)
});