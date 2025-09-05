# نظام إدارة المضيف - دليل التنفيذ

## نظرة عامة

تم تنفيذ نظام شامل لإدارة المضيفين في مشروع Cozy، يتيح للمستخدمين التقدم بطلب للانضمام كمضيفين مع إدارة كاملة من قبل المديرين.

## المكونات المنفذة

### 1. قاعدة البيانات

تم تحديث Prisma schema ليشمل:

```prisma
model User {
  // ... الحقول الموجودة
  hostStatus     HostStatus    @default(NOT_REQUESTED)
  hostRequests   HostRequest[]
}

model HostRequest {
  id        String     @id @default(uuid())
  userId    String     @db.Uuid
  status    HostStatus @default(PENDING)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  fullName  String?
  phone     String?
  idCardUrl String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum HostStatus {
  NOT_REQUESTED
  PENDING
  APPROVED
  REJECTED
}
```

### 2. المكونات الأمامية

#### `SwitchToHostingButton`
- زر ذكي يتغير حسب حالة المستخدم
- يفتح مودال الطلب للمستخدمين الجدد
- يعرض رسائل مناسبة لكل حالة

#### `HostRequestModal`
- نموذج مبسط لطلب المضيف
- يحتوي على: الاسم الكامل، رقم الهاتف، رابط بطاقة الهوية
- تحقق من صحة البيانات

#### `HostStatusIndicator`
- عرض بصري لحالة المضيف
- ألوان وأيقونات مختلفة لكل حالة

#### `HostModeToggle`
- للتبديل بين وضع الضيف والمضيف
- متاح فقط للمضيفين المعتمدين

#### `HostAccessControl`
- مكون حماية للصفحات المخصصة للمضيفين
- يتحقق من حالة المستخدم ويعيد التوجيه عند الحاجة

### 3. API Endpoints

#### `POST /api/host-request`
- إنشاء طلب مضيف جديد
- تحديث حالة المستخدم إلى PENDING

#### `GET /api/admin/host-requests`
- جلب جميع طلبات المضيف للمديرين

#### `POST /api/admin/host-requests/approve`
- الموافقة على طلب مضيف
- تحديث حالة الطلب والمستخدم

#### `POST /api/admin/host-requests/reject`
- رفض طلب مضيف
- تحديث حالة الطلب والمستخدم

### 4. لوحة الإدارة

#### صفحة طلبات المضيف (`/admin/host-requests`)
- عرض جميع الطلبات في جدول منظم
- أزرار الموافقة والرفض للطلبات المعلقة
- عرض تفاصيل المستخدم والطلب

## كيفية الاستخدام

### للمستخدمين العاديين

1. **التقدم بطلب المضيف**:
   ```tsx
   import { SwitchToHostingButton } from "@/app/components/ui";
   
   <SwitchToHostingButton 
     hostStatus={currentUser.hostStatus} 
     className="w-full"
   />
   ```

2. **عرض حالة المضيف**:
   ```tsx
   import { HostStatusIndicator } from "@/app/components/ui";
   
   <HostStatusIndicator 
     hostStatus={currentUser.hostStatus} 
   />
   ```

### للمضيفين المعتمدين

1. **التبديل بين الأوضاع**:
   ```tsx
   import { HostModeToggle } from "@/app/components/ui";
   
   <HostModeToggle 
     currentUser={currentUser} 
     className="mb-4"
   />
   ```

2. **حماية الصفحات**:
   ```tsx
   import { HostAccessControl } from "@/app/components/ui";
   
   <HostAccessControl currentUser={currentUser}>
     <div>محتوى الصفحة المخصصة للمضيفين</div>
   </HostAccessControl>
   ```

### للمديرين

1. **إضافة رابط طلبات المضيف**:
   تم إضافته تلقائياً إلى Sidebar

2. **إدارة الطلبات**:
   - الوصول إلى `/admin/host-requests`
   - مراجعة الطلبات المعلقة
   - الموافقة أو الرفض

## تدفق العمل

1. **المستخدم الجديد**: `NOT_REQUESTED` → يرى زر "التحول إلى المضيف"
2. **تقديم الطلب**: `PENDING` → يرى رسالة "طلب قيد المراجعة"
3. **مراجعة المدير**: يمكن الموافقة أو الرفض
4. **الموافقة**: `APPROVED` → يمكن التبديل بين الأوضاع
5. **الرفض**: `REJECTED` → رسالة خطأ مع إرشادات

## الأمان والتحكم

- جميع API endpoints محمية بالتحقق من الدور
- التحقق من حالة المستخدم قبل الوصول للصفحات
- رسائل خطأ واضحة ومفيدة
- تسجيل جميع العمليات

## التخصيص والتطوير

### إضافة حقول جديدة
1. تحديث Prisma schema
2. تحديث HostRequestModal
3. تحديث API endpoints
4. تحديث جدول الإدارة

### إضافة حالات جديدة
1. تحديث enum HostStatus
2. تحديث المكونات لمعالجة الحالة الجديدة
3. تحديث رسائل الخطأ

### إضافة منطق العمل
1. تحديث API endpoints
2. إضافة validation rules
3. تحديث رسائل المستخدم

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في Prisma**: تأكد من تشغيل `prisma generate` بعد تحديث schema
2. **خطأ في API**: تحقق من console للتفاصيل
3. **مشاكل في الواجهة**: تأكد من استيراد المكونات بشكل صحيح

### نصائح للتطوير

1. استخدم TypeScript للتحقق من الأنواع
2. اختبر جميع الحالات (NOT_REQUESTED, PENDING, APPROVED, REJECTED)
3. تأكد من تحديث قاعدة البيانات بعد التغييرات
4. استخدم toast messages للتأكد من نجاح العمليات

## الخلاصة

تم تنفيذ نظام شامل ومتكامل لإدارة المضيفين يوفر:

- ✅ تجربة مستخدم سلسة
- ✅ إدارة كاملة من لوحة التحكم
- ✅ أمان عالي مع التحكم في الوصول
- ✅ تصميم متجاوب ومتعدد اللغات
- ✅ قابلية التوسع والتخصيص

النظام جاهز للاستخدام ويمكن تخصيصه حسب احتياجات المشروع.






