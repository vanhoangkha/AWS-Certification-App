// PDF Generator Lambda Function
const AWS = require('aws-sdk');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Environment variables
const RESULTS_TABLE = process.env.RESULTS_TABLE_NAME;
const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE_NAME;
const EXAM_SESSIONS_TABLE = process.env.EXAM_SESSIONS_TABLE_NAME;
const PDF_BUCKET = process.env.PDF_BUCKET_NAME;

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
      case 'generatePDFReport':
        return await generatePDFReport(args.resultId, userId);
      
      default:
        throw new Error(`Unknown field: ${fieldName}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Generate PDF report
const generatePDFReport = async (resultId, userId) => {
  try {
    // Get exam result
    const result = await getExamResult(resultId, userId);
    if (!result) {
      throw new Error('Exam result not found');
    }
    
    // Get exam session details
    const session = await getExamSession(result.sessionId, userId);
    
    // Get questions with answers (for practice mode)
    let questions = [];
    if (result.examType === 'PRACTICE') {
      questions = await getQuestionsWithAnswers(JSON.parse(session.questions));
    }
    
    // Generate PDF
    const pdfBuffer = await createPDFReport(result, session, questions);
    
    // Upload to S3
    const s3Key = `reports/${userId}/${resultId}/${uuidv4()}.pdf`;
    
    await s3.upload({
      Bucket: PDF_BUCKET,
      Key: s3Key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      Metadata: {
        userId,
        resultId,
        certification: result.certification,
        examType: result.examType
      }
    }).promise();
    
    // Generate presigned URL (valid for 1 hour)
    const downloadUrl = s3.getSignedUrl('getObject', {
      Bucket: PDF_BUCKET,
      Key: s3Key,
      Expires: 3600 // 1 hour
    });
    
    return downloadUrl;
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

// Get exam result
const getExamResult = async (resultId, userId) => {
  const scanParams = {
    TableName: RESULTS_TABLE,
    FilterExpression: 'resultId = :resultId AND userId = :userId',
    ExpressionAttributeValues: {
      ':resultId': resultId,
      ':userId': userId
    }
  };
  
  const result = await dynamodb.scan(scanParams).promise();
  return result.Items.length > 0 ? result.Items[0] : null;
};

// Get exam session
const getExamSession = async (sessionId, userId) => {
  const getParams = {
    TableName: EXAM_SESSIONS_TABLE,
    Key: {
      PK: `USER#${userId}`,
      SK: `EXAM#${sessionId}`
    }
  };
  
  const result = await dynamodb.get(getParams).promise();
  return result.Item;
};

// Get questions with answers
const getQuestionsWithAnswers = async (questionIds) => {
  const questions = [];
  
  // Batch get questions
  const batchSize = 100;
  for (let i = 0; i < questionIds.length; i += batchSize) {
    const batch = questionIds.slice(i, i + batchSize);
    
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

// Create PDF report
const createPDFReport = async (result, session, questions) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });
      
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      
      // Header
      addHeader(doc, result);
      
      // Exam Overview
      addExamOverview(doc, result, session);
      
      // Score Breakdown
      addScoreBreakdown(doc, result);
      
      // Domain Analysis
      addDomainAnalysis(doc, result);
      
      // Questions and Answers (for practice mode)
      if (result.examType === 'PRACTICE' && questions.length > 0) {
        addQuestionsAndAnswers(doc, questions, JSON.parse(session.answers));
      }
      
      // Footer
      addFooter(doc);
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

