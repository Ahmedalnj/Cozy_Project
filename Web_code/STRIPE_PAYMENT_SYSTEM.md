# 💳 نظام الدفع المتكامل مع Stripe

## 🎯 نظرة عامة

تم تطوير نظام دفع متكامل مع Stripe يتضمن:
- ✅ إنشاء جلسات دفع آمنة
- ✅ معالجة الدفع وحفظ الحجوزات
- ✅ عرض فاتورة دفع تفاعلية
- ✅ حفظ معلومات الدفع في قاعدة البيانات
- ✅ إرسال الفواتير عبر البريد الإلكتروني

## 🏗️ هيكل النظام

### 1. **إنشاء جلسة الدفع**
```
POST /api/stripe/create-session
```

### 2. **تأكيد الحجز والدفع**
```
POST /api/reservations/confirm
```

### 3. **جلب تفاصيل الحجز**
```
GET /api/reservations/[reservationId]
```

### 4. **إرسال الفاتورة**
```
POST /api/payments/send-invoice
```

## 📊 قاعدة البيانات

### جدول `Payment`
```sql
model Payment {
  id            String        @id @default(uuid())
  reservationId String?       // معرف الحجز المرتبط
  userId        String        // معرف المستخدم
  listingId     String        // معرف العقار
  stripeSession String        // معرف جلسة Stripe
  transactionId String?       // معرف المعاملة
  paymentMethod String?       // طريقة الدفع
  status        PaymentStatus // حالة الدفع
  amount        Float         // المبلغ
  currency      String        // العملة
  expiresAt     DateTime?     // تاريخ انتهاء الصلاحية
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}
```

## 🔄 تدفق العملية

### 1. **إنشاء جلسة الدفع**
```typescript
// في app/api/stripe/create-session/route.ts
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [{
    price_data: {
      currency: "usd",
      product_data: {
        name: description,
        metadata: {
          listingId, userId, startDate, endDate
        }
      },
      unit_amount: Math.round(amount * 100)
    },
    quantity: 1
  }],
  mode: "payment",
  success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/payment/cancel`,
  metadata: {
    reservationId, amount, listingId, userId, 
    startDate, endDate, totalPrice
  }
});
```

### 2. **تأكيد الحجز والدفع**
```typescript
// في app/api/reservations/confirm/route.ts
const result = await prisma.$transaction(async (tx) => {
  // إنشاء الحجز
  const reservation = await tx.reservation.create({
    data: {
      listingId, userId, startDate, endDate,
      totalPrice: price, SessionId: sessionId
    }
  });

  // إنشاء سجل الدفع
  const payment = await tx.payment.create({
    data: {
      reservationId: reservation.id,
      userId, listingId, stripeSession: sessionId,
      transactionId: paymentIntent?.id,
      paymentMethod: paymentMethod,
      status: "SUCCESS",
      amount: price, currency: "usd"
    }
  });

  return { reservation, payment };
});
```

### 3. **عرض فاتورة الدفع**
```typescript
// في app/payment/success/page.tsx
const fetchReservationDetails = async (reservationId: string) => {
  const res = await axios.get(`/api/reservations/${reservationId}`);
  if (res.data.success) {
    setReservationData(res.data.reservation);
  }
};
```

## 🎨 واجهة المستخدم

### صفحة النجاح مع الفاتورة
- ✅ **رأس الفاتورة**: رقم الفاتورة وتاريخ الإصدار
- ✅ **تفاصيل الدفع**: المبلغ، طريقة الدفع، رقم المعاملة
- ✅ **معلومات العميل**: الاسم، البريد الإلكتروني، تاريخ الحجز
- ✅ **تفاصيل الحجز**: العقار، تواريخ الوصول والمغادرة
- ✅ **المجموع الإجمالي**: المبلغ النهائي

### أزرار التفاعل
- 🖨️ **طباعة الفاتورة**: طباعة مباشرة
- 📥 **تحميل الفاتورة**: تحميل كملف JSON
- 📧 **إرسال عبر البريد**: إرسال فاتورة HTML
- 🏠 **العودة للرئيسية**: العودة لصفحة الرحلات

## 📧 إرسال الفواتير

### API إرسال الفاتورة
```typescript
// في app/api/payments/send-invoice/route.ts
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: `فاتورة الدفع - ${reservation.listing.title}`,
  html: invoiceHtml // فاتورة HTML محسنة
};
```

### محتوى الفاتورة
- 🎨 **تصميم احترافي**: ألوان متناسقة وتخطيط واضح
- 📋 **معلومات شاملة**: جميع تفاصيل الحجز والدفع
- 🌐 **دعم العربية**: تخطيط RTL ونصوص عربية
- 📱 **متجاوب**: يعمل على جميع الأجهزة

## 🔒 الأمان والحماية

### 1. **حماية من التكرار**
```typescript
// استخدام sessionStorage لمنع التكرار
const confirmationKey = `reservation_confirmed_${sessionId}`;
const hasConfirmed = sessionStorage.getItem(confirmationKey);

