import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart';
import '../shared/widgets/listing_card.dart';
import 'token_manager.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api';

  // Authentication methods - Using Next.js API
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // Save token and user data
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', data['token']);
        await prefs.setString('user_data', json.encode(data['user']));

        return {
          'token': data['token'],
          'user': data['user'],
        };
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Login failed');
      }
    } catch (e) {
      debugPrint('Login error: $e');
      throw Exception('Login failed: ${e.toString()}');
    }
  }

  static Future<Map<String, dynamic>> signup(
      String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/signup'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 201) {
        final data = json.decode(response.body);

        // Save token and user data
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', data['token']);
        await prefs.setString('user_data', json.encode(data['user']));

        return {
          'token': data['token'],
          'user': data['user'],
        };
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Signup failed');
      }
    } catch (e) {
      debugPrint('Signup error: $e');
      throw Exception('Signup failed: ${e.toString()}');
    }
  }

  static Future<Map<String, dynamic>> googleSignIn() async {
    try {
      // For Google OAuth, we need to handle the redirect flow
      // This is a simplified version - in production you'd handle the full OAuth flow

      // For now, we'll use a mock response for testing
      await Future.delayed(const Duration(seconds: 2));

      final mockUser = {
        'id': 'google_user_${DateTime.now().millisecondsSinceEpoch}',
        'name': 'Google User',
        'email': 'google@example.com',
      };

      final mockToken = 'google_token_${DateTime.now().millisecondsSinceEpoch}';

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', mockToken);
      await prefs.setString('user_data', json.encode(mockUser));

      return {
        'token': mockToken,
        'user': mockUser,
      };
    } catch (e) {
      debugPrint('Google sign in error: $e');
      throw Exception('Google sign in failed: ${e.toString()}');
    }
  }

  // Get all properties from Supabase
  static Future<List<PropertyListing>> getAllListings() async {
    try {
      final response = await Supabase.instance.client
          .from('properties')
          .select('*')
          .order('created_at', ascending: false);

      final List<PropertyListing> listings = [];
      final user = await TokenManager.getUser();

      for (final item in response) {
        // Check if property is favorited by current user
        bool isFavorite = false;
        if (user != null) {
          final favoriteResponse = await Supabase.instance.client
              .from('favorites')
              .select('id')
              .eq('user_id', user['id'])
              .eq('property_id', item['id'])
              .maybeSingle();
          isFavorite = favoriteResponse != null;
        }

        listings.add(PropertyListing(
          id: item['id'],
          title: item['title'],
          location: item['location'],
          rating: (item['rating'] as num).toDouble(),
          distance: item['distance'] ?? '',
          dates: item['dates'] ?? '',
          price: item['price'],
          imageUrl: item['image_url'] ?? '',
          isFavorite: isFavorite,
        ));
      }

      return listings;
    } catch (e) {
      debugPrint('Error fetching listings: $e');
      // Fallback to mock data if there's an error
      return _getMockListings();
    }
  }

  // Mock data fallback
  static List<PropertyListing> _getMockListings() {
    return [
      PropertyListing(
        id: '1',
        title: 'Luxury Beach Villa',
        location: 'Maldives',
        rating: 4.8,
        distance: '2.5 km from center',
        dates: 'Dec 12-18',
        price: 250,
        imageUrl:
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        isFavorite: false,
      ),
      PropertyListing(
        id: '2',
        title: 'Mountain Cabin',
        location: 'Swiss Alps',
        rating: 4.6,
        distance: '1.2 km from center',
        dates: 'Jan 15-22',
        price: 180,
        imageUrl:
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
        isFavorite: true,
      ),
    ];
  }

  static Future<List<PropertyListing>> getFavorites() async {
    try {
      final user = await TokenManager.getUser();
      if (user == null) return [];

      final response = await Supabase.instance.client
          .from('favorites')
          .select('property_id')
          .eq('user_id', user['id']);

      if (response.isEmpty) return [];

      final propertyIds = response.map((e) => e['property_id']).toList();

      final propertiesResponse = await Supabase.instance.client
          .from('properties')
          .select('*')
          .inFilter('id', propertyIds);

      return propertiesResponse
          .map((item) => PropertyListing(
                id: item['id'],
                title: item['title'],
                location: item['location'],
                rating: (item['rating'] as num).toDouble(),
                distance: item['distance'] ?? '',
                dates: item['dates'] ?? '',
                price: item['price'],
                imageUrl: item['image_url'] ?? '',
                isFavorite: true,
              ))
          .toList();
    } catch (e) {
      debugPrint('Error fetching favorites: $e');
      return [];
    }
  }

  static Future<bool> toggleFavorite(String listingId) async {
    try {
      final user = await TokenManager.getUser();
      if (user == null) return false;

      // Check if already favorited
      final existingFavorite = await Supabase.instance.client
          .from('favorites')
          .select('id')
          .eq('user_id', user['id'])
          .eq('property_id', listingId)
          .maybeSingle();

      if (existingFavorite != null) {
        // Remove from favorites
        await Supabase.instance.client
            .from('favorites')
            .delete()
            .eq('id', existingFavorite['id']);
        return true;
      } else {
        // Add to favorites
        await Supabase.instance.client.from('favorites').insert({
          'user_id': user['id'],
          'property_id': listingId,
        });
        return true;
      }
    } catch (e) {
      debugPrint('Error toggling favorite: $e');
      return false;
    }
  }

  static Future<PropertyListing?> getListingById(String id) async {
    try {
      final response = await Supabase.instance.client
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

      final user = await TokenManager.getUser();
      bool isFavorite = false;

      if (user != null) {
        final favoriteResponse = await Supabase.instance.client
            .from('favorites')
            .select('id')
            .eq('user_id', user['id'])
            .eq('property_id', id)
            .maybeSingle();
        isFavorite = favoriteResponse != null;
      }

      return PropertyListing(
        id: response['id'],
        title: response['title'],
        location: response['location'],
        rating: (response['rating'] as num).toDouble(),
        distance: response['distance'] ?? '',
        dates: response['dates'] ?? '',
        price: response['price'],
        imageUrl: response['image_url'] ?? '',
        isFavorite: isFavorite,
      );
    } catch (e) {
      debugPrint('Error fetching listing by ID: $e');
      return null;
    }
  }

  static Future<bool> addListing(Map<String, dynamic> listingData) async {
    try {
      final user = await TokenManager.getUser();
      if (user == null) return false;

      await Supabase.instance.client.from('properties').insert({
        'title': listingData['title'],
        'location': listingData['location'],
        'price': listingData['price'],
        'description': listingData['description'],
        'bedrooms': listingData['bedrooms'],
        'bathrooms': listingData['bathrooms'],
        'max_guests': listingData['maxGuests'],
        'image_url': listingData['imageUrl'],
        'created_by': user['id'],
      });

      return true;
    } catch (e) {
      debugPrint('Error adding listing: $e');
      return false;
    }
  }

  static Future<List<Map<String, dynamic>>> getUserReservations() async {
    // TODO: Replace with actual backend API call
    await Future.delayed(const Duration(seconds: 1));
    return [
      {
        'id': '1',
        'listing': {
          'title': 'Luxury Beach Villa',
          'imageUrl':
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        },
        'startDate': '2024-12-12',
        'endDate': '2024-12-18',
        'totalPrice': 1500,
        'status': 'confirmed',
      },
      {
        'id': '2',
        'listing': {
          'title': 'Mountain Cabin',
          'imageUrl':
              'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
        },
        'startDate': '2024-01-15',
        'endDate': '2024-01-22',
        'totalPrice': 1260,
        'status': 'upcoming',
      },
    ];
  }

  static Future<List<PropertyListing>> getMyListings() async {
    try {
      final user = await TokenManager.getUser();
      if (user == null) return [];

      final response = await Supabase.instance.client
          .from('properties')
          .select('*')
          .eq('created_by', user['id'])
          .order('created_at', ascending: false);

      return response
          .map((item) => PropertyListing(
                id: item['id'],
                title: item['title'],
                location: item['location'],
                rating: (item['rating'] as num).toDouble(),
                distance: item['distance'] ?? '',
                dates: item['dates'] ?? '',
                price: item['price'],
                imageUrl: item['image_url'] ?? '',
                isFavorite:
                    false, // User's own listings are not favorited by default
              ))
          .toList();
    } catch (e) {
      debugPrint('Error fetching my listings: $e');
      return [];
    }
  }

  static Future<Map<String, dynamic>?> getUserProfile() async {
    try {
      final user = await TokenManager.getUser();
      if (user == null) return null;

      final response = await Supabase.instance.client
          .from('user_profiles')
          .select('*')
          .eq('id', user['id'])
          .single();

      return {
        'id': response['id'],
        'name': response['full_name'],
        'email': response['email'],
        'avatar_url': response['avatar_url'],
        'phone': response['phone'],
      };
    } catch (e) {
      debugPrint('Error fetching user profile: $e');
      return null;
    }
  }
}
