import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user_model.dart';

class AuthService {
  static final SupabaseClient _supabase = Supabase.instance.client;

  // تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
  static Future<AuthResponse> signInWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );
      return response;
    } catch (error) {
      throw _handleAuthError(error);
    }
  }

  // إنشاء حساب جديد
  static Future<AuthResponse> signUpWithEmail({
    required String email,
    required String password,
    Map<String, dynamic>? userData,
  }) async {
    try {
      final response = await _supabase.auth.signUp(
        email: email,
        password: password,
        data: userData,
      );

      // إنشاء سجل في جدول User
      if (response.user != null) {
        await _createUserRecord(response.user!, userData);
      }

      return response;
    } catch (error) {
      throw _handleAuthError(error);
    }
  }

  // إنشاء حساب بدون تأكيد البريد (للتطوير)
  static Future<AuthResponse> signUpWithoutEmailConfirmation({
    required String email,
    required String password,
    Map<String, dynamic>? userData,
  }) async {
    try {
      // أولاً إنشاء الحساب
      final signUpResponse = await _supabase.auth.signUp(
        email: email,
        password: password,
        data: userData,
      );

      // إنشاء سجل في جدول User
      if (signUpResponse.user != null) {
        await _createUserRecord(signUpResponse.user!, userData);

        // محاولة تسجيل الدخول مباشرة (للتطوير فقط)
        try {
          final signInResponse = await _supabase.auth.signInWithPassword(
            email: email,
            password: password,
          );
          return signInResponse;
        } catch (signInError) {
          // إذا فشل تسجيل الدخول، نعيد استجابة التسجيل
          return signUpResponse;
        }
      }

      return signUpResponse;
    } catch (error) {
      throw _handleAuthError(error);
    }
  }

  // إنشاء سجل في جدول User
  static Future<void> _createUserRecord(
      User user, Map<String, dynamic>? userData) async {
    try {
      await _supabase.from('User').insert({
        '_id': user.id,
        'email': user.email,
        'name': userData?['name'] ?? user.userMetadata?['name'],
        'createdAt': DateTime.now().toIso8601String(),
        'updatedAt': DateTime.now().toIso8601String(),
        'role': 'USER',
      });
    } catch (error) {
      print('Error creating user record: $error');
    }
  }

  // الحصول على بيانات المستخدم من جدول User
  static Future<UserModel?> getUserProfile(String userId) async {
    try {
      final response =
          await _supabase.from('User').select().eq('_id', userId).single();

      return UserModel.fromJson(response);
    } catch (error) {
      print('Error fetching user profile: $error');
      return null;
    }
  }

  // تحديث بيانات المستخدم
  static Future<void> updateUserProfile(
      String userId, Map<String, dynamic> updates) async {
    try {
      await _supabase.from('User').update({
        ...updates,
        'updatedAt': DateTime.now().toIso8601String(),
      }).eq('_id', userId);
    } catch (error) {
      throw _handleAuthError(error);
    }
  }

  // تسجيل الخروج
  static Future<void> signOut() async {
    try {
      await _supabase.auth.signOut();
    } catch (error) {
      throw _handleAuthError(error);
    }
  }

  // الحصول على المستخدم الحالي
  static User? getCurrentUser() {
    return _supabase.auth.currentUser;
  }

  // التحقق من حالة المصادقة
  static Stream<AuthState> get authStateChanges {
    return _supabase.auth.onAuthStateChange;
  }

  // إرسال رابط إعادة تعيين كلمة المرور
  static Future<void> resetPassword(String email) async {
    try {
      await _supabase.auth.resetPasswordForEmail(email);
    } catch (error) {
      throw _handleAuthError(error);
    }
  }

  // تحديث كلمة المرور
  static Future<void> updatePassword(String newPassword) async {
    try {
      await _supabase.auth.updateUser(
        UserAttributes(password: newPassword),
      );
    } catch (error) {
      throw _handleAuthError(error);
    }
  }

  // إضافة/إزالة من المفضلة
  static Future<void> toggleFavorite(String userId, String propertyId) async {
    try {
      final user = await getUserProfile(userId);
      if (user == null) return;

      List<String> favorites = List<String>.from(user.favoriteIds ?? []);

      if (favorites.contains(propertyId)) {
        favorites.remove(propertyId);
      } else {
        favorites.add(propertyId);
      }

      await updateUserProfile(userId, {
        'favoriteIds': favorites,
      });
    } catch (error) {
      throw _handleAuthError(error);
    }
  }

  // التحقق من وجود العقار في المفضلة
  static Future<bool> isFavorite(String userId, String propertyId) async {
    try {
      final user = await getUserProfile(userId);
      if (user == null) return false;

      return user.favoriteIds?.contains(propertyId) ?? false;
    } catch (error) {
      return false;
    }
  }

  // الحصول على قائمة المفضلة
  static Future<List<String>> getFavorites(String userId) async {
    try {
      final user = await getUserProfile(userId);
      return user?.favoriteIds ?? [];
    } catch (error) {
      return [];
    }
  }

  // معالجة أخطاء المصادقة
  static String _handleAuthError(dynamic error) {
    if (error is AuthException) {
      switch (error.message) {
        case 'Invalid login credentials':
          return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        case 'Email not confirmed':
          return 'يرجى تأكيد بريدك الإلكتروني أولاً';
        case 'User already registered':
          return 'هذا البريد الإلكتروني مسجل بالفعل';
        case 'Password should be at least 6 characters':
          return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        case 'Unable to validate email address: invalid format':
          return 'صيغة البريد الإلكتروني غير صحيحة';
        default:
          return error.message;
      }
    }
    return 'حدث خطأ غير متوقع';
  }

  // التحقق من صحة البريد الإلكتروني
  static bool isValidEmail(String email) {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(email);
  }

  // التحقق من قوة كلمة المرور
  static bool isStrongPassword(String password) {
    return password.length >= 6;
  }
}
