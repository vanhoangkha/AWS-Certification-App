# AWS Certification Practice Platform - Development Setup Script (PowerShell)
Write-Host "🔧 Setting up AWS Certification Practice Platform for development..." -ForegroundColor Green

# Check Node.js version
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18 or later." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "⚠️  Please update .env.local with your actual AWS configuration" -ForegroundColor Yellow
}

# Create necessary directories
Write-Host "📁 Creating necessary directories..." -ForegroundColor Yellow
$directories = @(
    "amplify/backend/function/questionManagement/src",
    "amplify/backend/function/examEngine/src",
    "amplify/backend/function/scoringEngine/src",
    "amplify/backend/function/analyticsEngine/src",
    "amplify/backend/function/pdfGenerator/src",
    "amplify/backend/api/awscertificationplatform",
    "amplify/backend/auth/awscertificationplatform",
    "amplify/backend/storage/awscertplatformstorage",
    "amplify/backend/storage/awscertplatformdb"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Install Lambda function dependencies
Write-Host "📦 Installing Lambda function dependencies..." -ForegroundColor Yellow
$functions = @("questionManagement", "examEngine", "scoringEngine", "analyticsEngine", "pdfGenerator")

foreach ($func in $functions) {
    $packagePath = "amplify/backend/function/$func/src/package.json"
    if (Test-Path $packagePath) {
        Write-Host "Installing dependencies for $func..." -ForegroundColor Cyan
        Push-Location "amplify/backend/function/$func/src"
        npm install
        Pop-Location
    }
}

# Build the project to check for errors
Write-Host "🔨 Building project to check for errors..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your AWS configuration" -ForegroundColor White
Write-Host "2. Run 'amplify init' to initialize your Amplify project" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "4. Visit http://localhost:3000 to see your application" -ForegroundColor White
Write-Host ""
Write-Host "For deployment, run: npm run deploy" -ForegroundColor Yellow