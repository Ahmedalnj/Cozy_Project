# 🔧 إعداد Next.js API للتسجيل الدخول

## 📋 الخطوات المطلوبة:

### 1. إنشاء ملف Environment Variables:
أنشئ ملف `.env.local` في مجلد مشروع Next.js:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vykmsfbvnlunheuftaej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5a21zZmJ2bmx1bmhldWZ0YWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjMwMDYsImV4cCI6MjA2NTIzOTAwNn0.ZoLNP5sg_9ulfC7_lYu3hSgZQOYHT6Q663DUb0C310Q

# Supabase Service Role Key (للعمليات من جانب الخادم)
# احصل على هذا من Supabase Dashboard > Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. إنشاء مجلد API Routes:
أنشئ المجلدات التالية في مشروع Next.js:

```
pages/api/auth/
├── login.ts
├── signup.ts
└── google.ts
```

### 3. نسخ ملفات API Routes:
انسخ الملفات من مجلد `nextjs_api_routes/` إلى مشروع Next.js الخاص بك.

### 4. تثبيت Dependencies:
```bash
npm install @supabase/supabase-js
```

### 5. تشغيل Next.js Server:
```bash
npm run dev
```

## 🔍 الحصول على Service Role Key:

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك: `vykmsfbvnlunheuftaej`
3. اذهب إلى **Settings** > **API**
4. انسخ **service_role** key (يبدأ بـ `eyJ...`)
5. ضعه في ملف `.env.local`

## ✅ اختبار API:

### اختبار Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### اختبار Signup:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🔍 استكشاف الأخطاء:

إذا واجهت مشاكل:
- تأكد من صحة Service Role Key
- تحقق من تشغيل Next.js Server
- راجع console logs للأخطاء
- تأكد من إنشاء الجداول في Supabase

## 📞 الدعم:

إذا واجهت مشاكل، تحقق من:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
