# AWS Certification Practice Platform Deployment Script (PowerShell)
Write-Host "🚀 Starting AWS Certification Practice Platform Deployment..." -ForegroundColor Green

# Check if Amplify CLI is installed
try {
    amplify --version | Out-Null
    Write-Host "✅ Amplify CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Amplify CLI is not installed. Installing..." -ForegroundColor Red
    npm install -g @aws-amplify/cli
}

# Check AWS CLI configuration
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build

# Check if Amplify is initialized
if (!(Test-Path "amplify\.config\project-config.json")) {
    Write-Host "🔧 Initializing Amplify project..." -ForegroundColor Yellow
    amplify init --yes
} else {
    Write-Host "✅ Amplify project already initialized" -ForegroundColor Green
}

# Deploy backend
Write-Host "☁️ Deploying backend resources..." -ForegroundColor Yellow
amplify push --yes

# Deploy hosting
Write-Host "🌐 Setting up hosting..." -ForegroundColor Yellow
amplify add hosting

# Publish the application
Write-Host "🚀 Publishing the application..." -ForegroundColor Yellow
amplify publish --yes

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🎉 Your AWS Certification Practice Platform is now live!" -ForegroundColor Cyan

# Display the app URL
amplify status