#!/bin/bash

# AWS Certification Practice Platform - Development Setup Script
echo "🔧 Setting up AWS Certification Practice Platform for development..."

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual AWS configuration"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p amplify/backend/function/questionManagement/src
mkdir -p amplify/backend/function/examEngine/src
mkdir -p amplify/backend/function/scoringEngine/src
mkdir -p amplify/backend/function/analyticsEngine/src
mkdir -p amplify/backend/function/pdfGenerator/src
mkdir -p amplify/backend/api/awscertificationplatform
mkdir -p amplify/backend/auth/awscertificationplatform
mkdir -p amplify/backend/storage/awscertplatformstorage
mkdir -p amplify/backend/storage/awscertplatformdb

# Install Lambda function dependencies
echo "📦 Installing Lambda function dependencies..."
for func in questionManagement examEngine scoringEngine analyticsEngine pdfGenerator; do
    if [ -f "amplify/backend/function/$func/src/package.json" ]; then
        echo "Installing dependencies for $func..."
        cd "amplify/backend/function/$func/src"
        npm install
        cd - > /dev/null
    fi
done

# Build the project to check for errors
echo "🔨 Building project to check for errors..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "🎉 Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your AWS configuration"
echo "2. Run 'amplify init' to initialize your Amplify project"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit http://localhost:3000 to see your application"
echo ""
echo "For deployment, run: npm run deploy"