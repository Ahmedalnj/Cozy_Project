# قائمة فحص النشر (Deployment Checklist)

## ✅ تم إنجازه

### 1. إصلاح أخطاء البناء
- [x] إصلاح مسارات الاستيراد في `FavoriteClient.tsx`
- [x] إصلاح مسارات الاستيراد في `favorites/page.tsx`
- [x] إصلاح مسارات الاستيراد في `reservations/page.tsx`
- [x] إزالة المتغيرات غير المستخدمة في `ListingsTable.tsx`
- [x] إزالة المتغيرات غير المستخدمة في `PaymentTable.tsx`
- [x] إزالة المتغيرات غير المستخدمة في `ReservationsTable.tsx`
- [x] إزالة المتغيرات غير المستخدمة في `Payments/page.tsx`
- [x] البناء يعمل بنجاح (`npm run build` ✅)

### 2. ملفات التهيئة جاهزة
- [x] `package.json` - يحتوي على جميع التبعيات المطلوبة
- [x] `next.config.ts` - مُهيأ بشكل صحيح
- [x] `Dockerfile` - جاهز للنشر
- [x] `docker-compose.yml` - مُهيأ للنشر
- [x] `nginx.conf` - مُهيأ للخادم العكسي
- [x] `prisma/schema.prisma` - مُهيأ لقاعدة البيانات

## 🔧 يجب إنجازه قبل النشر

### 1. إعداد متغيرات البيئة (Environment Variables)

أنشئ ملف `.env` بناءً على `env.example` مع القيم الصحيحة:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"
DATABASE_DIRECT_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Stripe Payment Configuration
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Cloudinary Image Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"

# Application Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Security
JWT_SECRET="your-jwt-secret-key"
ENCRYPTION_KEY="your-encryption-key"
```

### 2. إعداد قاعدة البيانات

```bash
# تشغيل الهجرات
npx prisma migrate deploy

# توليد عميل Prisma
npx prisma generate
```

### 3. اختبار التطبيق محلياً

```bash
# تشغيل التطبيق في وضع الإنتاج
npm run build
npm start
```

### 4. خيارات النشر

#### الخيار أ: النشر باستخدام Docker

```bash
# بناء الصورة
docker build -t cozy-app .

# تشغيل التطبيق
docker-compose up -d
```

#### الخيار ب: النشر على Vercel

1. ارفع الكود إلى GitHub
2. اربط المستودع بـ Vercel
3. أضف متغيرات البيئة في إعدادات Vercel
4. انشر التطبيق

#### الخيار ج: النشر على خادم VPS

1. ارفع الكود إلى الخادم
2. ثبت Node.js و PostgreSQL
3. أضف متغيرات البيئة
4. شغل التطبيق باستخدام PM2 أو systemd

### 5. إعدادات الأمان

- [ ] تغيير جميع كلمات المرور الافتراضية
- [ ] إعداد HTTPS/SSL
- [ ] إعداد جدار الحماية
- [ ] إعداد النسخ الاحتياطي لقاعدة البيانات
- [ ] إعداد مراقبة التطبيق

### 6. اختبار ما بعد النشر

- [ ] اختبار تسجيل الدخول
- [ ] اختبار إنشاء العقارات
- [ ] اختبار الحجوزات
- [ ] اختبار المدفوعات
- [ ] اختبار لوحة تحكم المدير
- [ ] اختبار الأداء والسرعة

## 📋 ملاحظات مهمة

1. **قاعدة البيانات**: تأكد من أن قاعدة البيانات PostgreSQL تعمل وتحتوي على البيانات المطلوبة
2. **المدفوعات**: تأكد من أن Stripe مُهيأ بشكل صحيح للإنتاج
3. **البريد الإلكتروني**: تأكد من أن إعدادات SMTP تعمل
4. **الخرائط**: تأكد من أن Google Maps API يعمل
5. **الملفات**: تأكد من أن Cloudinary مُهيأ لرفع الصور

## 🚀 أوامر النشر السريع

```bash
# إعداد قاعدة البيانات
npx prisma migrate deploy
npx prisma generate

# بناء التطبيق
npm run build

# تشغيل التطبيق
npm start

# أو باستخدام Docker
docker-compose up -d
```

## 📞 الدعم

في حالة وجود أي مشاكل، راجع:
- ملفات السجلات في `/logs`
- إعدادات قاعدة البيانات
- متغيرات البيئة
- إعدادات الشبكة والجدار الناري
