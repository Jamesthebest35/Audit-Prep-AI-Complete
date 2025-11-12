# Deployment Guide - AI Audit Preparedness Co-Pilot

This guide provides comprehensive instructions for deploying the AI Audit Preparedness Co-Pilot application in various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Local Development](#local-development)
4. [Production Build](#production-build)
5. [Docker Deployment](#docker-deployment)
6. [Cloud Deployment](#cloud-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** v20.x or higher
- **npm** v10.x or higher
- **Docker** v24.x or higher (for containerized deployment)
- **Git** (for version control)

### Required API Keys

- **Google Gemini API Key**: Get yours at [Google AI Studio](https://ai.google.dev/)

---

## Environment Configuration

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` and add your configuration:

```env
# Required: Google Gemini API Key
VITE_GEMINI_API_KEY=your_actual_api_key_here

# Application Configuration
VITE_APP_NAME=AI Audit Preparedness Co-Pilot
VITE_APP_VERSION=1.0.0
VITE_ENV=production

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

---

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### 3. Type Checking

```bash
npm run type-check
```

---

## Production Build

### 1. Build for Production

```bash
npm run build:prod
```

This creates an optimized production build in the `dist/` directory.

### 2. Preview Production Build

```bash
npm run preview
```

The production preview will be available at: `http://localhost:4173`

### 3. Build Output

The build process:
- Bundles all JavaScript and CSS
- Optimizes images and assets
- Generates source maps (disabled in production)
- Code splits for better performance
- Minifies and compresses all files

---

## Docker Deployment

### Option 1: Docker Build and Run

#### Build Docker Image

```bash
npm run docker:build
```

Or manually:

```bash
docker build -t audit-prep-ai \
  --build-arg VITE_GEMINI_API_KEY=your_api_key \
  .
```

#### Run Docker Container

```bash
npm run docker:run
```

Or manually:

```bash
docker run -d \
  -p 80:80 \
  -e VITE_GEMINI_API_KEY=your_api_key \
  --name audit-prep-ai \
  audit-prep-ai
```

The application will be available at: `http://localhost`

### Option 2: Docker Compose

#### Start Services

```bash
npm run docker:compose:up
```

Or manually:

```bash
docker-compose up -d
```

#### View Logs

```bash
npm run docker:compose:logs
```

#### Stop Services

```bash
npm run docker:compose:down
```

### Docker Configuration

The Docker setup includes:
- **Multi-stage build** for optimal image size
- **Nginx** for serving static files
- **Health checks** for container monitoring
- **Security headers** configured in nginx
- **Gzip compression** for better performance

---

## Cloud Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build:prod
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

4. Set environment variables in Netlify dashboard:
   - `VITE_GEMINI_API_KEY`

### Deploy to AWS (S3 + CloudFront)

1. Build the project:
```bash
npm run build:prod
```

2. Install AWS CLI and configure credentials:
```bash
aws configure
```

3. Create S3 bucket and upload:
```bash
aws s3 sync dist/ s3://your-bucket-name
```

4. Configure CloudFront distribution to point to your S3 bucket

5. Set environment variables during build process

### Deploy to Google Cloud Platform (Cloud Run)

1. Build and tag the Docker image:
```bash
docker build -t gcr.io/[PROJECT-ID]/audit-prep-ai .
```

2. Push to Google Container Registry:
```bash
docker push gcr.io/[PROJECT-ID]/audit-prep-ai
```

3. Deploy to Cloud Run:
```bash
gcloud run deploy audit-prep-ai \
  --image gcr.io/[PROJECT-ID]/audit-prep-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_GEMINI_API_KEY=your_api_key
```

### Deploy to Azure (Container Instances)

1. Create Azure Container Registry:
```bash
az acr create --resource-group myResourceGroup \
  --name myContainerRegistry --sku Basic
```

2. Build and push image:
```bash
az acr build --registry myContainerRegistry \
  --image audit-prep-ai:v1 .
```

3. Deploy to Container Instance:
```bash
az container create \
  --resource-group myResourceGroup \
  --name audit-prep-ai \
  --image myContainerRegistry.azurecr.io/audit-prep-ai:v1 \
  --dns-name-label audit-prep-ai \
  --ports 80 \
  --environment-variables VITE_GEMINI_API_KEY=your_api_key
```

---

## CI/CD Pipeline

### GitHub Actions

The project includes a comprehensive CI/CD pipeline configured in `.github/workflows/ci-cd.yml`.

#### Pipeline Stages

1. **Build and Test**
   - Type checking with TypeScript
   - Production build
   - Artifact upload

2. **Docker Build**
   - Multi-stage Docker build
   - Push to GitHub Container Registry
   - Image tagging with branch and SHA

3. **Security Scan**
   - npm audit for dependency vulnerabilities
   - Security reports

4. **Deploy Notification**
   - Deployment ready notification
   - Docker pull commands

#### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key

#### Triggering the Pipeline

The pipeline runs automatically on:
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

#### Manual Deployment

To deploy a specific commit:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## Health Checks and Monitoring

### Health Check Endpoint

The application includes a health check endpoint:

```
GET /health
```

Returns: `200 OK` with "healthy" response

### Docker Health Check

The Docker container includes automatic health checks:
- Interval: 30 seconds
- Timeout: 3 seconds
- Retries: 3
- Start period: 5 seconds

### Monitoring Recommendations

1. **Application Monitoring**
   - Use the built-in error logging (stored in sessionStorage)
   - Integrate with services like Sentry or LogRocket

2. **Infrastructure Monitoring**
   - Monitor container health
   - Track resource usage (CPU, memory)
   - Monitor response times

3. **API Usage Monitoring**
   - Track Gemini API calls
   - Monitor API quotas and limits

---

## Troubleshooting

### Issue: Build Fails with "VITE_GEMINI_API_KEY is not defined"

**Solution**: Ensure your `.env.local` file exists and contains a valid API key.

```bash
# Check if file exists
cat .env.local

# If missing, create it
cp .env.example .env.local
# Then add your API key
```

### Issue: Docker Container Fails Health Check

**Solution**: Check container logs for errors.

```bash
docker logs audit-prep-ai
```

Common causes:
- Nginx not starting properly
- Port 80 already in use
- Invalid build artifacts

### Issue: Application Shows Error Boundary

**Solution**: Check browser console for detailed error messages.

In development mode, the error boundary shows:
- Error message
- Component stack trace
- Detailed debugging information

### Issue: Gemini API Calls Failing

**Solution**: Verify your API key and quotas.

1. Check API key validity at [Google AI Studio](https://ai.google.dev/)
2. Verify you haven't exceeded API quotas
3. Check network connectivity
4. Review browser console for detailed error messages

### Issue: White Screen After Deployment

**Solution**: Check these common causes:

1. Missing environment variables
2. Incorrect routing configuration
3. CORS issues
4. Check browser console for errors

### Issue: Docker Image Too Large

**Solution**: The multi-stage build should keep the image small (~50-100MB).

If your image is larger:
1. Check for unnecessary files in the build context
2. Verify `.dockerignore` is properly configured
3. Clean up node_modules before building

### Issue: Tailwind Styles Not Applied

**Solution**: Ensure Tailwind is properly configured.

```bash
# Verify Tailwind packages are installed
npm list tailwindcss postcss autoprefixer

# Rebuild
npm run build
```

---

## Performance Optimization

### Build Optimizations

The application includes:
- Code splitting by vendor (React, Recharts, Google GenAI)
- Tree shaking to remove unused code
- Minification of JavaScript and CSS
- Asset compression

### Runtime Optimizations

- Lazy loading of routes (if implemented)
- React memoization for expensive components
- Efficient state management
- Optimized re-renders

### Nginx Optimizations

The nginx configuration includes:
- Gzip compression
- Browser caching for static assets
- Security headers
- Efficient routing

---

## Security Considerations

### Environment Variables

- Never commit `.env.local` or `.env` files
- Use secrets management for production (AWS Secrets Manager, Azure Key Vault, etc.)
- Rotate API keys regularly

### Content Security Policy

The nginx configuration includes CSP headers to:
- Prevent XSS attacks
- Control resource loading
- Restrict inline scripts (with exceptions for necessary functionality)

### HTTPS

For production deployment:
- Always use HTTPS
- Configure SSL certificates
- Use Let's Encrypt for free certificates
- Enable HSTS headers

### API Key Protection

The Gemini API key is:
- Bundled at build time (not exposed in client code)
- Should be rotated if compromised
- Limited to specific domains in production

---

## Backup and Recovery

### Configuration Backup

Back up these critical files:
- `.env.local` (securely, never in git)
- `docker-compose.yml` (with your modifications)
- Any custom nginx configurations

### Database Backup

Currently, the application uses in-memory state. For production:
- Consider adding a backend for persistent data
- Implement regular backups
- Use managed database services

---

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Review application logs
   - Check for security vulnerabilities: `npm audit`
   - Monitor API usage and costs

2. **Monthly**
   - Update dependencies: `npm update`
   - Review and rotate API keys
   - Check for security patches

3. **Quarterly**
   - Major version updates
   - Performance optimization review
   - Security audit

### Getting Help

- Check application logs in sessionStorage: `logger.getStoredErrors()`
- Review GitHub Issues
- Consult Google Gemini API documentation

---

## Version History

- **v1.0.0** - Initial production release
  - Core features: Dashboard, Findings Tracker, Expert Agent, Audit Simulation, Training Paths
  - Docker support
  - CI/CD pipeline
  - Production-ready configuration

---

## License

This project is proprietary software. All rights reserved.

---

**Last Updated**: 2025-01-12
**Maintained By**: Nodaysoffai Team
