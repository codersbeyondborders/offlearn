# 🚀 Deploying Learning Hub to Google Cloud Run

This guide will help you deploy your Learning Hub application to Google Cloud Run.

## 📋 Prerequisites

1. **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud Project**: Create a new project or use an existing one
3. **gcloud CLI**: Install from [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install)
4. **Docker** (optional): Only needed for local testing

## 🛠️ Setup Instructions

### Step 1: Install and Configure gcloud CLI

```bash
# Install gcloud CLI (if not already installed)
# Follow instructions at: https://cloud.google.com/sdk/docs/install

# Authenticate with Google Cloud
gcloud auth login

# Set your project ID (replace with your actual project ID)
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Enable Required APIs

```bash
# Enable necessary Google Cloud services
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Deploy Using the Script

```bash
# Make the script executable (if not already done)
chmod +x deploy.sh

# Deploy with your project ID
./deploy.sh YOUR_PROJECT_ID
```

### Step 4: Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build and submit to Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Or deploy directly with gcloud run deploy
gcloud run deploy learning-hub \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

## 🔧 Configuration Options

### Environment Variables (Optional)

You can set environment variables in Cloud Run:

```bash
gcloud run services update learning-hub \
  --region us-central1 \
  --set-env-vars="NODE_ENV=production"
```

### Custom Domain (Optional)

To use a custom domain:

1. Go to Cloud Run console
2. Select your service
3. Click "Manage Custom Domains"
4. Follow the instructions to add your domain

### Scaling Configuration

Adjust scaling settings:

```bash
gcloud run services update learning-hub \
  --region us-central1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80
```

## 🌐 Important Notes

### HTTPS Requirement
- The Learning Hub requires HTTPS for AI features to work
- Cloud Run automatically provides HTTPS
- The app will redirect HTTP to HTTPS

### Browser Compatibility
- Requires Chrome Dev/Canary (128+) with AI features enabled
- Users need to join the [Early Preview Program](https://goo.gle/chrome-ai-dev-preview-join)
- AI model must be downloaded in Chrome settings

### Security Headers
- The Nginx configuration includes security headers
- Content Security Policy enforces HTTPS
- CORS is configured for cross-origin requests

## 📊 Monitoring and Logs

### View Logs
```bash
# View recent logs
gcloud run services logs tail learning-hub --region us-central1

# View logs in Cloud Console
# Go to: Cloud Run > learning-hub > Logs
```

### Monitor Performance
- Use Cloud Monitoring for metrics
- Set up alerts for errors or high latency
- Monitor resource usage and costs

## 🔄 Updates and Maintenance

### Deploy Updates
```bash
# Simply run the deploy script again
./deploy.sh YOUR_PROJECT_ID
```

### Rollback if Needed
```bash
# List revisions
gcloud run revisions list --service learning-hub --region us-central1

# Rollback to previous revision
gcloud run services update-traffic learning-hub \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

## 💰 Cost Optimization

### Free Tier
- Cloud Run includes 2 million requests per month free
- 360,000 GB-seconds of memory free
- 180,000 vCPU-seconds free

### Cost Control
```bash
# Set maximum instances to control costs
gcloud run services update learning-hub \
  --region us-central1 \
  --max-instances 5
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Dockerfile syntax
   - Ensure all files are included
   - Check .dockerignore

2. **Service Won't Start**
   - Verify port 8080 is exposed
   - Check Nginx configuration
   - Review logs for errors

3. **AI Features Don't Work**
   - Ensure HTTPS is working
   - Check browser compatibility
   - Verify security headers

### Debug Commands
```bash
# Check service status
gcloud run services describe learning-hub --region us-central1

# View detailed logs
gcloud run services logs read learning-hub --region us-central1 --limit 50

# Test health endpoint
curl https://YOUR_SERVICE_URL/health
```

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify all prerequisites are met
3. Test locally with Docker if possible
4. Check Google Cloud Status page for outages

## 🎉 Success!

Once deployed, your Learning Hub will be available at:
`https://learning-hub-HASH-uc.a.run.app`

The app will work offline once the AI model is loaded in the user's browser!