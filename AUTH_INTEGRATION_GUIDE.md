# دليل ربط تطبيق Flutter مع Backend المشروع

## 📋 نظرة عامة

تم ربط تطبيق Flutter مع backend المشروع بنجاح. هذا الدليل يوضح كيفية استخدام النظام الجديد والميزات المضافة.

## 🚀 الميزات المضافة

### 1. نظام المصادقة المتكامل
- ✅ تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- ✅ إنشاء حساب جديد
- ✅ تسجيل الدخول بـ Google
- ✅ استعادة كلمة المرور
- ✅ إدارة الجلسات والتوكن

### 2. إدارة الحالة
- ✅ AuthProvider لإدارة حالة المصادقة
- ✅ حفظ البيانات محلياً
- ✅ التوجيه التلقائي بناءً على حالة المصادقة

### 3. الترجمة والدعم اللغوي
- ✅ دعم اللغتين العربية والإنجليزية
- ✅ خط Dubai للعربية
- ✅ رسائل مترجمة

### 4. الأمان
- ✅ تخزين آمن للتوكن
- ✅ التحقق من صحة البيانات
- ✅ إدارة الجلسات

## 📁 الملفات الجديدة

### 1. `lib/models/user_model.dart`
نموذج بيانات المستخدم مع جميع الحقول المطلوبة.

### 2. `lib/providers/auth_provider.dart`
Provider لإدارة حالة المصادقة في التطبيق.

### 3. `lib/features/auth/forgot_password_screen.dart`
واجهة استعادة كلمة المرور مع التصميم المطابق.

### 4. `lib/core/translations.dart`
ملف الترجمة ليدعم اللغتين العربية والإنجليزية.

### 5. `lib/core/app_config.dart`
ملف إعدادات التطبيق لإدارة المتغيرات البيئية.

## 🔧 التحديثات على الملفات الموجودة

### 1. `pubspec.yaml`
- إضافة dependencies جديدة
- إعداد خط Dubai
- إضافة حزم الأمان والتصميم

### 2. `lib/core/api_service.dart`
- إضافة دوال استعادة كلمة المرور
- تحديث endpoints ليطابق backend
- إضافة دوال تحديث الملف الشخصي

### 3. `lib/features/auth/login_screen.dart`
- ربط مع AuthProvider
- إضافة رابط استعادة كلمة المرور
- تحسين رسائل الخطأ والنجاح

### 4. `lib/features/auth/signup_screen.dart`
- ربط مع AuthProvider
- تحسين التحقق من صحة البيانات
- رسائل مترجمة

### 5. `lib/main.dart`
- إضافة AuthProvider إلى MultiProvider
- تحسين إدارة الحالة

## 🌐 API Endpoints

### المصادقة
```
POST /api/auth/signin - تسجيل الدخول
POST /api/register - إنشاء حساب
POST /api/resetpassword - استعادة كلمة المرور
POST /api/resetpassword/verify - التحقق من كود الاستعادة
POST /api/resetpassword/updatepassword - تحديث كلمة المرور
```

### الملف الشخصي
```
GET /api/user/profile - الحصول على الملف الشخصي
PUT /api/user/profile - تحديث الملف الشخصي
```

## 🔒 الأمان

### تخزين التوكن
- استخدام `flutter_secure_storage` للتخزين الآمن
- تشفير البيانات الحساسة
- إدارة الجلسات بشكل آمن

### التحقق من صحة البيانات
- التحقق من صحة البريد الإلكتروني
- التحقق من قوة كلمة المرور
- التحقق من تطابق كلمات المرور

## 🎨 التصميم

### الخطوط
- خط Dubai للعربية
- خط Roboto كخط احتياطي
- أحجام خطوط متناسقة

### الألوان
- نظام ألوان موحد
- دعم الوضع المظلم
- ألوان متجاوبة

## 📱 الاستخدام

### 1. تسجيل الدخول
```dart
final authProvider = Provider.of<AuthProvider>(context, listen: false);
final success = await authProvider.login(email, password);
```

### 2. إنشاء حساب
```dart
final authProvider = Provider.of<AuthProvider>(context, listen: false);
final success = await authProvider.signup(name, email, password);
```

### 3. استعادة كلمة المرور
```dart
final authProvider = Provider.of<AuthProvider>(context, listen: false);
final success = await authProvider.forgotPassword(email);
```

### 4. تسجيل الخروج
```dart
final authProvider = Provider.of<AuthProvider>(context, listen: false);
await authProvider.logout();
```

## ⚙️ الإعداد

### 1. تغيير عنوان Backend
في ملف `lib/core/app_config.dart`:
```dart
static const String baseUrl = 'https://your-backend-domain.com/api';
```

### 2. إعداد خط Dubai
تأكد من وجود ملفات الخط في `assets/fonts/`:
- Dubai-Regular.ttf
- Dubai-Bold.ttf
- Dubai-Medium.ttf
- Dubai-Light.ttf

### 3. إعداد Google Sign-In
في ملف `android/app/build.gradle`:
```gradle
defaultConfig {
    // ...
    resValue "string", "default_web_client_id", "your-web-client-id"
}
```

## 🧪 الاختبار

### 1. اختبار تسجيل الدخول
- اختبار البريد الإلكتروني وكلمة المرور الصحيحة
- اختبار البيانات غير الصحيحة
- اختبار الاتصال بالإنترنت

### 2. اختبار إنشاء الحساب
- اختبار البيانات الصحيحة
- اختبار البريد الإلكتروني المكرر
- اختبار كلمة المرور الضعيفة

### 3. اختبار استعادة كلمة المرور
- اختبار إرسال رمز التحقق
- اختبار التحقق من الرمز
- اختبار تحديث كلمة المرور

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في الاتصال بالـ API**
   - تأكد من صحة عنوان Backend
   - تأكد من تشغيل الخادم
   - تحقق من إعدادات الشبكة

2. **خطأ في التخزين**
   - تأكد من صلاحيات التطبيق
   - تحقق من مساحة التخزين
   - أعد تشغيل التطبيق

3. **خطأ في الترجمة**
   - تأكد من وجود ملفات الترجمة
   - تحقق من إعدادات اللغة
   - أعد تشغيل التطبيق

## 📈 التحسينات المستقبلية

### الميزات المقترحة
- [ ] دعم تسجيل الدخول بـ Apple
- [ ] المصادقة البيومترية
- [ ] إشعارات Push
- [ ] وضع عدم الاتصال
- [ ] النسخ الاحتياطي التلقائي

### التحسينات التقنية
- [ ] تحسين الأداء
- [ ] تقليل حجم التطبيق
- [ ] تحسين الأمان
- [ ] إضافة اختبارات وحدة

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك أسئلة، يرجى التواصل مع فريق التطوير.

---

**ملاحظة**: تأكد من تحديث عنوان Backend في ملف `app_config.dart` قبل النشر.
