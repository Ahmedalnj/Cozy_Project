# دمج ConfirmAcceptModal في ReservationsClient

## 🎯 التحديثات المطبقة

تم دمج `ConfirmAcceptModal` في `ReservationsClient` لاستخدامه عند الضغط على "Accept Cash on Arrival".

## 🔧 التحديثات المطبقة

### 1. **إضافة Import**
- ✅ **إضافة ConfirmAcceptModal** import
- ✅ **استيراد المكون** من المسار الصحيح

### 2. **إضافة State Management**
- ✅ **إضافة `isAcceptModalOpen`** state للتحكم في فتح/إغلاق الموديل
- ✅ **إضافة `selectedReservationData`** state لتخزين بيانات الحجز المحدد
- ✅ **إضافة `selectedReservationId`** state لتخزين معرف الحجز المحدد

### 3. **تحديث onAcceptCash Function**
- ✅ **تغيير السلوك** من قبول مباشر إلى فتح موديل التأكيد
- ✅ **إعداد بيانات الحجز** من `reservations` array
- ✅ **تنسيق التواريخ** باستخدام `toLocaleDateString()`
- ✅ **إعداد البيانات المطلوبة** للموديل

### 4. **إضافة handleAcceptConfirm Function**
- ✅ **إنشاء وظيفة جديدة** للتعامل مع تأكيد القبول
- ✅ **استدعاء API** `/api/reservations/accept-cash`
- ✅ **إدارة الحالة** (loading, success, error)
- ✅ **إغلاق الموديل** بعد النجاح
- ✅ **إعادة تعيين البيانات** بعد الانتهاء

### 5. **إضافة ConfirmAcceptModal Component**
- ✅ **إضافة الموديل** في نهاية المكون
- ✅ **تمرير البيانات المطلوبة** (isOpen, onClose, onConfirm, isLoading, reservationData)
- ✅ **إدارة الحالة** بشكل صحيح

## 🎨 التدفق الجديد

### **قبل التحديث:**
```
1. الضغط على "Accept Cash on Arrival"
2. قبول مباشر بدون تأكيد
3. تحديث الحالة
```

### **بعد التحديث:**
```
1. الضغط على "Accept Cash on Arrival"
2. فتح موديل التأكيد مع تفاصيل الحجز
3. عرض تفاصيل الضيف والعقار والتواريخ والسعر
4. الضغط على "Accept Reservation" للتأكيد
5. إرسال طلب API
6. إغلاق الموديل وتحديث الحالة
```

## 📋 البيانات المعروضة في الموديل

### **تفاصيل الحجز:**
- ✅ **اسم الضيف** - من `reservation.user?.name`
- ✅ **عنوان العقار** - من `reservation.listing?.title`
- ✅ **السعر الإجمالي** - من `reservation.totalPrice`
- ✅ **تاريخ البداية** - من `reservation.startDate`
- ✅ **تاريخ النهاية** - من `reservation.endDate`

### **التنسيق:**
- ✅ **تواريخ محسنة** - باستخدام `toLocaleDateString()`
- ✅ **قيم افتراضية** - في حالة عدم وجود بيانات
- ✅ **عرض واضح** - مع أيقونات وألوان مميزة

## 🔧 الملفات المحدثة

### 1. **`app/reservations/ReservationsClient.tsx`**
- ✅ **إضافة import** لـ ConfirmAcceptModal
- ✅ **إضافة state management** للموديل
- ✅ **تحديث onAcceptCash** function
- ✅ **إضافة handleAcceptConfirm** function
- ✅ **إضافة ConfirmAcceptModal** component

## ✅ المزايا الجديدة

### 1. **تجربة مستخدم محسنة**
- ✅ **تأكيد واضح** قبل قبول الدفع النقدي
- ✅ **عرض تفاصيل كاملة** للحجز
- ✅ **تقليل الأخطاء** من القبول العرضي
- ✅ **واجهة واضحة** مع تفاصيل الضيف والعقار

### 2. **أمان محسن**
- ✅ **تأكيد مزدوج** قبل قبول الدفع
- ✅ **عرض التفاصيل** للتأكد من صحة الحجز
- ✅ **تقليل الأخطاء** البشرية

### 3. **وضوح أفضل**
- ✅ **تفاصيل شاملة** للضيف والعقار
- ✅ **تواريخ واضحة** للفترة المحددة
- ✅ **سعر واضح** للدفع النقدي
- ✅ **تنبيه مهم** لجمع النقود

## 🎯 مثال على الاستخدام

### **عند الضغط على "Accept Cash on Arrival":**

```typescript
// 1. البحث عن بيانات الحجز
const reservation = reservations.find(r => r.id === id);

// 2. إعداد البيانات للموديل
setSelectedReservationData({
  guestName: reservation.user?.name || "Guest",
  listingTitle: reservation.listing?.title || "Property",
  totalPrice: reservation.totalPrice,
  startDate: new Date(reservation.startDate).toLocaleDateString(),
  endDate: new Date(reservation.endDate).toLocaleDateString(),
});

// 3. فتح الموديل
setIsAcceptModalOpen(true);
```

### **عند التأكيد:**
```typescript
// 1. إرسال طلب API
axios.post("/api/reservations/accept-cash", { 
  reservationId: selectedReservationId 
});

// 2. إغلاق الموديل وتحديث الحالة
setIsAcceptModalOpen(false);
setSelectedReservationData(null);
router.refresh();
```

## 📱 النتيجة النهائية

### **الموديل المعروض:**
```
┌─────────────────────────────────────┐
│           Confirm Accept            │
│                                     │
│  Guest: John Doe                    │
│  Property: Beach Villa              │
│  Dates: 1/15/2024 - 1/20/2024      │
│  Price: $500 (Cash Payment)         │
│                                     │
│  ⚠️ Important Note: Collect cash   │
│                                     │
│  [Cancel] [Accept Reservation]      │
└─────────────────────────────────────┘
```

---

**تم دمج ConfirmAcceptModal بنجاح! 🎉✅**
