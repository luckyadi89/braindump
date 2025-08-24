# Environment Management Guide

## 🌍 **Environment Overview**

BrainDump uses three environments to ensure reliable deployments:

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| **Development** | `develop` | `dev-braindump.vercel.app` | Feature development & testing |
| **Beta** | `staging` | `beta-braindump.vercel.app` | User acceptance testing |
| **Production** | `master` | `braindump.com` | Live application |

## 🚀 **Deployment Workflow**

```
Feature Branch → develop → staging → master
     ↓             ↓         ↓         ↓
   Local Dev    Auto Deploy Beta   Manual Deploy
                             ↓         ↓
                        User Testing Production
```

## 🔧 **Setup Instructions**

### 1. **Create Supabase Projects**
- **Dev**: Create new Supabase project for development
- **Beta**: Create new Supabase project for staging  
- **Prod**: Create new Supabase project for production

### 2. **Configure Environment Variables**
Update the `.env.*` files with your actual values:

```bash
# Copy development environment
npm run env:copy-dev

# Copy beta environment  
npm run env:copy-beta

# Copy production environment
npm run env:copy-prod
```

### 3. **Set GitHub Secrets**
Add these secrets to your GitHub repository:

- `VERCEL_TOKEN` - Your Vercel deployment token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Development project ID
- `VERCEL_PROJECT_ID_BETA` - Beta project ID  
- `VERCEL_PROJECT_ID_PROD` - Production project ID
- `SLACK_WEBHOOK` - (Optional) Slack notifications

## 📋 **Development Commands**

```bash
# Local development
npm run dev                    # Development mode
npm run dev:beta              # Test beta configuration locally
npm run dev:prod              # Test production configuration locally

# Building
npm run build                 # Build for current environment
npm run build:beta           # Build for beta environment
npm run build:prod           # Build for production environment

# Testing
npm run test                  # Run tests
npm run test:full            # Full test suite
npm run type-check           # TypeScript validation
```

## 🔄 **Git Workflow**

### **Feature Development**
```bash
git checkout develop
git checkout -b feature/your-feature-name
# Make changes
git push origin feature/your-feature-name
# Create PR to develop
```

### **Beta Release**
```bash
git checkout staging
git merge develop
git push origin staging  # Auto-deploys to beta
```

### **Production Release** 
```bash
git checkout master
git merge staging
git push origin master  # Deploys to production (with approval)
```

## 🔒 **Environment Security**

- **Development**: Uses test API keys, relaxed CORS
- **Beta**: Uses test payments, production-like security
- **Production**: Live API keys, strict security, monitoring

## 📊 **Monitoring & Alerts**

- **Development**: Console logging only
- **Beta**: Basic error tracking 
- **Production**: Full monitoring, alerts, analytics

## 🛟 **Troubleshooting**

### Common Issues:
1. **Build fails**: Check environment variables are set
2. **API errors**: Verify Supabase project URLs match environment
3. **Payment issues**: Ensure Stripe keys match environment (test vs live)

### Emergency Rollback:
```bash
# Quickly rollback production
git checkout master
git reset --hard HEAD~1  # Go back one commit
git push --force-with-lease origin master
```
