import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/auth_service.dart';

class FavoritesService {
  final _c = Supabase.instance.client;

  // تبديل حالة المفضلة
  Future<bool> toggle(String listingId) async {
    try {
      final uid = _c.auth.currentUser!.id;
      print('🔄 تبديل المفضلة للمستخدم: $uid والعقار: $listingId');

      // التحقق من الحالة الحالية أولاً
      final currentStatus = await AuthService.isFavorite(uid, listingId);
      print('📋 الحالة الحالية: ${currentStatus ? "مفضل" : "غير مفضل"}');

      // استخدام AuthService للتبديل
      await AuthService.toggleFavorite(uid, listingId);

      // تأخير صغير للتأكد من تحديث قاعدة البيانات
      await Future.delayed(const Duration(milliseconds: 100));

      // الحالة الجديدة هي عكس الحالة الحالية
      final newStatus = !currentStatus;
      print('✅ الحالة الجديدة: ${newStatus ? "مفضل" : "غير مفضل"}');

      return newStatus;
    } catch (error) {
      print('❌ خطأ في تبديل المفضلة: $error');
      rethrow;
    }
  }

  // التحقق من وجود العقار في المفضلة
  Future<bool> isFavorite(String listingId) async {
    try {
      final uid = _c.auth.currentUser!.id;
      return await AuthService.isFavorite(uid, listingId);
    } catch (error) {
      print('❌ خطأ في التحقق من المفضلة: $error');
      return false;
    }
  }

  // جلب جميع العقارات المفضلة
  Future<List<String>> getFavoriteListingIds() async {
    try {
      final uid = _c.auth.currentUser!.id;
      return await AuthService.getFavorites(uid);
    } catch (error) {
      print('❌ خطأ في جلب المفضلة: $error');
      return [];
    }
  }
}
