import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import '../shared/widgets/listing_card.dart';
import 'token_manager.dart';

class ApiService {
  // تغيير هذا الرابط حسب إعداداتك
  static const String baseUrl = 'http://localhost:3000/api';

  // Headers للطلبات
  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
      };

  // إضافة token للمصادقة
  static Map<String, String> _authHeaders(String? token) {
    final headers = Map<String, String>.from(_headers);
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // الحصول على التوكن المحفوظ
  static Future<String?> _getStoredToken() async {
    return await TokenManager.getToken();
  }

  // ===== AUTHENTICATION =====

  /// تسجيل الدخول
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: _headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Login failed: ${response.body}');
      }
    } catch (e) {
      debugPrint('Login error: $e');
      rethrow;
    }
  }

  /// إنشاء حساب جديد
  static Future<Map<String, dynamic>> signup(
      String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/signup'),
        headers: _headers,
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Signup failed: ${response.body}');
      }
    } catch (e) {
      debugPrint('Signup error: $e');
      rethrow;
    }
  }

  /// تسجيل الدخول بـ Google
  static Future<Map<String, dynamic>> googleSignIn() async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/google'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Google sign in failed: ${response.body}');
      }
    } catch (e) {
      debugPrint('Google sign in error: $e');
      rethrow;
    }
  }

  // ===== LISTINGS =====

  /// جلب جميع العقارات
  static Future<List<PropertyListing>> getListings() async {
    try {
      final token = await _getStoredToken();
      final response = await http.get(
        Uri.parse('$baseUrl/listings'),
        headers: _authHeaders(token),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => PropertyListing.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load listings: ${response.body}');
      }
    } catch (e) {
      debugPrint('Get listings error: $e');
      rethrow;
    }
  }

  /// جلب عقار واحد
  static Future<Map<String, dynamic>> getListingById(String id) async {
    try {
      final token = await _getStoredToken();
      final response = await http.get(
        Uri.parse('$baseUrl/listings/$id'),
        headers: _authHeaders(token),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to load listing: ${response.body}');
      }
    } catch (e) {
      debugPrint('Get listing error: $e');
      rethrow;
    }
  }

  /// إضافة عقار جديد
  static Future<Map<String, dynamic>> addListing(
      Map<String, dynamic> listingData) async {
    try {
      final token = await _getStoredToken();
      final response = await http.post(
        Uri.parse('$baseUrl/listings'),
        headers: _authHeaders(token),
        body: jsonEncode(listingData),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to add listing: ${response.body}');
      }
    } catch (e) {
      debugPrint('Add listing error: $e');
      rethrow;
    }
  }

  /// تحديث عقار
  static Future<Map<String, dynamic>> updateListing(
      String id, Map<String, dynamic> listingData) async {
    try {
      final token = await _getStoredToken();
      final response = await http.put(
        Uri.parse('$baseUrl/listings/$id'),
        headers: _authHeaders(token),
        body: jsonEncode(listingData),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to update listing: ${response.body}');
      }
    } catch (e) {
      debugPrint('Update listing error: $e');
      rethrow;
    }
  }

  /// حذف عقار
  static Future<bool> deleteListing(String id) async {
    try {
      final token = await _getStoredToken();
      final response = await http.delete(
        Uri.parse('$baseUrl/listings/$id'),
        headers: _authHeaders(token),
      );

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Delete listing error: $e');
      rethrow;
    }
  }

  /// جلب عقارات المستخدم
  static Future<List<PropertyListing>> getMyListings() async {
    try {
      final token = await _getStoredToken();
      final response = await http.get(
        Uri.parse('$baseUrl/listings/my'),
        headers: _authHeaders(token),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => PropertyListing.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load my listings: ${response.body}');
      }
    } catch (e) {
      debugPrint('Get my listings error: $e');
      rethrow;
    }
  }

  // ===== FAVORITES =====

  /// تبديل المفضلة
  static Future<bool> toggleFavorite(String listingId) async {
    try {
      final token = await _getStoredToken();
      final response = await http.post(
        Uri.parse('$baseUrl/favorites/$listingId'),
        headers: _authHeaders(token),
      );

      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Toggle favorite error: $e');
      rethrow;
    }
  }

  /// جلب المفضلة
  static Future<List<PropertyListing>> getFavorites() async {
    try {
      final token = await _getStoredToken();
      final response = await http.get(
        Uri.parse('$baseUrl/favorites'),
        headers: _authHeaders(token),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => PropertyListing.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load favorites: ${response.body}');
      }
    } catch (e) {
      debugPrint('Get favorites error: $e');
      rethrow;
    }
  }

  /// التحقق من حالة المفضلة
  static Future<bool> isFavorite(String listingId) async {
    try {
      final token = await _getStoredToken();
      final response = await http.get(
        Uri.parse('$baseUrl/favorites/$listingId'),
        headers: _authHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['isFavorite'] ?? false;
      } else {
        return false;
      }
    } catch (e) {
      debugPrint('Check favorite error: $e');
      return false;
    }
  }

  // ===== RESERVATIONS =====

  /// إنشاء حجز
  static Future<Map<String, dynamic>> createReservation(
      Map<String, dynamic> reservationData) async {
    try {
      final token = await _getStoredToken();
      final response = await http.post(
        Uri.parse('$baseUrl/reservations'),
        headers: _authHeaders(token),
        body: jsonEncode(reservationData),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to create reservation: ${response.body}');
      }
    } catch (e) {
      debugPrint('Create reservation error: $e');
      rethrow;
    }
  }

  /// جلب حجوزات المستخدم
  static Future<List<Map<String, dynamic>>> getUserReservations() async {
    try {
      final token = await _getStoredToken();
      final response = await http.get(
        Uri.parse('$baseUrl/reservations'),
        headers: _authHeaders(token),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.cast<Map<String, dynamic>>();
      } else {
        throw Exception('Failed to load reservations: ${response.body}');
      }
    } catch (e) {
      debugPrint('Get reservations error: $e');
      rethrow;
    }
  }

  // ===== USER PROFILE =====

  /// جلب ملف المستخدم
  static Future<Map<String, dynamic>?> getUserProfile() async {
    try {
      final token = await _getStoredToken();
      final response = await http.get(
        Uri.parse('$baseUrl/user/profile'),
        headers: _authHeaders(token),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return null;
      }
    } catch (e) {
      debugPrint('Get user profile error: $e');
      return null;
    }
  }

  /// تحديث ملف المستخدم
  static Future<Map<String, dynamic>> updateUserProfile(
      Map<String, dynamic> profileData) async {
    try {
      final token = await _getStoredToken();
      final response = await http.put(
        Uri.parse('$baseUrl/user/profile'),
        headers: _authHeaders(token),
        body: jsonEncode(profileData),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to update profile: ${response.body}');
      }
    } catch (e) {
      debugPrint('Update profile error: $e');
      rethrow;
    }
  }
}
