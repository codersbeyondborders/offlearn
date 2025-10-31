#!/bin/bash

# Deployment script for Google Cloud Run
# Make sure you have gcloud CLI installed and authenticated

set -e

# Configuration
PROJECT_ID=${1:-"your-project-id"}
SERVICE_NAME="learning-hub"
REGION="us-central1"

echo "🚀 Deploying Learning Hub to Google Cloud Run..."
echo "Project ID: $PROJECT_ID"
echo "Service Name: $SERVICE_NAME"
echo "Region: $REGION"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and deploy using Cloud Build
echo "🏗️ Building and deploying with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml

# Get the service URL
echo "🌐 Getting service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo ""
echo "✅ Deployment completed successfully!"
echo "🌍 Your Learning Hub is available at: $SERVICE_URL"
echo ""
echo "📝 Next steps:"
echo "1. Visit the URL above to access your app"
echo "2. Make sure you're using Chrome Dev/Canary with AI features enabled"
echo "3. The app requires HTTPS for AI features (Cloud Run provides this automatically)"
echo ""