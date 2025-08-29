# 🤝 دليل المساهمة - Cozy

## 📋 نظرة عامة

شكراً لاهتمامك بالمساهمة في مشروع Cozy! هذا الدليل يوضح كيفية المساهمة في المشروع بشكل فعال.

## 🎯 أنواع المساهمات

### 🐛 إصلاح الأخطاء
- إصلاح أخطاء في الكود
- تحسين الأداء
- إصلاح مشاكل الأمان

### ✨ ميزات جديدة
- إضافة ميزات جديدة
- تحسين الواجهة
- إضافة وظائف جديدة

### 📚 تحسين التوثيق
- تحسين README
- إضافة أمثلة
- تحديث الوثائق

### 🧪 اختبارات
- إضافة اختبارات جديدة
- تحسين تغطية الاختبارات
- إصلاح اختبارات فاشلة

## 🚀 كيفية البدء

### 1. Fork المشروع
1. اذهب إلى [GitHub Repository](https://github.com/username/cozy-project)
2. اضغط على زر "Fork" في الأعلى
3. انتظر حتى يتم إنشاء نسخة في حسابك

### 2. Clone النسخة المحلية
```bash
git clone https://github.com/YOUR_USERNAME/cozy-project.git
cd cozy-project
```

### 3. إعداد البيئة المحلية
```bash
# تثبيت التبعيات
npm install

# نسخ ملف البيئة
cp env.example .env.local

# إعداد قاعدة البيانات
npx prisma generate
npx prisma db push

# تشغيل المشروع
npm run dev
```

### 4. إنشاء Branch جديد
```bash
git checkout -b feature/amazing-feature
# أو
git checkout -b fix/bug-fix
```

## 📝 معايير الكود

### TypeScript
- استخدم TypeScript لجميع الملفات الجديدة
- حدد أنواع البيانات بوضوح
- تجنب استخدام `any`

### React/Next.js
- استخدم Functional Components
- استخدم Hooks بدلاً من Class Components
- اتبع قواعد Next.js 13+ App Router

### التسمية
```typescript
// ✅ صحيح
const UserProfile = () => { ... }
const handleSubmit = () => { ... }
const userData = { ... }

// ❌ خطأ
const user_profile = () => { ... }
const Submit = () => { ... }
const data = { ... }
```

### التعليقات
```typescript
/**
 * حساب السعر الإجمالي للحجز
 * @param price - السعر لليلة الواحدة
 * @param days - عدد الأيام
 * @returns السعر الإجمالي
 */
const calculateTotalPrice = (price: number, days: number): number => {
  return price * days;
};
```

### CSS/Tailwind
- استخدم Tailwind CSS للتصميم
- تجنب CSS مخصص إلا عند الضرورة
- استخدم متغيرات CSS للمواضيع

## 🧪 الاختبارات

### إضافة اختبارات جديدة
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('should render button with correct text', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const mockClick = jest.fn();
    render(<Button label="Click me" onClick={mockClick} />);
    screen.getByText('Click me').click();
    expect(mockClick).toHaveBeenCalled();
  });
});
```

### تشغيل الاختبارات
```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل الاختبارات مع التغطية
npm run test:coverage

# تشغيل اختبارات محددة
npm test -- --testNamePattern="Button"
```

## 📝 Commit Messages

### تنسيق Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```

### أنواع Commits
- `feat`: ميزة جديدة
- `fix`: إصلاح خطأ
- `docs`: تحديث التوثيق
- `style`: تغييرات في التنسيق
- `refactor`: إعادة هيكلة الكود
- `test`: إضافة أو تحديث الاختبارات
- `chore`: مهام الصيانة

### أمثلة
```bash
feat(auth): add email verification
fix(payment): resolve stripe webhook issue
docs(readme): update installation instructions
style(ui): improve button hover effects
refactor(api): simplify reservation logic
test(components): add Button component tests
chore(deps): update dependencies
```

## 🔄 Pull Request Process

### 1. تحديث Branch
```bash
git fetch origin
git rebase origin/main
```

### 2. اختبار التغييرات
```bash
# تشغيل الاختبارات
npm test

# فحص TypeScript
npm run type-check

# فحص ESLint
npm run lint

# بناء المشروع
npm run build
```