if (hasConfirmed === "true") {
  return; // منع التكرار
}
```

### 2. **التحقق من صحة البيانات**
```typescript
// التحقق من حالة الدفع في Stripe
if (session.payment_status !== "paid") {
  return NextResponse.json(
    { success: false, error: "عملية الدفع لم تكتمل" },
    { status: 400 }
  );
}
```

### 3. **معاملات قاعدة البيانات**
```typescript
// استخدام transactions لضمان التكامل
const result = await prisma.$transaction(async (tx) => {
  // إنشاء الحجز والدفع في نفس المعاملة
});
```

## 🚀 الميزات المتقدمة

### 1. **معالجة الأخطاء الشاملة**
- ✅ أخطاء Stripe
- ✅ أخطاء قاعدة البيانات
- ✅ أخطاء الشبكة
- ✅ رسائل خطأ واضحة بالعربية

### 2. **التوثيق والـ Logging**
```typescript
console.log(`Creating reservation for session: ${sessionId}`);
console.log(`Reservation ${reservation.id} created successfully`);
```

### 3. **التحقق من صحة البيانات**
- ✅ التحقق من التواريخ
- ✅ التحقق من المبالغ
- ✅ التحقق من صحة البريد الإلكتروني
- ✅ التحقق من عدم تضارب الحجوزات

## 📋 متطلبات النظام

### متغيرات البيئة المطلوبة
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### المكتبات المطلوبة
```json
{
  "stripe": "^14.0.0",
  "nodemailer": "^6.9.0",
  "@prisma/client": "^5.0.0",
  "react-hot-toast": "^2.4.0"
}
```

## 🧪 الاختبار

### سيناريوهات الاختبار
1. **دفع ناجح**: إنشاء حجز ودفع بنجاح
2. **دفع مكرر**: منع التكرار في الحجز
3. **دفع فاشل**: معالجة أخطاء الدفع
4. **إرسال فاتورة**: إرسال فاتورة عبر البريد
5. **طباعة فاتورة**: طباعة الفاتورة

### النتائج المتوقعة
- ✅ حجز واحد لكل عملية دفع
- ✅ فاتورة دفع واضحة ومفصلة
- ✅ إرسال فاتورة عبر البريد الإلكتروني
- ✅ تجربة مستخدم سلسة

## 🎯 النتائج

### ✅ **تم إنجازه:**
1. **نظام دفع متكامل** مع Stripe
2. **حفظ معلومات الدفع** في قاعدة البيانات
3. **عرض فاتورة تفاعلية** مع جميع التفاصيل
4. **إرسال فواتير** عبر البريد الإلكتروني
5. **حماية شاملة** من الأخطاء والتكرار
6. **واجهة مستخدم محسنة** باللغة العربية

### 🚀 **المزايا:**
- **أمان عالي**: حماية من التكرار والأخطاء
- **تجربة مستخدم ممتازة**: واجهة جميلة وسهلة الاستخدام
- **توثيق شامل**: جميع العمليات موثقة
- **قابلية التوسع**: نظام مرن وقابل للتطوير
- **دعم متعدد اللغات**: واجهة عربية كاملة

## 📞 الدعم

للاستفسارات أو المشاكل التقنية، يرجى التواصل مع فريق التطوير.

---

**تم تطوير هذا النظام بواسطة فريق Cozy Project** 🏠✨

