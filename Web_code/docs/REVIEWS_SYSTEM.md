# نظام التقييمات - Reviews System

## نظرة عامة

تم إضافة نظام تقييمات شامل للمشروع يسمح للمستخدمين بتقييم العقارات التي حجزوها. النظام يدعم اللغتين العربية والإنجليزية.

## الميزات

### ✅ الميزات المكتملة

1. **تقييم بالنجوم (1-5 نجوم)**
2. **تعليقات نصية اختيارية**
3. **متوسط التقييمات**
4. **عرض التقييمات في بطاقات العقارات**
5. **تعديل وحذف التقييمات**
6. **دعم اللغتين العربية والإنجليزية**
7. **واجهة مستخدم تفاعلية**

### 🔧 المكونات

#### 1. **StarRating Component**
- عرض النجوم التفاعلية
- دعم أحجام مختلفة (sm, md, lg)
- عرض النص الوصفي للتقييم
- وضع القراءة فقط

#### 2. **ReviewForm Component**
- نموذج إضافة/تعديل التقييمات
- التحقق من صحة البيانات
- دعم الترجمة
- عرض حالة التحميل

#### 3. **ReviewCard Component**
- عرض التقييم الفردي
- معلومات المستخدم
- تاريخ التقييم
- أزرار التعديل والحذف

#### 4. **ReviewsSection Component**
- القسم الرئيسي للتقييمات
- إدارة جميع التقييمات
- عرض متوسط التقييم
- إدارة النماذج

#### 5. **ReviewSummary Component**
- ملخص التقييمات في بطاقات العقارات
- متوسط التقييم وعدد التقييمات
- تحميل البيانات تلقائياً

### 🗄️ قاعدة البيانات

#### نموذج Review
```prisma
model Review {
  id          String   @id @default(uuid()) @map("_id") @db.Uuid
  listingId   String   @map("listing_id") @db.Uuid
  userId      String   @map("user_id") @db.Uuid
  rating      Int      // 1-5 stars
  comment     String?  // Optional comment
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  listing     Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([listingId, userId]) // One review per user per listing
  @@map("reviews")
}
```

### 🌐 API Endpoints

#### 1. **GET /api/listings/[listingId]/reviews**
- جلب جميع التقييمات لعقار معين
- ترتيب حسب التاريخ (الأحدث أولاً)

#### 2. **POST /api/listings/[listingId]/reviews**
- إنشاء تقييم جديد
- التحقق من عدم وجود تقييم سابق للمستخدم
- التحقق من صحة البيانات

#### 3. **PUT /api/reviews/[reviewId]**
- تحديث تقييم موجود
- التحقق من ملكية التقييم

#### 4. **DELETE /api/reviews/[reviewId]**
- حذف تقييم
- التحقق من ملكية التقييم

### 🎨 التصميم

#### الألوان المستخدمة
- **النجوم**: `text-yellow-400`
- **الخلفية الزرقاء للتقييم الشخصي**: `bg-blue-50`
- **الحدود**: `border-blue-200`

#### الأحجام
- **صغير (sm)**: `text-xs`, `w-3 h-3`
- **متوسط (md)**: `text-sm`, `w-4 h-4`
- **كبير (lg)**: `text-base`, `w-5 h-5`

### 🌍 الترجمة

#### المفاتيح الرئيسية
```json
{
  "reviews": {
    "title": "التقييمات",
    "no_reviews": "لا توجد تقييمات بعد",
    "be_first": "كن أول من يقيم هذا المكان",
    "average_rating": "متوسط التقييم",
    "total_reviews": "إجمالي التقييمات",
    "write_review": "اكتب تقييماً",
    "edit_review": "عدل تقييمك",
    "rating": "التقييم",
    "comment": "التعليق",
    "submit_review": "إرسال التقييم",
    "update_review": "تحديث التقييم",
    "delete_review": "حذف التقييم",
    "rating_required": "التقييم مطلوب",
    "comment_placeholder": "شارك تجربتك مع هذا المكان...",
    "comment_min_length": "يجب أن يكون التعليق 10 أحرف على الأقل",
    "stars": "نجوم",
    "star": "نجمة",
    "excellent": "ممتاز",
    "very_good": "جيد جداً",
    "good": "جيد",
    "fair": "مقبول",
    "poor": "ضعيف"
  }
}
```

### 🔒 الأمان

1. **التحقق من المستخدم**: جميع العمليات تتطلب تسجيل دخول
2. **ملكية التقييم**: المستخدم يمكنه تعديل/حذف تقييمه فقط
3. **تقييم واحد لكل مستخدم**: لا يمكن تقييم نفس العقار مرتين
4. **التحقق من البيانات**: التحقق من صحة التقييم والتعليق

### 📱 الاستخدام

#### في صفحة العقار
```tsx
<ReviewsSection
  listingId={listing.id}
  currentUser={currentUser}
  isOwner={isOwner}
/>
```

#### في بطاقة العقار
```tsx
<ReviewSummary listingId={data.id} size="sm" />
```

### 🚀 التطوير المستقبلي

#### الميزات المقترحة
1. **تصفية التقييمات** (حسب التقييم، التاريخ)
2. **ردود المضيف** على التقييمات
3. **صور من الضيوف** في التقييمات
4. **تقييمات مفصلة** (النظافة، الموقع، إلخ)
5. **إشعارات** عند تلقي تقييم جديد
6. **تصدير التقييمات** (PDF, Excel)

#### التحسينات التقنية
1. **التخزين المؤقت** للتقييمات
2. **Pagination** للتقييمات الكثيرة
3. **Real-time updates** باستخدام WebSockets
4. **تحليل التقييمات** وإحصائيات مفصلة

### 📋 قائمة الملفات

```
app/
├── components/
│   ├── StarRating.tsx
│   ├── ReviewForm.tsx
│   ├── ReviewCard.tsx
│   ├── ReviewsSection.tsx
│   └── ReviewSummary.tsx
├── api/
│   ├── listings/[listingId]/reviews/
│   │   └── route.ts
│   └── reviews/[reviewId]/
│       └── route.ts
└── types/
    └── index.ts (SafeReview type)

prisma/
└── schema.prisma (Review model)

locales/
├── en/common.json (reviews translations)
└── ar/common.json (reviews translations)
```

### 🔧 التثبيت والتشغيل

1. **تطبيق Migration**:
   ```bash
   npx prisma migrate dev --name add_reviews
   ```

2. **تحديث Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **إعادة تشغيل الخادم**:
   ```bash
   npm run dev
   ```

### 🐛 استكشاف الأخطاء

#### مشاكل شائعة
1. **خطأ في Migration**: تأكد من تحديث Prisma Client
2. **خطأ في الترجمة**: تحقق من وجود جميع مفاتيح الترجمة
3. **خطأ في API**: تحقق من صحة البيانات المرسلة

#### سجلات التصحيح
- جميع العمليات مسجلة في console
- أخطاء API مسجلة في الخادم
- أخطاء الترجمة مسجلة في المتصفح

