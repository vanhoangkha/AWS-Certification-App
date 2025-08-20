# 🚀 AWS Certification Practice Platform - Deployment Guide

## 📋 Prerequisites

### 1. Install Required Tools
```bash
# Install Node.js (v18 or later)
# Download from: https://nodejs.org/

# Install AWS CLI
# Download from: https://aws.amazon.com/cli/

# Install Amplify CLI
npm install -g @aws-amplify/cli

# Verify installations
node --version
aws --version
amplify --version
```

### 2. Configure AWS Credentials
```bash
# Configure AWS CLI with your credentials
aws configure

# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key  
# - Default region (us-east-1 recommended)
# - Default output format (json)
```

### 3. Clone and Setup Project
```bash
# Clone the repository
git clone <your-repo-url>
cd aws-certification-platform

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

## 🏗️ Deployment Steps

### Step 1: Initialize Amplify Project
```bash
# Initialize Amplify in your project
amplify init

# Follow the prompts:
# - Project name: awscertificationplatform
# - Environment: dev
# - Default editor: Visual Studio Code
# - App type: javascript
# - Framework: react
# - Source directory: src
# - Build command: npm run build
# - Start command: npm run dev
# - Use AWS profile: Yes (select your profile)
```

### Step 2: Add Authentication (Cognito)
```bash
# Add authentication service
amplify add auth

# Configuration options:
# - Default configuration with Social Provider
# - Username: Email
# - Multifactor authentication: Optional
# - MFA types: SMS Text Message, TOTP
# - Email verification: Yes
# - Social providers: Google
# - Domain prefix: awscertificationplatform
```

### Step 3: Add API (AppSync + GraphQL)
```bash
# Add GraphQL API
amplify add api

# Configuration options:
# - GraphQL
# - API name: awscertificationplatform
# - Authorization type: Amazon Cognito User Pool
# - Additional auth types: IAM
# - Conflict resolution: Auto Merge
# - Schema template: Single object with fields
```

### Step 4: Add Storage (S3 + DynamoDB)
```bash
# Add S3 storage
amplify add storage

# Configuration options:
# - Content (Images, audio, video, etc.)
# - Bucket name: awscertificationplatform-storage
# - Access: Auth and guest users
# - Auth users: Create/update, Read, Delete
# - Guest users: Read

# Add DynamoDB storage
amplify add storage

# Configuration options:
# - NoSQL Database
# - Table name: awscertplatformdb
# - Partition key: PK (String)
# - Sort key: SK (String)
# - Global secondary indexes: Yes
# - GSI name: GSI1
# - GSI partition key: GSI1PK (String)
# - GSI sort key: GSI1SK (String)
```

### Step 5: Add Lambda Functions
```bash
# Add Lambda functions one by one
amplify add function

# For each function (questionManagement, examEngine, scoringEngine, analyticsEngine, pdfGenerator):
# - Function name: [functionName]
# - Runtime: NodeJS
# - Function template: Hello World
# - Advanced settings: Yes
# - Access other resources: Yes
# - Select resources: API, Storage
# - Environment variables: Configure as needed
```

### Step 6: Configure GraphQL Schema
```bash
# Copy the GraphQL schema
cp amplify/backend/api/awscertificationplatform/schema.graphql.example amplify/backend/api/awscertificationplatform/schema.graphql

# Edit the schema file to match your requirements
```

### Step 7: Deploy Backend
```bash
# Deploy all backend resources
amplify push

# This will:
# - Create CloudFormation stacks
# - Deploy Cognito User Pool
# - Create AppSync API
# - Deploy Lambda functions
# - Create DynamoDB tables
# - Set up S3 buckets
# - Configure IAM roles and policies

# Wait for deployment to complete (5-15 minutes)
```

### Step 8: Add Hosting
```bash
# Add hosting with Amplify Console
amplify add hosting

# Configuration options:
# - Amplify Console (Managed hosting with fullstack features)
# - Manual deployment: No
```

### Step 9: Publish Application
```bash
# Build and deploy the frontend
amplify publish

# This will:
# - Build the React application
# - Upload to Amplify hosting
# - Configure CloudFront distribution
# - Set up custom domain (if configured)

