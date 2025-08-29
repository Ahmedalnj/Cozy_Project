# 🗄️ مخطط قاعدة البيانات - Cozy

## 📋 نظرة عامة

هذا الدليل يوثق مخطط قاعدة البيانات المستخدم في منصة Cozy لحجز العقارات. قاعدة البيانات مبنية باستخدام PostgreSQL مع Prisma ORM.

## 🏗️ النماذج (Models)

### 👤 User - المستخدمين

```sql
model User {
  id             String        @id @default(uuid()) @map("_id") @db.Uuid
  email          String?       @unique
  name           String?
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  favoriteIds    String[]      @db.Uuid
  role           String?       @default("USER")
  codeExpiresAt  DateTime?
  resetCode      String?
  
  // العلاقات
  accounts       Account[]
  listings       Listing[]
  reservations   Reservation[]
  payments       Payment[]     @relation("UserPayments")
}
```

**الحقول:**
- `id` - المعرف الفريد للمستخدم
- `email` - البريد الإلكتروني (فريد)
- `name` - اسم المستخدم
- `emailVerified` - تاريخ التحقق من البريد
- `image` - صورة الملف الشخصي
- `hashedPassword` - كلمة المرور المشفرة
- `createdAt` - تاريخ الإنشاء
- `updatedAt` - تاريخ التحديث
- `favoriteIds` - قائمة معرفات العقارات المفضلة
- `role` - دور المستخدم (USER/ADMIN)
- `codeExpiresAt` - تاريخ انتهاء رمز إعادة تعيين كلمة المرور
- `resetCode` - رمز إعادة تعيين كلمة المرور

### 🔐 Account - حسابات المصادقة

```sql
model Account {
  id                String  @id @default(uuid()) @map("_id") @db.Uuid
  userId            String  @db.Uuid
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  // العلاقات
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

**الحقول:**
- `id` - المعرف الفريد للحساب
- `userId` - معرف المستخدم المرتبط
- `type` - نوع الحساب
- `provider` - مزود المصادقة (Google, GitHub, etc.)
- `providerAccountId` - معرف الحساب في المزود
- `refresh_token` - رمز التحديث
- `access_token` - رمز الوصول
- `expires_at` - تاريخ انتهاء الصلاحية
- `token_type` - نوع الرمز
- `scope` - نطاق الصلاحيات
- `id_token` - رمز الهوية
- `session_state` - حالة الجلسة

### 🏠 Listing - العقارات

```sql
model Listing {
  id            String        @id @default(uuid()) @map("_id") @db.Uuid
  title         String
  description   String
  createdAt     DateTime      @default(now())
  category      String
  roomCount     Int
  bathroomCount Int
  guestCount    Int
  locationValue String
  price         Int
  userId        String        @map("user_id") @db.Uuid
  imageSrc      String[]
  offers        String[]
  
  // العلاقات
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  reservations  Reservation[]
  payments      Payment[]     @relation("ListingPayments")
}
```

**الحقول:**
- `id` - المعرف الفريد للعقار
- `title` - عنوان العقار
- `description` - وصف العقار
- `createdAt` - تاريخ الإنشاء
- `category` - تصنيف العقار (villa, apartment, room, etc.)
- `roomCount` - عدد الغرف
- `bathroomCount` - عدد الحمامات
- `guestCount` - عدد الضيوف
- `locationValue` - قيمة الموقع
- `price` - السعر لليلة الواحدة
- `userId` - معرف المالك
- `imageSrc` - قائمة روابط الصور
- `offers` - قائمة المرافق المتوفرة

### 📅 Reservation - الحجوزات

```sql
model Reservation {
  id         String    @id @default(uuid()) @map("_id") @db.Uuid
  listingId  String    @map("listing_id") @db.Uuid
  userId     String    @map("user_id") @db.Uuid
  startDate  DateTime
  endDate    DateTime
  totalPrice Float
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  SessionId  String?   @unique @map("session_id")
  
  // العلاقات
  listing    Listing   @relation(fields: [listingId], references: [id], onDelete: Cascade)
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  payments   Payment[] @relation("ReservationPayments")
}
```

**الحقول:**
- `id` - المعرف الفريد للحجز
- `listingId` - معرف العقار
- `userId` - معرف المستخدم
- `startDate` - تاريخ بداية الحجز
- `endDate` - تاريخ نهاية الحجز
- `totalPrice` - السعر الإجمالي
- `createdAt` - تاريخ إنشاء الحجز
- `updatedAt` - تاريخ تحديث الحجز
- `SessionId` - معرف جلسة الدفع (Stripe)

### 💳 Payment - المدفوعات

```sql
model Payment {
  id            String        @id @default(uuid()) @map("_id") @db.Uuid
  reservationId String?       @map("reservation_id") @db.Uuid
  userId        String        @map("user_id") @db.Uuid
  listingId     String        @map("listing_id") @db.Uuid
  stripeSession String
  transactionId String?
  paymentMethod String?
  status        PaymentStatus @default(PENDING)
  amount        Float
  currency      String        @default("usd")
  expiresAt     DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // العلاقات
  listing       Listing       @relation("ListingPayments", fields: [listingId], references: [id], onDelete: Cascade)
  reservation   Reservation?  @relation("ReservationPayments", fields: [reservationId], references: [id])
  user          User          @relation("UserPayments", fields: [userId], references: [id], onDelete: Cascade)

  @@map("payments")
}
```

**الحقول:**
- `id` - المعرف الفريد للدفع
- `reservationId` - معرف الحجز المرتبط
- `userId` - معرف المستخدم
- `listingId` - معرف العقار
- `stripeSession` - معرف جلسة Stripe
- `transactionId` - معرف المعاملة
- `paymentMethod` - طريقة الدفع
- `status` - حالة الدفع (PENDING, COMPLETED, FAILED, CANCELLED)
- `amount` - المبلغ
- `currency` - العملة (افتراضي: usd)
- `expiresAt` - تاريخ انتهاء الصلاحية
- `createdAt` - تاريخ إنشاء الدفع
- `updatedAt` - تاريخ تحديث الدفع

## 🔗 العلاقات (Relationships)

### User ↔ Account
- **One-to-Many**: مستخدم واحد يمكن أن يكون له عدة حسابات مصادقة
- **Cascade Delete**: عند حذف المستخدم، تُحذف جميع حسابات المصادقة

### User ↔ Listing
- **One-to-Many**: مستخدم واحد يمكن أن يملك عدة عقارات
- **Cascade Delete**: عند حذف المستخدم، تُحذف جميع عقاراته

### User ↔ Reservation
- **One-to-Many**: مستخدم واحد يمكن أن يكون له عدة حجوزات
- **Cascade Delete**: عند حذف المستخدم، تُحذف جميع حجوزاته

### User ↔ Payment
- **One-to-Many**: مستخدم واحد يمكن أن يكون له عدة مدفوعات
- **Cascade Delete**: عند حذف المستخدم، تُحذف جميع مدفوعاته

### Listing ↔ Reservation
- **One-to-Many**: عقار واحد يمكن أن يكون له عدة حجوزات
- **Cascade Delete**: عند حذف العقار، تُحذف جميع حجوزاته

### Listing ↔ Payment
- **One-to-Many**: عقار واحد يمكن أن يكون له عدة مدفوعات
- **Cascade Delete**: عند حذف العقار، تُحذف جميع مدفوعاته

### Reservation ↔ Payment
- **One-to-Many**: حجز واحد يمكن أن يكون له عدة مدفوعات
- **Optional**: الحجز يمكن أن يكون بدون مدفوعات

## 📊 الفهارس (Indexes)

### فهارس تلقائية
- `User.email` - فهرس فريد على البريد الإلكتروني
- `Account.provider_providerAccountId` - فهرس مركب فريد
- `Reservation.SessionId` - فهرس فريد على معرف الجلسة

### فهارس مقترحة
```sql
-- فهرس على تصنيف العقار للبحث السريع
CREATE INDEX idx_listing_category ON "Listing" (category);

