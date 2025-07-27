# Deployment Guide - Al-Awael Educational Platform

This guide covers deploying the Al-Awael Educational Platform to various environments.

## 🚀 Replit Deployment (Recommended)

The platform is optimized for Replit deployment with automatic handling of environment variables and database connections.

### Quick Deploy to Replit

1. **Fork on Replit**
   - Open the Replit project
   - Click "Fork" to create your own copy
   - All dependencies will be automatically installed

2. **Environment Setup**
   - Replit automatically provides database and authentication credentials
   - No manual environment variable setup required
   - Session secrets are automatically generated

3. **Database Migration**
   ```bash
   npm run db:push
   ```

4. **Start Application**
   ```bash
   npm run dev
   ```

5. **Deploy to Production**
   - Click "Deploy" in Replit
   - Your app will be available at `https://your-repl-name.your-username.replit.app`

### Replit Configuration

The platform includes Replit-specific optimizations:

- **Port Configuration**: Automatically uses Replit's port allocation
- **Database**: Neon PostgreSQL integration
- **Authentication**: Replit Auth with OIDC
- **File Serving**: Optimized static file serving
- **Environment Variables**: Secure credential management

## 🌐 Manual Deployment

For deployment outside Replit, follow these steps:

### Prerequisites

- Node.js 18+
- PostgreSQL database
- SSL certificate (for HTTPS)
- Domain name
- Server with 2GB+ RAM

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/alawael
PGHOST=localhost
PGPORT=5432
PGDATABASE=alawael
PGUSER=username
PGPASSWORD=password

# Server Configuration
NODE_ENV=production
PORT=5000

# Authentication (if using custom OIDC)
ISSUER_URL=https://your-auth-provider.com/oidc
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_super_secure_session_secret_min_32_chars

# App Configuration
REPLIT_DOMAINS=your-domain.com
REPL_ID=your_app_id
```

### Build Process

1. **Install Dependencies**
   ```bash
   npm ci --production
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Database Migration**
   ```bash
   npm run db:push
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t al-awael-platform .
docker run -p 5000:5000 --env-file .env al-awael-platform
```

## ☁️ Cloud Deployment Options

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure database is accessible from Vercel

### Netlify Deployment

1. **Build Configuration** (`netlify.toml`):
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

### Railway Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Railway
   - Railway will automatically detect the Node.js app

2. **Environment Variables**
   - Add all required environment variables in Railway dashboard
   - Railway provides a PostgreSQL database addon

3. **Deploy**
   - Railway automatically deploys on git push
   - Custom domain can be configured in settings

### Heroku Deployment

1. **Create Heroku App**
   ```bash
   heroku create al-awael-platform
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Configure Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your_session_secret
   # Add other environment variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🗄️ Database Setup

### PostgreSQL Configuration

1. **Create Database**
   ```sql
   CREATE DATABASE alawael_edu;
   CREATE USER alawael_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE alawael_edu TO alawael_user;
   ```

2. **Run Migrations**
   ```bash
   npm run db:push
   ```

3. **Seed Initial Data** (Optional)
   ```bash
   npm run db:seed
   ```

### Database Optimization

For production deployment:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student ON exam_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
```

## 🔒 Security Configuration

### SSL/HTTPS Setup

1. **Obtain SSL Certificate**
   - Use Let's Encrypt for free certificates
   - Or purchase from a certificate authority

2. **Configure HTTPS**
   ```javascript
   // In server configuration
   app.set('trust proxy', 1);
   app.use(session({
     cookie: {
       secure: true, // HTTPS only
       httpOnly: true,
       maxAge: 24 * 60 * 60 * 1000 // 24 hours
     }
   }));
   ```

### Environment Security

1. **Secure Environment Variables**
   - Never commit `.env` files
   - Use strong session secrets (32+ characters)
   - Rotate secrets regularly

2. **Database Security**
   - Use strong database passwords
   - Enable SSL for database connections
   - Restrict database access by IP

3. **CORS Configuration**
   ```javascript
   app.use(cors({
     origin: ['https://your-domain.com'],
     credentials: true
   }));
   ```

## 📊 Monitoring & Maintenance

### Health Checks

Implement health check endpoints:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Logging

Configure production logging:

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Database Backups

Set up automated backups:

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /backups/alawael_backup_$DATE.sql
```

### Performance Monitoring

Consider using:
- **New Relic** for application performance monitoring
- **DataDog** for infrastructure monitoring
- **Sentry** for error tracking
- **LogRocket** for session replay

## 🔄 CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

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
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to production
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
```

## 📱 Mobile Considerations

### Progressive Web App (PWA)

The platform includes PWA capabilities:

1. **Service Worker**: For offline functionality
2. **Web App Manifest**: For mobile installation
3. **Responsive Design**: Mobile-first approach
4. **Touch Optimized**: Touch-friendly Arabic interface

### Mobile Performance

- Optimize images for mobile
- Implement lazy loading
- Minimize JavaScript bundle size
- Use efficient caching strategies

## 🌍 Internationalization

### Arabic RTL Support

The platform is built with Arabic-first design:

- **RTL Layout**: Complete right-to-left interface
- **Arabic Fonts**: Optimized Arabic typography
- **Cultural Colors**: Appropriate color schemes
- **Local Formats**: Date, number, and currency formatting

### Multi-language Support

To add additional languages:

1. **Translation Files**: Create translation JSON files
2. **Language Switching**: Implement language selector
3. **URL Structure**: Consider language-specific URLs
4. **SEO**: Implement hreflang tags

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection**
   - Check DATABASE_URL format
   - Verify database server is running
   - Ensure firewall allows connections

2. **Authentication Issues**
   - Verify OIDC configuration
   - Check session secret configuration
   - Ensure HTTPS in production

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Performance Issues**
   - Enable database query logging
   - Check for missing indexes
   - Monitor memory usage

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=* npm start
```

### Support

For deployment support:
- Check the [GitHub Issues](https://github.com/yourusername/al-awael-platform/issues)
- Review the [documentation wiki](https://github.com/yourusername/al-awael-platform/wiki)
- Contact the development team

---

**منصة الأوائل التعليمية - دليل النشر والتطبيق**

*Al-Awael Educational Platform - Deployment Guide*