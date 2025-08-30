# 🏠 Cozy - منصة حجز العقارات

## 📋 نظرة عامة

**Cozy** هي منصة حجز عقارات متكاملة ومتطورة مبنية باستخدام أحدث التقنيات. تتيح للمستخدمين استكشاف وحجز العقارات في ليبيا مع دعم كامل للغة العربية والإنجليزية.

## ✨ الميزات الرئيسية

### 🏡 إدارة العقارات
- **إضافة وتعديل العقارات** مع صور متعددة
- **تصنيفات متنوعة** (فيلا، شقة، غرفة، إلخ)
- **فلترة متقدمة** (السعر، الموقع، عدد الغرف)
- **نظام المفضلة** لحفظ العقارات المفضلة

### 📅 نظام الحجز
- **حجز متقدم** مع اختيار التواريخ
- **حساب السعر التلقائي** حسب عدد الأيام
- **إدارة الحجوزات** للمستخدمين والملاك
- **تأكيد وإلغاء الحجوزات**

### 💳 المدفوعات
- **تكامل مع Stripe** للمدفوعات الآمنة
- **مدفوعات متعددة** (بطاقات ائتمان، محافظ إلكترونية)
- **فواتير PDF** تلقائية
- **تتبع حالة المدفوعات**

### 🌍 الدولية
- **دعم كامل للعربية والإنجليزية**
- **واجهة RTL/LTR** متجاوبة
- **ترجمة شاملة** لجميع النصوص
- **خطوط مخصصة** (Dubai للعربية)

### 🗺️ الخرائط والموقع
- **خرائط تفاعلية** باستخدام Leaflet
- **بحث المواقع** مع Google Places API
- **عرض العقارات** على الخريطة
- **توجيهات GPS** للمواقع

### 👥 نظام المستخدمين
- **مصادقة آمنة** مع NextAuth.js
- **أدوار مختلفة** (مستخدم، مالك، مدير)
- **ملفات شخصية** قابلة للتعديل
- **إدارة الحسابات** المتقدمة

### 📧 الإشعارات
- **إشعارات البريد الإلكتروني** للحجوزات
- **تأكيد الحجوزات** تلقائياً
- **إشعارات المدفوعات** والمدفوعات
- **إشعارات إدارية** للملاك

### 🎨 التصميم
- **تصميم متجاوب** لجميع الأجهزة
- **واجهة عصرية** مع Tailwind CSS
- **تحميل سريع** مع Next.js
- **تجربة مستخدم** محسنة

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 15** - إطار العمل الرئيسي
- **React 19** - مكتبة واجهة المستخدم
- **TypeScript** - لغة البرمجة الآمنة
- **Tailwind CSS** - إطار العمل للتصميم
- **React Hook Form** - إدارة النماذج
- **React Icons** - مكتبة الأيقونات

### Backend
- **Next.js API Routes** - واجهات برمجة التطبيقات
- **Prisma ORM** - إدارة قاعدة البيانات
- **PostgreSQL** - قاعدة البيانات الرئيسية
- **NextAuth.js** - نظام المصادقة
- **bcrypt** - تشفير كلمات المرور

### المدفوعات والخدمات
- **Stripe** - معالجة المدفوعات
- **Cloudinary** - إدارة الصور
- **Nodemailer** - إرسال البريد الإلكتروني
- **Leaflet** - الخرائط التفاعلية
- **Google Maps API** - خدمات الموقع

### الدولية والترجمة
- **i18next** - إدارة الترجمة
- **react-i18next** - تكامل React مع الترجمة
- **Custom Fonts** - خطوط مخصصة (Dubai)

### الأدوات المساعدة
- **Zustand** - إدارة الحالة
- **React Hot Toast** - الإشعارات
- **Date-fns** - معالجة التواريخ
- **Query String** - معالجة استعلامات URL

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js 18+ 
- npm أو yarn
- PostgreSQL database
- Stripe account
- Cloudinary account

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd cozy-project
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env.local
```

4. **تكوين قاعدة البيانات**
```bash
npx prisma generate
npx prisma db push
```

5. **تشغيل المشروع**
```bash
npm run dev
```

### متغيرات البيئة المطلوبة

```env
# Database
DATABASE_URL="postgresql://..."
DATABASE_DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email"
EMAIL_SERVER_PASSWORD="your-password"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
```

## 📁 هيكل المشروع

```
cozy-project/
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions
│   ├── admin/             # لوحة الإدارة
│   ├── api/               # API Routes
│   ├── components/        # مكونات React
│   ├── hooks/             # Custom Hooks
│   ├── libs/              # مكتبات مساعدة
│   ├── listings/          # صفحات العقارات
│   ├── reservations/      # صفحات الحجوزات
│   └── types/             # TypeScript Types
├── prisma/                # قاعدة البيانات
│   └── schema.prisma      # مخطط قاعدة البيانات
├── public/                # الملفات العامة
│   └── fonts/             # خطوط مخصصة
├── locales/               # ملفات الترجمة
└── docs/                  # التوثيق
```

## 🗄️ قاعدة البيانات

### النماذج الرئيسية

- **User** - المستخدمين
- **Listing** - العقارات
- **Reservation** - الحجوزات
- **Payment** - المدفوعات
- **Account** - حسابات المصادقة

### العلاقات
- المستخدم يمكنه إضافة عقارات متعددة
- العقار يمكن حجزه عدة مرات
- كل حجز مرتبط بدفع واحد أو أكثر
- نظام أدوار للمستخدمين (USER/ADMIN)

## 🔐 الأمان

- **مصادقة آمنة** مع NextAuth.js
- **تشفير كلمات المرور** مع bcrypt
- **JWT tokens** للجلسات
- **CSRF protection**
- **Rate limiting** على API
- **Input validation** مع Zod

## 📱 التصميم المتجاوب

- **Mobile-first** approach
- **Breakpoints** محسنة
- **Touch-friendly** interfaces
- **Fast loading** على جميع الأجهزة

## 🌍 الدعم الدولي

- **اللغة العربية** مع RTL
- **اللغة الإنجليزية** مع LTR
- **ترجمة شاملة** لجميع النصوص
- **خطوط مخصصة** لكل لغة

## 🚀 النشر

### Vercel (موصى به)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t cozy-app .
docker run -p 3000:3000 cozy-app
```

## 📊 الأداء

- **Next.js 15** مع App Router
- **Server-side rendering** للصفحات
- **Image optimization** تلقائي
- **Code splitting** تلقائي
- **Caching** محسن

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.
## 👨‍💻 المطور

**أحمد** - مطور Full Stack

- GitHub: [@ahmed](https://github.com/ahmed)
- LinkedIn: [أحمد](https://linkedin.com/in/ahmed)

## 🙏 الشكر

- [Next.js](https://nextjs.org/) - إطار العمل الرائع
- [Vercel](https://vercel.com/) - منصة النشر
- [Tailwind CSS](https://tailwindcss.com/) - إطار العمل للتصميم
- [Prisma](https://prisma.io/) - ORM الممتاز

---

**⭐ إذا أعجبك المشروع، لا تنس إعطاءه نجمة!**

