# دليل إعدادات الإنتاج (Production Setup Guide)

## 🎯 نظرة عامة

هذا الدليل يوضح كيفية إعداد تطبيق Cozy للإنتاج بأمان وكفاءة.

## 📋 المتطلبات الأساسية

### الخادم
- **OS**: Ubuntu 20.04+ أو CentOS 8+
- **RAM**: 2GB على الأقل (4GB موصى به)
- **Storage**: 20GB على الأقل
- **CPU**: 2 cores على الأقل

### البرامج المطلوبة
- Node.js 18+
- PostgreSQL 15+
- Redis (اختياري)
- Nginx
- Docker (اختياري)

## 🚀 خيارات النشر

### 1. النشر على Vercel (الأسهل)

#### الخطوات:
1. **إعداد المستودع**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/cozy-project.git
   git push -u origin main
   ```

2. **ربط Vercel**
   - اذهب إلى [vercel.com](https://vercel.com)
   - اربط حساب GitHub
   - اختر المستودع
   - أضف متغيرات البيئة

3. **متغيرات البيئة في Vercel**
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   STRIPE_SECRET_KEY=sk_live_...
   # ... باقي المتغيرات
   ```

### 2. النشر على VPS (تحكم كامل)

#### إعداد الخادم:

1. **تحديث النظام**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **تثبيت Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **تثبيت PostgreSQL**
   ```bash
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

4. **إعداد قاعدة البيانات**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE cozy_db;
   CREATE USER cozy_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE cozy_db TO cozy_user;
   \q
   ```

5. **تثبيت Nginx**
   ```bash
   sudo apt install nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

6. **تثبيت PM2**
   ```bash
   sudo npm install -g pm2
   ```

#### نشر التطبيق:

1. **رفع الكود**
   ```bash
   git clone https://github.com/username/cozy-project.git
   cd cozy-project
   ```

2. **إعداد متغيرات البيئة**
   ```bash
   cp env.example .env
   nano .env
   ```

3. **تثبيت التبعيات وبناء التطبيق**
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   ```

4. **تشغيل التطبيق**
   ```bash
   pm2 start npm --name "cozy-app" -- start
   pm2 startup
   pm2 save
   ```

5. **إعداد Nginx**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/cozy
   sudo ln -s /etc/nginx/sites-available/cozy /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### 3. النشر باستخدام Docker

1. **تثبيت Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **تشغيل التطبيق**
   ```bash
   docker-compose up -d
   ```

## 🔒 إعدادات الأمان

### 1. جدار الحماية
```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. SSL/HTTPS
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3. تحديثات أمنية
```bash
# إعداد التحديثات التلقائية
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 📊 المراقبة والصيانة

### 1. مراقبة التطبيق
```bash
# مراقبة PM2
pm2 monit

# مراقبة النظام
htop
df -h
free -h
```

### 2. النسخ الاحتياطي
```bash
# نسخ احتياطي لقاعدة البيانات
pg_dump cozy_db > backup_$(date +%Y%m%d_%H%M%S).sql

# نسخ احتياطي للملفات
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz /path/to/app
```

### 3. السجلات
```bash
# سجلات التطبيق
pm2 logs cozy-app

# سجلات Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# سجلات PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في قاعدة البيانات**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

2. **خطأ في الذاكرة**
   ```bash
   # زيادة ذاكرة Node.js
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

3. **خطأ في الصلاحيات**
   ```bash
   sudo chown -R $USER:$USER /path/to/app
   chmod -R 755 /path/to/app
   ```

## 📈 تحسين الأداء

### 1. تحسين قاعدة البيانات
```sql
-- إنشاء فهارس
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
```

### 2. تحسين التطبيق
```bash
# تشغيل في وضع الإنتاج
NODE_ENV=production npm start

# استخدام Redis للتخزين المؤقت
npm install redis
```

### 3. تحسين Nginx
```nginx
# إضافة التخزين المؤقت
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 📞 الدعم

للمساعدة في النشر:
1. راجع ملف `DEPLOYMENT_CHECKLIST.md`
2. تحقق من السجلات
3. تأكد من إعدادات الشبكة
4. تحقق من متغيرات البيئة