// Add header to PDF
const addHeader = (doc, result) => {
  // Logo placeholder
  doc.fontSize(20)
     .fillColor('#232F3E')
     .text('AWS Certification Practice Platform', 50, 50);
  
  doc.fontSize(16)
     .fillColor('#FF9900')
     .text('Exam Report', 50, 80);
  
  // Certification badge
  doc.fontSize(14)
     .fillColor('#000000')
     .text(`${result.certification} - ${result.examType} Exam`, 50, 110);
  
  // Date
  const examDate = new Date(result.completedAt).toLocaleDateString();
  doc.fontSize(12)
     .fillColor('#666666')
     .text(`Completed on: ${examDate}`, 50, 130);
  
  // Pass/Fail status
  const statusColor = result.passed ? '#00AA00' : '#CC0000';
  const statusText = result.passed ? 'PASSED' : 'FAILED';
  
  doc.fontSize(18)
     .fillColor(statusColor)
     .text(statusText, 400, 110);
  
  // Add line separator
  doc.strokeColor('#CCCCCC')
     .lineWidth(1)
     .moveTo(50, 160)
     .lineTo(545, 160)
     .stroke();
};

// Add exam overview
const addExamOverview = (doc, result, session) => {
  let yPosition = 180;
  
  doc.fontSize(16)
     .fillColor('#000000')
     .text('Exam Overview', 50, yPosition);
  
  yPosition += 30;
  
  const overviewData = [
    ['Scaled Score:', `${result.scaledScore}/1000`],
    ['Raw Score:', `${result.correctAnswers}/${result.totalQuestions}`],
    ['Percentage:', `${Math.round((result.correctAnswers / result.totalQuestions) * 100)}%`],
    ['Time Spent:', `${result.timeSpent} minutes`],
    ['Passing Score:', result.certification.startsWith('CLF') ? '700' : '720']
  ];
  
  overviewData.forEach(([label, value]) => {
    doc.fontSize(12)
       .fillColor('#000000')
       .text(label, 50, yPosition)
       .text(value, 200, yPosition);
    yPosition += 20;
  });
  
  return yPosition + 20;
};

// Add score breakdown
const addScoreBreakdown = (doc, result) => {
  let yPosition = 350;
  
  doc.fontSize(16)
     .fillColor('#000000')
     .text('Score Breakdown', 50, yPosition);
  
  yPosition += 30;
  
  // Score visualization
  const scoreWidth = 400;
  const scoreHeight = 30;
  const scorePercentage = result.scaledScore / 1000;
  const passingPercentage = (result.certification.startsWith('CLF') ? 700 : 720) / 1000;
  
  // Background bar
  doc.rect(50, yPosition, scoreWidth, scoreHeight)
     .fillColor('#F0F0F0')
     .fill();
  
  // Score bar
  doc.rect(50, yPosition, scoreWidth * scorePercentage, scoreHeight)
     .fillColor(result.passed ? '#00AA00' : '#CC0000')
     .fill();
  
  // Passing line
  doc.strokeColor('#000000')
     .lineWidth(2)
     .moveTo(50 + (scoreWidth * passingPercentage), yPosition)
     .lineTo(50 + (scoreWidth * passingPercentage), yPosition + scoreHeight)
     .stroke();
  
  // Labels
  doc.fontSize(10)
     .fillColor('#000000')
     .text('0', 50, yPosition + scoreHeight + 5)
     .text('1000', 50 + scoreWidth - 20, yPosition + scoreHeight + 5)
     .text('Pass', 50 + (scoreWidth * passingPercentage) - 10, yPosition + scoreHeight + 5);
  
  return yPosition + scoreHeight + 30;
};

