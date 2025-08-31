import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/listing_model.dart';

class ListingService {
  static final SupabaseClient _supabase = Supabase.instance.client;

  // جلب جميع العقارات
  static Future<List<ListingModel>> getAllListings() async {
    try {
      print('🏠 جلب العقارات من قاعدة البيانات...');

      final response = await _supabase.from('Listing').select().limit(10);

      print('✅ تم جلب ${response.length} عقار');

      return response.map((json) => ListingModel.fromJson(json)).toList();
    } catch (error) {
      print('❌ خطأ في جلب العقارات: $error');
      return [];
    }
  }

  // جلب عقار واحد بواسطة ID
  static Future<ListingModel?> getListingById(String id) async {
    try {
      final response =
          await _supabase.from('Listing').select().eq('_id', id).single();

      return ListingModel.fromJson(response);
    } catch (error) {
      print('❌ خطأ في جلب العقار: $error');
      return null;
    }
  }

  // جلب عقارات المستخدم
  static Future<List<ListingModel>> getUserListings(String userId) async {
    try {
      final response = await _supabase
          .from('Listing')
          .select()
          .eq('user_id', userId)
          .order('createdAt', ascending: false);

      return response.map((json) => ListingModel.fromJson(json)).toList();
    } catch (error) {
      print('❌ خطأ في جلب عقارات المستخدم: $error');
      return [];
    }
  }

  // إنشاء عقار جديد
  static Future<ListingModel?> createListing(
      Map<String, dynamic> listingData) async {
    try {
      final response =
          await _supabase.from('Listing').insert(listingData).select().single();

      return ListingModel.fromJson(response);
    } catch (error) {
      print('❌ خطأ في إنشاء العقار: $error');
      return null;
    }
  }

  // تحديث عقار
  static Future<bool> updateListing(
      String id, Map<String, dynamic> updates) async {
    try {
      await _supabase.from('Listing').update({
        ...updates,
        'updatedAt': DateTime.now().toIso8601String(),
      }).eq('_id', id);

      return true;
    } catch (error) {
      print('❌ خطأ في تحديث العقار: $error');
      return false;
    }
  }

  // حذف عقار
  static Future<bool> deleteListing(String id) async {
    try {
      await _supabase.from('Listing').delete().eq('_id', id);

      return true;
    } catch (error) {
      print('❌ خطأ في حذف العقار: $error');
      return false;
    }
  }

  // البحث في العقارات
  static Future<List<ListingModel>> searchListings({
    String? query,
    String? category,
    int? minPrice,
    int? maxPrice,
    String? location,
  }) async {
    try {
      var queryBuilder = _supabase.from('Listing').select();

      if (query != null && query.isNotEmpty) {
        queryBuilder =
            queryBuilder.or('title.ilike.%$query%,description.ilike.%$query%');
      }

      if (category != null && category.isNotEmpty) {
        queryBuilder = queryBuilder.eq('category', category);
      }

      if (minPrice != null) {
        queryBuilder = queryBuilder.gte('price', minPrice);
      }

      if (maxPrice != null) {
        queryBuilder = queryBuilder.lte('price', maxPrice);
      }

      if (location != null && location.isNotEmpty) {
        queryBuilder = queryBuilder.ilike('locationValue', '%$location%');
      }

      final response = await queryBuilder.order('createdAt', ascending: false);

      return response.map((json) => ListingModel.fromJson(json)).toList();
    } catch (error) {
      print('❌ خطأ في البحث: $error');
      return [];
    }
  }

  // جلب العقارات المفضلة للمستخدم
  static Future<List<ListingModel>> getFavoriteListings(String userId) async {
    try {
      // أولاً نجلب قائمة المفضلة للمستخدم
      final userResponse = await _supabase
          .from('User')
          .select('favoriteIds')
          .eq('_id', userId)
          .single();

      final favoriteIds = userResponse['favoriteIds'] as List<dynamic>? ?? [];

      if (favoriteIds.isEmpty) {
        return [];
      }

      // ثم نجلب العقارات المفضلة
      final listingsResponse =
          await _supabase.from('Listing').select().inFilter('_id', favoriteIds);

      return listingsResponse
          .map((json) => ListingModel.fromJson(json))
          .toList();
    } catch (error) {
      print('❌ خطأ في جلب العقارات المفضلة: $error');
      return [];
    }
  }

  // جلب عقارات بواسطة IDs
  static Future<List<ListingModel>> getListingsByIds(List<String> ids) async {
    try {
      if (ids.isEmpty) return [];

      final response =
          await _supabase.from('Listing').select().inFilter('_id', ids);

      return response.map((json) => ListingModel.fromJson(json)).toList();
    } catch (error) {
      print('❌ خطأ في جلب العقارات بواسطة IDs: $error');
      return [];
    }
  }
}
