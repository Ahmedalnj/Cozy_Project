# 📚 التوثيق - Cozy

مرحباً بك في مجلد التوثيق الخاص بمشروع Cozy! هذا المجلد يحتوي على جميع الوثائق التقنية والمفصلة للمشروع.

## 📋 محتويات التوثيق

### 🔧 الوثائق التقنية

#### [API Documentation](./API_DOCUMENTATION.md)
- وثائق شاملة لجميع واجهات برمجة التطبيقات (APIs)
- أمثلة على الاستخدام
- رموز الحالة والأخطاء
- معايير الأمان

#### [Database Schema](./DATABASE_SCHEMA.md)
- مخطط قاعدة البيانات المفصل
- العلاقات بين الجداول
- الفهارس والتحسينات
- استراتيجيات النسخ الاحتياطي

#### [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- دليل النشر على مختلف المنصات
- إعداد Docker و Kubernetes
- إعداد SSL/HTTPS
- مراقبة الأداء

### 🚀 أدلة التطوير

#### [Contributing Guide](../CONTRIBUTING.md)
- كيفية المساهمة في المشروع
- معايير الكود
- عملية Pull Request
- الاختبارات

#### [Changelog](../CHANGELOG.md)
- سجل جميع التغييرات
- إصدارات المشروع
- الميزات الجديدة والإصلاحات

## 🎯 كيفية استخدام التوثيق

### للمطورين الجدد
1. ابدأ بقراءة [API Documentation](./API_DOCUMENTATION.md)
2. تعرف على [Database Schema](./DATABASE_SCHEMA.md)
3. اقرأ [Contributing Guide](../CONTRIBUTING.md)

### للمطورين المتمرسين
1. راجع [Deployment Guide](./DEPLOYMENT_GUIDE.md)
2. تحقق من [Changelog](../CHANGELOG.md)
3. اطلع على التحسينات المقترحة

### للمديرين
1. راجع [Deployment Guide](./DEPLOYMENT_GUIDE.md)
2. اطلع على [Database Schema](./DATABASE_SCHEMA.md)
3. تحقق من متطلبات الأمان

## 📖 هيكل التوثيق

```
docs/
├── README.md                    # هذا الملف
├── API_DOCUMENTATION.md         # وثائق API
├── DATABASE_SCHEMA.md           # مخطط قاعدة البيانات
└── DEPLOYMENT_GUIDE.md          # دليل النشر

../
├── README.md                    # README الرئيسي
├── CONTRIBUTING.md              # دليل المساهمة
├── CHANGELOG.md                 # سجل التغييرات
├── LICENSE                      # رخصة المشروع
├── Dockerfile                   # ملف Docker
├── docker-compose.yml           # إعداد Docker Compose
├── nginx.conf                   # إعداد Nginx
├── env.example                  # مثال متغيرات البيئة
└── .gitignore                   # ملف Git Ignore
```

## 🔍 البحث في التوثيق

### البحث السريع
- **API**: ابحث عن "API" للعثور على وثائق واجهات برمجة التطبيقات
- **Database**: ابحث عن "Database" للعثور على وثائق قاعدة البيانات
- **Deploy**: ابحث عن "Deploy" للعثور على أدلة النشر
- **Security**: ابحث عن "Security" للعثور على معلومات الأمان

### البحث المتقدم
```bash
# البحث في جميع الملفات
grep -r "keyword" docs/

# البحث في ملف محدد
grep "keyword" docs/API_DOCUMENTATION.md
```

## 📝 تحديث التوثيق

### عند إضافة ميزة جديدة
1. حدث [API Documentation](./API_DOCUMENTATION.md)
2. حدث [Database Schema](./DATABASE_SCHEMA.md) إذا لزم الأمر
3. حدث [Changelog](../CHANGELOG.md)
4. حدث هذا الملف إذا لزم الأمر

### عند إصلاح خطأ
1. حدث [Changelog](../CHANGELOG.md)
2. حدث الوثائق ذات الصلة
3. أضف أمثلة على الإصلاح إذا لزم الأمر

## 🎨 تنسيق التوثيق

### معايير الكتابة
- استخدم اللغة العربية للتوثيق
- اكتب بوضوح وبساطة
- أضف أمثلة عملية
- استخدم الرموز التعبيرية للتنظيم

### تنسيق الكود
```markdown
```javascript
// مثال على الكود
const example = () => {
  console.log("Hello World");
};
```

```bash
# مثال على الأوامر
npm install
npm run dev
```
```

### الروابط
```markdown
[نص الرابط](./اسم_الملف.md)
[رابط خارجي](https://example.com)
```

## 🔗 روابط مفيدة

### داخل المشروع
- [الملف الرئيسي](../README.md)
- [دليل المساهمة](../CONTRIBUTING.md)
- [سجل التغييرات](../CHANGELOG.md)

### خارج المشروع
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📞 الدعم

إذا كنت بحاجة إلى مساعدة في التوثيق:

1. **تحقق من هذا الملف أولاً**
2. **ابحث في الوثائق الموجودة**
3. **افتح Issue جديد** إذا لم تجد الإجابة
4. **راسل المطورين** للحصول على مساعدة إضافية

## 🤝 المساهمة في التوثيق

نرحب بمساهماتك في تحسين التوثيق! يمكنك:

- إضافة أمثلة جديدة
- تحسين الوضوح
- إضافة أقسام جديدة
- تصحيح الأخطاء
- ترجمة الوثائق

### كيفية المساهمة
1. اقرأ [دليل المساهمة](../CONTRIBUTING.md)
2. أنشئ branch جديد
3. أضف تحسيناتك
4. أنشئ Pull Request

---

**شكراً لقراءة التوثيق! 📚**

إذا وجدت هذا التوثيق مفيداً، لا تنس إعطاء المشروع نجمة على GitHub! ⭐


