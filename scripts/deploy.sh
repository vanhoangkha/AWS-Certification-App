#!/bin/bash

# AWS Certification Practice Platform Deployment Script
echo "🚀 Starting AWS Certification Practice Platform Deployment..."

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "❌ Amplify CLI is not installed. Installing..."
    npm install -g @aws-amplify/cli
fi

# Check AWS CLI configuration
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Initialize Amplify (if not already initialized)
if [ ! -f "amplify/.config/project-config.json" ]; then
    echo "🔧 Initializing Amplify project..."
    amplify init --yes
else
    echo "✅ Amplify project already initialized"
fi

# Deploy backend
echo "☁️ Deploying backend resources..."
amplify push --yes

# Deploy hosting
echo "🌐 Setting up hosting..."
amplify add hosting

# Publish the application
echo "🚀 Publishing the application..."
amplify publish --yes

echo "✅ Deployment completed successfully!"
echo "🎉 Your AWS Certification Practice Platform is now live!"

# Display the app URL
amplify status