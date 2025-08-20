# 🚀 Manual Deployment Guide - AWS Amplify Console

## Vì session token có thể hết hạn, chúng ta sẽ deploy thông qua AWS Console

### **Bước 1: Tạo Git Repository**

1. **Push code lên GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - AWS Certification Practice Platform"
git branch -M main
git remote add origin https://github.com/[your-username]/aws-certification-platform.git
git push -u origin main
```

### **Bước 2: Deploy qua AWS Amplify Console**

1. **Truy cập AWS Amplify Console:**
   - Đăng nhập vào AWS Console: https://console.aws.amazon.com/
   - Tìm "Amplify" trong services
   - Click "Create new app"

2. **Connect Repository:**
   - Chọn "GitHub" 
   - Authorize AWS Amplify
   - Chọn repository: `aws-certification-platform`
   - Chọn branch: `main`

3. **Configure Build Settings:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

4. **Environment Variables:**
```
VITE_DEMO_MODE=false
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=true
```

### **Bước 3: Add Backend Services**

1. **Authentication (Cognito):**
   - Trong Amplify Console, click "Authentication"
   - Click "Set up authentication"
   - Configure:
     - Login with: Email
     - MFA: Optional
     - Social providers: Google

2. **API (AppSync):**
   - Click "API" 
   - Choose "GraphQL"
   - Upload schema từ file: `amplify/backend/api/awscertificationplatform/schema.graphql`

3. **Storage:**
   - Click "Storage"
   - Add S3 bucket for file storage
   - Add DynamoDB table for data

### **Bước 4: Deploy Lambda Functions**

1. **Tạo Lambda functions manually:**
   - Truy cập Lambda Console
   - Tạo 5 functions:
     - `questionManagement`
     - `examEngine` 
     - `scoringEngine`
     - `analyticsEngine`
     - `pdfGenerator`

2. **Upload code:**
   - Zip nội dung từ `amplify/backend/function/[function-name]/src/`
   - Upload lên Lambda function

### **Bước 5: Configure Permissions**

1. **IAM Roles:**
   - Tạo execution roles cho Lambda functions
   - Grant permissions:
     - DynamoDB: Read/Write
     - S3: Read/Write
     - AppSync: Invoke

2. **API Permissions:**
   - Configure AppSync resolvers
   - Link Lambda functions to GraphQL operations

### **Bước 6: Test Deployment**

1. **Frontend Test:**
   - Truy cập Amplify app URL
   - Test user registration/login
   - Verify sample questions load

2. **Backend Test:**
   - Test API endpoints
   - Verify Lambda functions execute
   - Check DynamoDB data

## 🎯 Expected Results

After manual deployment:
- ✅ **App URL**: `https://main.d[app-id].amplifyapp.com`
- ✅ **Authentication**: Working with Cognito
- ✅ **Sample Questions**: 10 questions available
- ✅ **Exam Simulation**: Timer and navigation working
- ✅ **Results**: Score calculation and display

## 📞 Alternative: Use AWS CDK

If manual deployment is complex, we can also use AWS CDK:

```bash
npm install -g aws-cdk
cdk init app --language typescript
# Add our infrastructure as code
cdk deploy
```

Would you like me to create the CDK version instead?