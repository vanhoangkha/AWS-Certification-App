# AWS Certification Platform - PowerShell Deployment Script
# This script automates the deployment process for Windows

Write-Host "🚀 Starting AWS Certification Platform Deployment..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if Amplify CLI is installed
try {
    amplify --version | Out-Null
    Write-Host "✅ Amplify CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Amplify CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g @aws-amplify/cli" -ForegroundColor Yellow
    exit 1
}

# Check if AWS CLI is configured
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS CLI configured" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not configured or credentials invalid" -ForegroundColor Red
    Write-Host "Please run: aws configure" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Build frontend
Write-Host "📦 Building frontend application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend build successful" -ForegroundColor Green

# Deploy backend
Write-Host "🔧 Deploying backend infrastructure..." -ForegroundColor Cyan
amplify push --yes

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend deployment successful" -ForegroundColor Green

# Deploy frontend
Write-Host "🌐 Deploying frontend to Amplify Hosting..." -ForegroundColor Cyan
amplify publish --yes

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend deployment successful" -ForegroundColor Green

# Get deployment info
Write-Host "📊 Deployment Information:" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
amplify status

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your AWS Certification Platform is now live!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure custom domain (optional)" -ForegroundColor White
Write-Host "2. Import sample questions" -ForegroundColor White
Write-Host "3. Create admin users" -ForegroundColor White
Write-Host "4. Set up monitoring alerts" -ForegroundColor White
Write-Host ""
Write-Host "For support, check the documentation in the docs/ folder" -ForegroundColor White