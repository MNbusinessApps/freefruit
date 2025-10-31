# Project Free Fruit - Deployment Guide

This guide covers deploying Project Free Fruit to production environments including cloud platforms and app stores.

## Deployment Overview

Project Free Fruit consists of three components:
1. **Backend API** - Express.js server with PostgreSQL and Redis
2. **Web Application** - React app with Vite bundler
3. **Mobile Application** - React Native app for iOS/Android

## Backend Deployment

### Option 1: Render (Recommended for beginners)

#### Prerequisites
- Render account (free tier available)
- GitHub repository with your code

#### Steps
1. **Connect GitHub Repository**
   - Go to [render.com](https://render.com)
   - Click "New +" and select "Blueprint"
   - Connect your GitHub repository

2. **Create PostgreSQL Database**
   - In Render dashboard, click "New +" → "Database"
   - Select "PostgreSQL"
   - Choose free tier or paid plan
   - Note the connection string

3. **Create Redis Instance**
   - Click "New +" → "Database"
   - Select "Redis"
   - Choose appropriate tier
   - Note the connection details

4. **Deploy Backend API**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure build settings:
     ```
     Build Command: cd backend && npm install && npm run build
     Start Command: cd backend && npm start
     ```
   - Add environment variables:
     ```
     NODE_ENV=production
     DB_HOST=your_postgres_host
     DB_PORT=5432
     DB_NAME=your_db_name
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     REDIS_HOST=your_redis_host
     REDIS_PORT=6379
     PORT=10000
     SPORTSDATA_API_KEY=your_api_key
     FRONTEND_URL=https://your-frontend-url.render.app
     ```
   - Click "Create Web Service"

#### Database Migration
1. Connect to your PostgreSQL database using the connection string
2. Run migrations manually or add a migration script to your deployment

### Option 2: AWS (Advanced)

#### Prerequisites
- AWS account
- AWS CLI configured
- Domain name (optional)

#### Services Used
- **EC2** - Virtual server for backend
- **RDS** - Managed PostgreSQL
- **ElastiCache** - Managed Redis
- **Route 53** - DNS (optional)
- **ACM** - SSL certificates (optional)

#### Steps
1. **Create RDS PostgreSQL**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier free-fruit-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password YourSecurePassword123 \
     --allocated-storage 20 \
     --db-name free_fruit
   ```

2. **Create ElastiCache Redis**
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id free-fruit-redis \
     --cache-node-type cache.t3.micro \
     --engine redis \
     --num-cache-nodes 1
   ```

3. **Launch EC2 Instance**
   - Choose Ubuntu Server LTS
   - t3.micro instance type (free tier eligible)
   - Configure security groups for ports 22 (SSH) and 3000 (API)
   - Generate key pair for SSH access

4. **Deploy Application**
   ```bash
   # SSH into EC2 instance
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Install Node.js and dependencies
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Clone repository
   git clone https://github.com/your-username/free-fruit.git
   cd free-fruit/backend
   
   # Install dependencies and start
   npm install
   npm run build
   npm start
   ```

5. **Configure Environment Variables**
   Create `.env` file with production values and use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "free-fruit-api"
   pm2 startup
   pm2 save
   ```

### Option 3: DigitalOcean

#### Steps
1. **Create Droplet**
   - Choose Ubuntu 22.04 LTS
   - Basic plan ($5/month)
   - Add SSH keys

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql redis-server nginx
   ```

3. **Configure PostgreSQL and Redis**
   - Follow setup instructions in SETUP.md

4. **Deploy Application**
   - Clone repository and follow backend setup steps
   - Configure PM2 for process management
   - Set up Nginx reverse proxy

## Web Application Deployment

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps
1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import from GitHub

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables** (if needed)
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be available at `https://your-app.vercel.app`

### Option 2: Netlify

#### Steps
1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import from Git"

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy site"

### Option 3: GitHub Pages

#### Steps
1. **Build for Static Hosting**
   ```bash
   cd web
   npm run build
   ```

2. **Configure GitHub Actions**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
             cache-dependency-path: web/package-lock.json
         
         - name: Install dependencies
           run: cd web && npm install
         
         - name: Build
           run: cd web && npm run build
         
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: web/dist
   ```

## Mobile Application Deployment

### Prerequisites
- Apple Developer Account ($99/year) for iOS
- Google Play Console ($25 one-time) for Android
- Expo account

### Deploy with Expo EAS

#### Setup EAS CLI
```bash
npm install -g @expo/cli eas-cli
eas login
```

#### Configure EAS Build

Create `eas.json` in project root:
```json
{
  "cli": {
    "version": ">= 2.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Build for Development
```bash
# Start development build
eas build --platform android --profile development
eas build --platform ios --profile development
```

#### Build for Production

**Android:**
1. **Generate Signing Key**
   ```bash
   keytool -genkey -v -keystore upload-keystore.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Build**
   ```bash
   eas build --platform android --profile production
   ```

3. **Submit to Google Play**
   ```bash
   eas submit --platform android
   ```

**iOS:**
1. **Configure Apple Developer Account**
   - Sign in to EAS CLI with Apple ID
   - EAS will handle certificates and provisioning profiles

2. **Build for iOS**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

### Manual Deployment (Advanced)

#### Android
1. **Generate Release APK**
   ```bash
   cd mobile
   npm run build:android
   ```

2. **Sign APK**
   ```bash
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore upload-keystore.keystore app-release.apk upload
   ```

3. **Optimize APK**
   ```bash
   zipalign -v 4 app-release.apk free-fruit.apk
   ```

4. **Upload to Google Play Console**

#### iOS
1. **Archive in Xcode**
   ```bash
   cd ios
   xcodebuild -workspace FreeFruit.xcworkspace -scheme FreeFruit archive -archivePath FreeFruit.xcarchive
   ```

2. **Upload to App Store Connect**
   - Use Xcode Organizer or Application Loader

## Database Hosting Options

### PostgreSQL Hosting

#### 1. **Render PostgreSQL**
- Free tier: 90 days
- Paid: $7/month for basic plan
- Automatic backups included

#### 2. **AWS RDS**
- Free tier: 12 months (db.t3.micro)
- Paid: Starts at $15/month
- High availability options

#### 3. **DigitalOcean Managed Databases**
- $15/month for basic plan
- Includes automated backups

#### 4. **Supabase**
- Free tier: 500MB database
- Paid: $25/month for 8GB database
- Includes REST API and real-time features

### Redis Hosting

#### 1. **Render Redis**
- Free tier: 30 days
- Paid: $7/month

#### 2. **AWS ElastiCache**
- Free tier: 750 hours (cache.t3.micro)
- Paid: $15/month

#### 3. **Redis Labs (Now Redis Cloud)**
- Free tier: 30MB
- Paid: $7/month

#### 4. **DigitalOcean Managed Redis**
- $15/month for basic plan

## Environment Configuration

### Production Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=free_fruit
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
REDIS_HOST=your_redis_host
REDIS_PORT=6379
SPORTSDATA_API_KEY=your_production_api_key
PORT=10000
FRONTEND_URL=https://your-frontend-domain.com
```

#### Web (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

#### Mobile (environment configuration)
```javascript
const ENV = {
  production: {
    API_BASE_URL: 'https://your-backend-domain.com/api',
  }
};
```

## SSL/HTTPS Setup

### Backend (Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend (Vercel/Netlify)
- Automatic HTTPS with Let's Encrypt certificates

## Monitoring and Logging

### Backend Monitoring
1. **Application Logs**
   - Use Winston or similar logging library
   - Aggregate logs to services like LogDNA or Datadog

2. **Health Checks**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({ 
       status: 'healthy', 
       timestamp: new Date(),
       uptime: process.uptime()
     });
   });
   ```

3. **Performance Monitoring**
   - New Relic
   - DataDog
   - Sentry for error tracking

### Database Monitoring
1. **Connection Pool Monitoring**
2. **Query Performance Analysis**
3. **Backup Verification**

## Backup Strategy

### Database Backups
1. **Automated Daily Backups**
   - Most cloud providers offer automatic backups
   - Verify backup retention policies

2. **Point-in-Time Recovery**
   - Enable for production databases
   - Test recovery procedures regularly

3. **Cross-Region Backups**
   - Store backups in multiple regions
   - Implement disaster recovery plan

### Application Backups
1. **Code Repository**
   - GitHub/GitLab as primary backup
   - Multiple developers with access

2. **Environment Variables**
   - Document all production configurations
   - Store securely in password managers

## Security Checklist

### Backend Security
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Implement request validation
- [ ] Regular security updates
- [ ] Database connection encryption

### Frontend Security
- [ ] Enable Content Security Policy (CSP)
- [ ] Use HTTPS for all requests
- [ ] Validate user inputs
- [ ] Implement proper error handling
- [ ] Secure cookie settings

### Mobile Security
- [ ] Use secure storage for sensitive data
- [ ] Enable certificate pinning
- [ ] Implement proper authentication
- [ ] Secure API communication
- [ ] Code obfuscation for production builds

## Performance Optimization

### Backend Optimization
1. **Database Optimization**
   - Index frequently queried columns
   - Implement connection pooling
   - Use Redis for caching

2. **API Optimization**
   - Implement pagination
   - Use compression (gzip)
   - Optimize database queries

### Frontend Optimization
1. **Build Optimization**
   - Code splitting
   - Tree shaking
   - Asset optimization
   - Lazy loading

2. **Performance Monitoring**
   - Web Vitals tracking
   - Bundle size monitoring
   - Core Web Vitals optimization

## Rollback Strategy

### Backend Rollback
1. **Blue-Green Deployment**
   - Maintain two identical environments
   - Switch traffic between environments

2. **Database Rollbacks**
   - Use migration tools with rollback capability
   - Test rollback procedures

### Frontend Rollback
1. **Instant Rollback**
   - Most platforms support instant rollbacks
   - Maintain previous build artifacts

## Cost Optimization

### Cost Monitoring
1. **Set up billing alerts**
2. **Monitor resource usage**
3. **Optimize database queries**
4. **Use appropriate instance sizes**

### Free Tier Usage
- **Render**: Free tiers for web services and databases
- **Vercel**: Free tier for personal projects
- **AWS**: Free tier for 12 months (limited services)
- **GitHub**: Free tier for public repositories

## Post-Deployment

### 1. Testing
- [ ] Health checks pass
- [ ] All API endpoints respond correctly
- [ ] Mobile app connects to production backend
- [ ] Web app loads and functions properly
- [ ] Database migrations complete successfully

### 2. Monitoring Setup
- [ ] Configure application monitoring
- [ ] Set up error tracking
- [ ] Implement performance monitoring
- [ ] Configure alerts for critical issues

### 3. Documentation Update
- [ ] Update API documentation
- [ ] Document deployment procedures
- [ ] Update troubleshooting guides
- [ ] Create runbooks for common issues

---

**Deployment Complete!** Your Project Free Fruit should now be running in production. Monitor logs and performance closely during the first few days to catch any issues early.