### 3. إنشاء Pull Request
1. اذهب إلى GitHub Repository
2. اضغط على "Compare & pull request"
3. املأ النموذج:
   - **العنوان**: وصف مختصر للتغييرات
   - **الوصف**: شرح مفصل للتغييرات
   - **النوع**: اختر نوع التغيير
   - **الاختبارات**: اذكر الاختبارات التي أجريتها

### 4. نموذج Pull Request
```markdown
## 📋 وصف التغييرات
إضافة ميزة التحقق من البريد الإلكتروني للمستخدمين الجدد.

## 🎯 نوع التغيير
- [ ] إصلاح خطأ
- [x] ميزة جديدة
- [ ] تحسين الأداء
- [ ] تحديث التوثيق

## 🧪 الاختبارات
- [x] تم اختبار الميزة محلياً
- [x] تم تشغيل الاختبارات
- [x] تم فحص TypeScript
- [x] تم فحص ESLint

## 📸 لقطات شاشة (إن وجدت)
![صورة الميزة الجديدة](url)

## 📝 ملاحظات إضافية
أي معلومات إضافية مهمة للمراجعين.
```

## 🔍 مراجعة الكود

### معايير المراجعة
- **الوظائف**: هل الكود يعمل كما هو متوقع؟
- **الأداء**: هل هناك تأثير على الأداء؟
- **الأمان**: هل هناك مشاكل أمنية؟
- **القابلية للقراءة**: هل الكود واضح ومفهوم؟
- **الاختبارات**: هل تم إضافة اختبارات مناسبة؟

### تعليقات المراجعة
```markdown
## ✅ إيجابيات
- الكود واضح ومنظم
- الاختبارات شاملة
- التوثيق جيد

## 🔧 اقتراحات للتحسين
- يمكن تحسين الأداء باستخدام `useMemo`
- إضافة معالجة الأخطاء
- تحسين رسائل الخطأ

## ❌ مشاكل
- خطأ في TypeScript
- اختبار فاشل
- مشكلة في الأداء
```

## 🚨 الإبلاغ عن الأخطاء

### نموذج الإبلاغ عن الأخطاء
```markdown
## 🐛 وصف الخطأ
وصف واضح ومختصر للخطأ.

## 🔄 خطوات إعادة الإنتاج
1. اذهب إلى '...'
2. اضغط على '...'
3. انتقل إلى '...'
4. شاهد الخطأ

## 📱 المتوقع
ما كان يجب أن يحدث.

## 📱 ما حدث فعلاً
ما حدث بالفعل.

## 🖥️ معلومات النظام
- نظام التشغيل: [مثل Windows 10]
- المتصفح: [مثل Chrome 91]
- الإصدار: [مثل 1.0.0]

## 📸 لقطات شاشة
![صورة الخطأ](url)

## 📝 معلومات إضافية
أي معلومات أخرى مفيدة.
```

## 🎉 الاعتراف بالمساهمات

### أنواع المساهمين
- **المساهمون**: من ساهموا في الكود
- **المراجعون**: من راجعوا الكود
- **المختبرون**: من اختبروا الميزات
- **الموثقون**: من حسّنوا التوثيق

### شكر المساهمين
```markdown
## 🙏 شكراً للمساهمين
- @username - إضافة ميزة التحقق من البريد
- @username - إصلاح مشكلة في الدفع
- @username - تحسين الأداء
```

## 📞 التواصل

### قنوات التواصل
- **GitHub Issues**: للإبلاغ عن الأخطاء والميزات
- **GitHub Discussions**: للمناقشات العامة
- **Email**: للتواصل الخاص

### قواعد التواصل
- كن محترماً ومهذباً
- استخدم لغة واضحة ومفهومة
- قدم اقتراحات بناءة
- تجنب التعليقات السلبية

## 📄 الترخيص

بالمساهمة في هذا المشروع، توافق على أن مساهماتك ستكون مرخصة تحت نفس رخصة المشروع (MIT).

## 🎯 أهداف المشروع

### الأهداف قصيرة المدى
- [ ] إضافة اختبارات شاملة
- [ ] تحسين الأداء
- [ ] إضافة ميزات جديدة

### الأهداف طويلة المدى
- [ ] دعم المزيد من اللغات
- [ ] إضافة تطبيق موبايل
- [ ] تحسين تجربة المستخدم

---

**شكراً لمساهمتك في جعل Cozy أفضل! 🚀**

