# AWS Certification Practice Platform

A comprehensive serverless web application that provides an authentic exam simulation environment for AWS certification candidates. The platform mimics the Pearson VUE testing experience while offering both practice and mock exam modes.

## 🏗️ Architecture

- **Frontend**: React 18+ with TypeScript and Cloudscape Design System
- **Backend**: 100% AWS Serverless (Amplify, AppSync, Lambda, DynamoDB)
- **Authentication**: AWS Cognito with MFA support
- **Analytics**: Amazon Pinpoint + QuickSight
- **Monitoring**: CloudWatch, X-Ray, CloudTrail

## 🚀 Features

### For Candidates
- **Mock Exams**: 65 questions, 130-minute timer, Pearson VUE-like interface
- **Practice Mode**: Question-by-question with immediate feedback
- **Custom Exams**: Focus on specific domains and difficulty levels
- **Progress Tracking**: Visual dashboards with charts and analytics
- **Gamification**: Badges, streaks, and leaderboards

### For Administrators
- **Question Bank Management**: CRUD operations with CSV import/export
- **Exam Templates**: Create standardized mock exams
- **User Management**: Role-based access control
- **Analytics Dashboard**: QuickSight integration for insights

## 🛠️ Tech Stack

### Frontend
- React 18+ with TypeScript
- Cloudscape Design System
- React Router for navigation
- React Query for state management
- Vite for build tooling

### Backend
- AWS Amplify (hosting, CI/CD, configuration)
- AWS AppSync (GraphQL API)
- AWS Lambda (business logic)
- Amazon DynamoDB (data storage)
- Amazon S3 (file storage)
- Amazon Cognito (authentication)

### Analytics & Monitoring
- Amazon Pinpoint (user analytics)
- Amazon QuickSight (business intelligence)
- AWS CloudWatch (logging and monitoring)
- AWS X-Ray (distributed tracing)

## 📋 Prerequisites

- Node.js 18+ and npm
- AWS CLI configured
- Amplify CLI installed: `npm install -g @aws-amplify/cli`

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd aws-certification-platform
npm install
```

### 2. Initialize Amplify Project

```bash
amplify init
```

Follow the prompts to configure your Amplify project:
- Project name: `aws-certification-platform`
- Environment: `dev`
- Default editor: Your preferred editor
- App type: `javascript`
- Framework: `react`
- Source directory: `src`
- Build command: `npm run build`
- Start command: `npm run dev`

### 3. Add Authentication

```bash
amplify add auth
```

Configure Cognito:
- Default configuration with username
- Enable MFA (optional)
- Add Google and AWS Builder ID as identity providers

### 4. Add API

```bash
amplify add api
```

Configure AppSync:
- GraphQL API
- API name: `awsCertificationPlatformAPI`
- Authorization: Amazon Cognito User Pool
- Enable additional authorization modes if needed

### 5. Add Storage

```bash
amplify add storage
```

Configure S3:
- Content (Images, audio, video, etc.)
- Bucket name: `aws-cert-platform-storage`
- Access: Auth users only

### 6. Deploy Backend

```bash
amplify push
```

This will:
- Create all AWS resources
- Generate configuration files
- Update your local project

### 7. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── exam/           # Exam interface components
│   ├── admin/          # Admin panel components
│   └── common/         # Shared components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── main.tsx           # Application entry point
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

### Development Environment
```bash
amplify publish
```

### Production Environment
```bash
amplify env add prod
amplify env checkout prod
amplify push
amplify publish
```

## 📊 Data Models

### Core Entities
- **UserProfile**: User information and preferences
- **Question**: Exam questions with metadata
- **ExamSession**: Active exam state
- **ExamResult**: Completed exam results
- **ExamTemplate**: Exam configuration templates

### DynamoDB Tables
- **Questions**: Partitioned by certification#domain
- **Users**: User profiles and preferences
- **ExamSessions**: Active exam sessions with TTL
- **Results**: Historical exam results
- **ExamTemplates**: Exam configuration templates

## 🔒 Security

- **Authentication**: AWS Cognito with MFA
- **Authorization**: Role-based access control
- **API Security**: AWS WAF protection
- **Data Encryption**: At rest (KMS) and in transit (TLS)
- **Audit Logging**: CloudTrail for all actions

## 📈 Monitoring

- **Application Metrics**: Custom CloudWatch metrics
- **User Analytics**: Amazon Pinpoint events
- **Performance**: X-Ray distributed tracing
- **Logs**: Centralized logging with CloudWatch
- **Alerts**: Automated alerting for issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review AWS Amplify documentation

## 🗺️ Roadmap

- [ ] Phase 1: Core exam functionality
- [ ] Phase 2: Advanced analytics and reporting
- [ ] Phase 3: Mobile app support
- [ ] Phase 4: AI-powered question recommendations
- [ ] Phase 5: Multi-language support