# Your app will be available at: https://main.d[app-id].amplifyapp.com
```

## 🔧 Post-Deployment Configuration

### 1. Update Environment Variables
```bash
# Get the deployed resource information
amplify status

# Update your .env.local file with actual values:
VITE_API_ENDPOINT=https://[your-api-id].appsync-api.us-east-1.amazonaws.com/graphql
VITE_USER_POOL_ID=us-east-1_[your-pool-id]
VITE_USER_POOL_CLIENT_ID=[your-client-id]
VITE_IDENTITY_POOL_ID=us-east-1:[your-identity-pool-id]
VITE_S3_BUCKET=[your-bucket-name]
```

### 2. Configure Social Login (Google)
```bash
# Go to Google Cloud Console
# Create OAuth 2.0 credentials
# Add authorized redirect URIs:
# - https://awscertificationplatform.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
# - https://[your-app-domain]/

# Update Cognito User Pool with Google credentials
amplify update auth
```

### 3. Set up Custom Domain (Optional)
```bash
# Add custom domain
amplify add hosting

# Follow prompts to:
# - Add custom domain
# - Configure SSL certificate
# - Set up DNS records
```

### 4. Configure CI/CD (Optional)
```bash
# Connect to Git repository
# Go to Amplify Console
# Connect your GitHub/GitLab repository
# Configure build settings
# Enable automatic deployments
```

## 🧪 Testing Deployment

### 1. Verify Backend Services
```bash
# Test API endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"query { listQuestions { items { questionId questionText } } }"}' \
  https://[your-api-id].appsync-api.us-east-1.amazonaws.com/graphql

# Check Lambda functions in AWS Console
# Verify DynamoDB tables are created
# Test S3 bucket access
```

### 2. Test Frontend Application
```bash
# Open your deployed app URL
# Test user registration/login
# Try creating a question (admin)
# Take a practice exam
# Check results and analytics
```

## 🔍 Monitoring and Maintenance

### 1. Set up CloudWatch Monitoring
```bash
# Enable detailed monitoring
# Set up alarms for:
# - API Gateway errors
# - Lambda function errors
# - DynamoDB throttling
# - S3 access errors
```

### 2. Configure Logging
```bash
# Enable CloudTrail for audit logging
# Configure Lambda function logs
# Set up log retention policies
```

### 3. Backup Strategy
```bash
# Enable DynamoDB point-in-time recovery
# Configure S3 versioning
# Set up cross-region replication
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Authentication Errors
```bash
# Check Cognito User Pool configuration
# Verify OAuth redirect URIs
# Check IAM roles and policies
```

#### 2. API Errors
```bash
# Check AppSync schema
# Verify Lambda function permissions
# Check CloudWatch logs
```

#### 3. Build Failures
```bash
# Check Node.js version compatibility
# Verify all dependencies are installed
# Check environment variables
```

#### 4. Deployment Timeouts
```bash
# Check AWS service limits
# Verify IAM permissions
# Monitor CloudFormation stack events
```

### Getting Help
- Check AWS Amplify documentation
- Review CloudWatch logs
- Use AWS Support (if you have a support plan)
- Check GitHub issues and discussions

## 📊 Cost Estimation

### Monthly Costs (Estimated)
- **Cognito**: $0-50 (depending on users)
- **AppSync**: $4-20 (depending on requests)
- **Lambda**: $0-10 (depending on usage)
- **DynamoDB**: $1-25 (depending on data)
- **S3**: $1-10 (depending on storage)
- **CloudFront**: $1-5 (depending on traffic)
- **Total**: ~$10-120/month

### Cost Optimization Tips
- Use DynamoDB on-demand pricing for variable workloads
- Enable S3 Intelligent Tiering
- Set up Lambda provisioned concurrency only for critical functions
- Use CloudFront caching effectively
- Monitor and set up billing alerts

## 🎉 Success!

Your AWS Certification Practice Platform is now deployed and ready for use!

**Next Steps:**
1. Add sample questions to the question bank
2. Create admin users
3. Test all functionality
4. Set up monitoring and alerts
5. Plan for scaling and optimization

**App URL:** https://main.d[your-app-id].amplifyapp.com
**Admin Console:** AWS Amplify Console
**Monitoring:** CloudWatch Dashboard