-- فهرس على سعر العقار للفلترة
CREATE INDEX idx_listing_price ON "Listing" (price);

-- فهرس على تاريخ الحجز للبحث
CREATE INDEX idx_reservation_dates ON "Reservation" (startDate, endDate);

-- فهرس على حالة الدفع
CREATE INDEX idx_payment_status ON "Payment" (status);
```

## 🔒 الأمان

### تشفير البيانات
- **كلمات المرور**: مشفرة باستخدام bcrypt
- **الرموز**: مشفرة باستخدام JWT
- **البيانات الحساسة**: مشفرة في قاعدة البيانات

### التحقق من البيانات
- **Email**: يجب أن يكون صحيحاً وفريداً
- **السعر**: يجب أن يكون موجباً
- **التواريخ**: يجب أن تكون منطقية
- **المعرفات**: UUIDs للخصوصية

## 📈 الأداء

### تحسينات مقترحة
1. **Partitioning**: تقسيم جدول الحجوزات حسب التاريخ
2. **Archiving**: أرشفة الحجوزات القديمة
3. **Caching**: تخزين مؤقت للعقارات الشائعة
4. **Connection Pooling**: تجميع الاتصالات

### مراقبة الأداء
```sql
-- استعلام بطيء
SELECT * FROM "Listing" WHERE category = 'villa' AND price < 100;

-- استعلام محسن
SELECT id, title, price, locationValue 
FROM "Listing" 
WHERE category = 'villa' AND price < 100 
ORDER BY createdAt DESC 
LIMIT 20;
```

## 🚀 النسخ الاحتياطي

### استراتيجية النسخ الاحتياطي
```bash
# نسخ احتياطي يومي
pg_dump -h localhost -U username -d cozy_db > backup_$(date +%Y%m%d).sql

# استعادة النسخ الاحتياطي
psql -h localhost -U username -d cozy_db < backup_20240115.sql
```

### استراتيجية الترحيل
```bash
# إنشاء ترحيل جديد
npx prisma migrate dev --name add_user_verification

# تطبيق الترحيلات في الإنتاج
npx prisma migrate deploy
```

## 📝 ملاحظات مهمة

1. **جميع المعرفات** من نوع UUID للخصوصية
2. **التواريخ** محفوظة بتوقيت UTC
3. **العلاقات** محمية بـ Foreign Key Constraints
4. **الحذف** يتم بـ Cascade Delete للحفاظ على سلامة البيانات
5. **البيانات الحساسة** مشفرة دائماً
