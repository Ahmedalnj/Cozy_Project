# 🚀 دليل النشر - Cozy

## 📋 نظرة عامة

هذا الدليل يوضح كيفية نشر منصة Cozy لحجز العقارات على مختلف المنصات والبيئات.

## 🎯 خيارات النشر

### 1. Vercel (موصى به)
### 2. Docker
### 3. AWS
### 4. DigitalOcean
### 5. Heroku

## 🚀 النشر على Vercel

### المتطلبات الأساسية
- حساب Vercel
- مشروع GitHub/GitLab
- متغيرات البيئة

### خطوات النشر

#### 1. رفع المشروع إلى GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/cozy-project.git
git push -u origin main
```

#### 2. ربط المشروع بـ Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط على "New Project"
3. اختر مستودع GitHub الخاص بك
4. اضبط إعدادات المشروع

#### 3. إعداد متغيرات البيئة في Vercel
```env
# Database
DATABASE_URL="postgresql://..."
DATABASE_DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
```

#### 4. إعداد قاعدة البيانات
```bash
# في Vercel CLI
vercel env pull .env.local
npx prisma db push
npx prisma generate
```

#### 5. النشر
```bash
vercel --prod
```

## 🐳 النشر باستخدام Docker

### المتطلبات الأساسية
- Docker
- Docker Compose
- خادم VPS

### خطوات النشر

#### 1. بناء الصورة
```bash
docker build -t cozy-app .
```

#### 2. تشغيل باستخدام Docker Compose
```bash
# نسخ ملف env.example
cp env.example .env

# تعديل متغيرات البيئة
nano .env

# تشغيل الخدمات
docker-compose up -d
```

#### 3. إعداد قاعدة البيانات
```bash
# الدخول إلى الحاوية
docker exec -it cozy-app sh

# تطبيق الترحيلات
npx prisma db push
npx prisma generate
```

#### 4. مراقبة السجلات
```bash
docker-compose logs -f cozy-app
```

### ملف docker-compose.yml محسن للإنتاج
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: cozy-postgres
    environment:
      POSTGRES_DB: cozy_db
      POSTGRES_USER: cozy_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - cozy-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: cozy-redis
    volumes:
      - redis_data:/data
    networks:
      - cozy-network
    restart: unless-stopped

  cozy-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cozy-app
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://cozy_user:${DB_PASSWORD}@postgres:5432/cozy_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - cozy-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: cozy-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - cozy-app
    networks:
      - cozy-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  cozy-network:
    driver: bridge
```

## ☁️ النشر على AWS

### المتطلبات الأساسية
- حساب AWS
- AWS CLI
- معرفة بـ EC2 و RDS

### خطوات النشر

#### 1. إنشاء قاعدة بيانات RDS
```bash
# إنشاء مجموعة أمان لقاعدة البيانات
aws ec2 create-security-group \
  --group-name cozy-db-sg \
  --description "Security group for Cozy database"

# إنشاء قاعدة بيانات PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier cozy-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20
```

#### 2. إنشاء خادم EC2
```bash
# إنشاء مجموعة أمان للتطبيق
aws ec2 create-security-group \
  --group-name cozy-app-sg \
  --description "Security group for Cozy application"

# إنشاء خادم EC2
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t2.micro \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx
```

#### 3. إعداد الخادم
```bash
# الاتصال بالخادم
ssh -i your-key.pem ubuntu@your-server-ip

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# تثبيت Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# استنساخ المشروع
git clone https://github.com/username/cozy-project.git
cd cozy-project

# إعداد متغيرات البيئة
cp env.example .env
nano .env

# تشغيل التطبيق
docker-compose up -d
```

## 🌊 النشر على DigitalOcean

### المتطلبات الأساسية
- حساب DigitalOcean
- Droplet أو App Platform

### خطوات النشر

#### 1. إنشاء Droplet
1. اذهب إلى [digitalocean.com](https://digitalocean.com)
2. اضغط على "Create" → "Droplets"
3. اختر Ubuntu 22.04
4. اختر الخطة المناسبة
5. اختر موقع الخادم
6. أضف SSH key
7. اضغط على "Create Droplet"

#### 2. إعداد الخادم
```bash
# الاتصال بالخادم
ssh root@your-server-ip

# تحديث النظام
apt update && apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# إضافة المستخدم إلى مجموعة Docker
usermod -aG docker $USER

# تثبيت Docker Compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# استنساخ المشروع
git clone https://github.com/username/cozy-project.git
cd cozy-project

# إعداد متغيرات البيئة
cp env.example .env
nano .env

# تشغيل التطبيق
docker-compose up -d
```

## 🏗️ النشر على Heroku

### المتطلبات الأساسية
- حساب Heroku
- Heroku CLI

### خطوات النشر

#### 1. تثبيت Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# تحميل من https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. إنشاء تطبيق Heroku
```bash
# تسجيل الدخول
heroku login

# إنشاء تطبيق
heroku create cozy-app

# إضافة قاعدة بيانات PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# إضافة Redis
heroku addons:create heroku-redis:hobby-dev
```

#### 3. إعداد متغيرات البيئة
```bash
# إعداد متغيرات البيئة
heroku config:set NODE_ENV=production
heroku config:set NEXTAUTH_SECRET=your-secret
heroku config:set NEXTAUTH_URL=https://cozy-app.herokuapp.com
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### 4. النشر
```bash
# رفع الكود
git push heroku main

# تشغيل الترحيلات
heroku run npx prisma db push

# فتح التطبيق
heroku open
```

## 🔒 إعداد SSL/HTTPS

### Let's Encrypt (مجاني)
```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com

# تجديد تلقائي
sudo crontab -e
# أضف السطر التالي:
0 12 * * * /usr/bin/certbot renew --quiet
```

### Cloudflare (موصى به)
1. اذهب إلى [cloudflare.com](https://cloudflare.com)
2. أضف نطاقك
3. غيّر nameservers
4. فعّل SSL/TLS
5. أضف قواعد الأمان

## 📊 مراقبة الأداء

### Vercel Analytics
```bash
# إضافة Vercel Analytics
npm install @vercel/analytics

# في _app.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### Sentry للخطأ
```bash
# تثبيت Sentry
npm install @sentry/nextjs

# إعداد Sentry
npx @sentry/wizard -i nextjs
```

### Logging
```javascript
// إضافة logging
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📈 تحسين الأداء

### تحسين الصور
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

### تحسين Bundle
```bash
# تحليل Bundle
npm install --save-dev @next/bundle-analyzer

# في next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // إعدادات أخرى
})
```

## 🚨 الأمان

### Headers الأمان
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

## 📝 ملاحظات مهمة

1. **اختبار شامل** قبل النشر
2. **نسخ احتياطي** لقاعدة البيانات
3. **مراقبة الأداء** بعد النشر
4. **تحديث الأمان** بانتظام
5. **توثيق التغييرات** دائماً

