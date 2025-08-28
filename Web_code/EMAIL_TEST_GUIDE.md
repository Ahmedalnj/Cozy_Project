# 📧 دليل اختبار إرسال البريد الإلكتروني

## ✅ تم تحديث API بنجاح!

تم تحديث API `/api/payments/send-invoice` ليعمل مع متغيرات البيئة الجديدة:

```bash
EMAIL_USER=ahmed.alnjjar40@gmail.com
EMAIL_PASSWORD=icys ikna mhuo nvou
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

## 🧪 كيفية اختبار API

### 1. اختبار سريع باستخدام Node.js
```bash
node test-email.js
```

### 2. اختبار API مباشرة
```bash
curl -X POST http://localhost:3000/api/payments/send-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "payment_id_here",
    "email": "ahmed.alnjjar40@gmail.com"
  }'
```

### 3. اختبار من خلال التطبيق
1. قم بعمل حجز
2. اختر الدفع بالبطاقة
3. أكمل عملية الدفع
4. تحقق من وصول الفاتورة للبريد

## 🔧 الملفات المحدثة

### ✅ `app/api/payments/send-invoice/route.ts`
- تحديث إعدادات SMTP
- استخدام `EMAIL_PASSWORD` بدلاً من `EMAIL_PASS`
- إضافة `EMAIL_HOST` و `EMAIL_PORT`

### ✅ `app/Password/mail.ts`
- تحديث إعدادات SMTP
- توحيد الإعدادات مع API الفواتير

### ✅ `ENVIRONMENT_VARIABLES.md`
- إضافة تعليمات إعداد البريد الإلكتروني
- شرح كيفية الحصول على App Password

## 🎯 الميزات المتاحة الآن

### 📧 إرسال الفواتير
- فاتورة HTML جميلة باللغة العربية
- تفاصيل شاملة للحجز والدفع
- تصميم متجاوب ومهني

### 🔐 إرسال رموز إعادة تعيين كلمة المرور
- رموز تحقق آمنة
- تصميم بسيط وواضح
- انتهاء صلاحية تلقائي

### 📋 إرسال تأكيدات الحجز
- تأكيد الحجز النقدي
- تفاصيل العقار والتواريخ
- معلومات الاتصال

## 🚀 خطوات التشغيل

1. **أضف متغيرات البيئة** إلى ملف `.env.local`:
```bash
EMAIL_USER=ahmed.alnjjar40@gmail.com
EMAIL_PASSWORD=icys ikna mhuo nvou
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

2. **أعد تشغيل الخادم**:
```bash
npm run dev
```

3. **اختبر الإرسال**:
```bash
node test-email.js
```

## ⚠️ ملاحظات مهمة

- ✅ تأكد من تفعيل "2-Step Verification" في Gmail
- ✅ استخدم App Password وليس كلمة المرور العادية
- ✅ تأكد من أن البريد الإلكتروني صحيح
- ✅ تحقق من مجلد Spam إذا لم تصل الرسالة

## 🎉 النتيجة المتوقعة

إذا كان كل شيء يعمل بشكل صحيح، ستستلم:
- ✅ رسالة اختبار من `test-email.js`
- ✅ فواتير دفع عند إتمام الحجوزات
- ✅ رموز إعادة تعيين كلمة المرور
- ✅ تأكيدات الحجز النقدي

---

**تم التحديث بنجاح! 🚀✨**