// Add domain analysis
const addDomainAnalysis = (doc, result) => {
  let yPosition = 450;
  
  doc.fontSize(16)
     .fillColor('#000000')
     .text('Domain Performance', 50, yPosition);
  
  yPosition += 30;
  
  const domainBreakdown = JSON.parse(result.domainBreakdown);
  
  // Table header
  doc.fontSize(12)
     .fillColor('#000000')
     .text('Domain', 50, yPosition)
     .text('Score', 300, yPosition)
     .text('Percentage', 400, yPosition)
     .text('Status', 480, yPosition);
  
  yPosition += 20;
  
  // Add line under header
  doc.strokeColor('#CCCCCC')
     .lineWidth(1)
     .moveTo(50, yPosition)
     .lineTo(545, yPosition)
     .stroke();
  
  yPosition += 10;
  
  domainBreakdown.forEach(domain => {
    const status = domain.percentage >= 70 ? 'Strong' : domain.percentage >= 50 ? 'Fair' : 'Weak';
    const statusColor = domain.percentage >= 70 ? '#00AA00' : domain.percentage >= 50 ? '#FF9900' : '#CC0000';
    
    doc.fontSize(10)
       .fillColor('#000000')
       .text(domain.domain.substring(0, 35), 50, yPosition)
       .text(`${domain.score}`, 300, yPosition)
       .text(`${domain.percentage}%`, 400, yPosition)
       .fillColor(statusColor)
       .text(status, 480, yPosition);
    
    yPosition += 15;
  });
  
  return yPosition + 20;
};

// Add questions and answers (for practice mode)
const addQuestionsAndAnswers = (doc, questions, userAnswers) => {
  doc.addPage();
  
  let yPosition = 50;
  
  doc.fontSize(16)
     .fillColor('#000000')
     .text('Questions and Explanations', 50, yPosition);
  
  yPosition += 30;
  
  questions.forEach((question, index) => {
    // Check if we need a new page
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }
    
    // Question number and text
    doc.fontSize(12)
       .fillColor('#000000')
       .text(`Question ${index + 1}:`, 50, yPosition);
    
    yPosition += 15;
    
    const questionText = wrapText(question.questionText, 80);
    doc.fontSize(10)
       .fillColor('#000000')
       .text(questionText, 50, yPosition);
    
    yPosition += (questionText.split('\n').length * 12) + 10;
    
    // Options
    question.options.forEach((option, optIndex) => {
      const isCorrect = question.correctAnswers.includes(option.id);
      const userSelected = userAnswers[question.questionId]?.selectedOptions?.includes(option.id);
      
      let optionColor = '#000000';
      let prefix = String.fromCharCode(65 + optIndex) + '. ';
      
      if (isCorrect && userSelected) {
        optionColor = '#00AA00'; // Correct and selected
        prefix = '✓ ' + prefix;
      } else if (isCorrect) {
        optionColor = '#00AA00'; // Correct but not selected
        prefix = '→ ' + prefix;
      } else if (userSelected) {
        optionColor = '#CC0000'; // Incorrect but selected
        prefix = '✗ ' + prefix;
      }
      
      doc.fontSize(9)
         .fillColor(optionColor)
         .text(prefix + option.text, 70, yPosition);
      
      yPosition += 12;
    });
    
    yPosition += 5;
    
    // Explanation
    if (question.explanation) {
      doc.fontSize(9)
         .fillColor('#666666')
         .text('Explanation:', 50, yPosition);
      
      yPosition += 12;
      
      const explanationText = wrapText(question.explanation, 85);
      doc.fontSize(8)
         .fillColor('#666666')
         .text(explanationText, 50, yPosition);
      
      yPosition += (explanationText.split('\n').length * 10) + 15;
    }
    
    // Add separator line
    doc.strokeColor('#EEEEEE')
       .lineWidth(1)
       .moveTo(50, yPosition)
       .lineTo(545, yPosition)
       .stroke();
    
    yPosition += 15;
  });
};

// Add footer
const addFooter = (doc) => {
  const pages = doc.bufferedPageRange();
  
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    
    // Footer line
    doc.strokeColor('#CCCCCC')
       .lineWidth(1)
       .moveTo(50, 770)
       .lineTo(545, 770)
       .stroke();
    
    // Footer text
    doc.fontSize(8)
       .fillColor('#666666')
       .text('AWS Certification Practice Platform - Confidential Report', 50, 780)
       .text(`Page ${i + 1} of ${pages.count}`, 450, 780);
    
    // Timestamp
    const timestamp = new Date().toISOString();
    doc.text(`Generated: ${timestamp}`, 50, 790);
  }
};

// Utility functions
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

const wrapText = (text, maxLength) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines.join('\n');
};