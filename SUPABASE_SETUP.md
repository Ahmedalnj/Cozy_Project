# 🔧 إعداد Supabase للتطبيق

## 📋 الخطوات المطلوبة:

### 1. الحصول على بيانات Supabase:
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك أو أنشئ مشروع جديد
3. اذهب إلى **Settings** > **API**
4. انسخ:
   - **Project URL**
   - **anon public** key

### 2. تحديث الإعدادات في التطبيق:
افتح ملف `lib/core/supabase_config.dart` وقم بتحديث:

```dart
class SupabaseConfig {
  static const String url = 'https://your-project.supabase.co'; // Project URL
  static const String anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // anon key
}
```

### 3. إعداد Authentication في Supabase:
1. اذهب إلى **Authentication** > **Settings**
2. في **Site URL** أضف: `io.supabase.flutter://login-callback/`
3. في **Redirect URLs** أضف: `io.supabase.flutter://login-callback/`

### 4. إعداد Google OAuth (اختياري):
1. اذهب إلى **Authentication** > **Providers**
2. فعّل **Google**
3. أضف **Client ID** و **Client Secret** من Google Cloud Console

### 5. إنشاء جداول قاعدة البيانات:
استخدم ملف `database_schema.sql` الموجود في المشروع لإنشاء الجداول.

## ✅ اختبار التطبيق:
1. شغل التطبيق: `flutter run`
2. جرب تسجيل الدخول وإنشاء حساب جديد
3. تأكد من أن البيانات تُحفظ في Supabase

## 🔍 استكشاف الأخطاء:
- تأكد من صحة URL و anon key
- تحقق من إعدادات Authentication
- راجع console logs للأخطاء

## 📞 الدعم:
إذا واجهت مشاكل، تحقق من:
- [Supabase Documentation](https://supabase.com/docs)
- [Flutter Supabase Package](https://pub.dev/packages/supabase_flutter)
