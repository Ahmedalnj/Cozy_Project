# 📚 وثائق API - Cozy

## 📋 نظرة عامة

هذا الدليل يوثق جميع واجهات برمجة التطبيقات (APIs) المستخدمة في منصة Cozy لحجز العقارات.

## 🔐 المصادقة

### تسجيل الدخول
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### تسجيل الخروج
```http
POST /api/auth/signout
```

### تسجيل مستخدم جديد
```http
POST /api/register
Content-Type: application/json

{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123"
}
```

## 🏠 العقارات

### الحصول على جميع العقارات
```http
GET /api/listings
```

**المعاملات:**
- `category` - تصنيف العقار
- `roomCount` - عدد الغرف
- `guestCount` - عدد الضيوف
- `bathroomCount` - عدد الحمامات
- `startDate` - تاريخ البداية
- `endDate` - تاريخ النهاية
- `locationValue` - الموقع
- `price` - السعر

### الحصول على عقار محدد
```http
GET /api/listings/{listingId}
```

### إنشاء عقار جديد
```http
POST /api/listings
Content-Type: application/json

{
  "title": "فيلا فاخرة في طرابلس",
  "description": "فيلا جميلة مع إطلالة على البحر",
  "category": "villa",
  "roomCount": 4,
  "bathroomCount": 3,
  "guestCount": 8,
  "locationValue": "Tripoli, Libya",
  "price": 150,
  "imageSrc": ["url1", "url2"],
  "offers": ["wifi", "parking"]
}
```

### تحديث عقار
```http
PUT /api/listings/{listingId}
Content-Type: application/json

{
  "title": "فيلا فاخرة محدثة",
  "price": 200
}
```

### حذف عقار
```http
DELETE /api/listings/{listingId}
```

## 📅 الحجوزات

### الحصول على حجوزات المستخدم
```http
GET /api/reservations
```

### إنشاء حجز جديد
```http
POST /api/reservations
Content-Type: application/json

{
  "listingId": "listing-id",
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "totalPrice": 750
}
```

### تأكيد حجز
```http
POST /api/reservations/{reservationId}/confirm
```

### إلغاء حجز
```http
DELETE /api/reservations/{reservationId}
```

## 💳 المدفوعات

### إنشاء جلسة دفع
```http
POST /api/stripe/create-session
Content-Type: application/json

{
  "reservationId": "reservation-id",
  "amount": 750,
  "currency": "usd"
}
```

### تأكيد الدفع
```http
POST /api/payments/confirm
Content-Type: application/json

{
  "sessionId": "stripe-session-id"
}
```

## ❤️ المفضلة

### إضافة عقار للمفضلة
```http
POST /api/favorites/{listingId}
```

### إزالة عقار من المفضلة
```http
DELETE /api/favorites/{listingId}
```

### الحصول على المفضلة
```http
GET /api/favorites
```

## 🔧 لوحة الإدارة

### الحصول على إحصائيات
```http
GET /api/admin/dashboard
```

### الحصول على جميع المستخدمين
```http
GET /api/admin/users
```

### الحصول على جميع العقارات
```http
GET /api/admin/listings
```

### الحصول على جميع الحجوزات
```http
GET /api/admin/reservations
```

## 📧 البريد الإلكتروني

### إرسال إشعار حجز
```http
POST /api/email/reservation-notification
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "تأكيد الحجز",
  "reservationId": "reservation-id"
}
```

## 🔒 الأمان

### Rate Limiting
- **API العامة:** 100 طلب/دقيقة
- **تسجيل الدخول:** 5 محاولات/دقيقة
- **إنشاء الحسابات:** 3 محاولات/ساعة

### Headers المطلوبة
```http
Authorization: Bearer <token>
Content-Type: application/json
```

## 📊 رموز الحالة

- `200` - نجح الطلب
- `201` - تم الإنشاء بنجاح
- `400` - طلب غير صحيح
- `401` - غير مصرح
- `403` - محظور
- `404` - غير موجود
- `429` - تجاوز حد الطلبات
- `500` - خطأ في الخادم

## 🔍 أمثلة الاستخدام

### البحث عن عقارات
```javascript
const response = await fetch('/api/listings?category=villa&price=100&locationValue=Tripoli');
const listings = await response.json();
```

### إنشاء حجز
```javascript
const reservation = await fetch('/api/reservations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    listingId: 'listing-id',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    totalPrice: 750
  })
});
```

## 📝 ملاحظات مهمة

1. **جميع الطلبات** تتطلب مصادقة باستثناء البحث العام
2. **الطلبات** يجب أن تكون بصيغة JSON
3. **التواريخ** يجب أن تكون بصيغة ISO 8601
4. **الصور** يتم رفعها عبر Cloudinary
5. **المدفوعات** تتم عبر Stripe

## 🚀 اختبار API

يمكنك اختبار APIs باستخدام:
- **Postman**
- **Insomnia**
- **curl**
- **Thunder Client (VS Code)**

### مثال باستخدام curl
```bash
# الحصول على العقارات
curl -X GET "http://localhost:3000/api/listings" \
  -H "Authorization: Bearer your-token"

# إنشاء حجز
curl -X POST "http://localhost:3000/api/reservations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "listingId": "listing-id",
    "startDate": "2024-01-15",
    "endDate": "2024-01-20",
    "totalPrice": 750
  }'
```

