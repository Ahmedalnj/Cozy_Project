import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart';

class SupabaseService {
  static final SupabaseClient _client = Supabase.instance.client;

  // Get the Supabase client instance
  static SupabaseClient get client => _client;

  // Fetch all listings from the database
  static Future<List<Map<String, dynamic>>> getListings() async {
    try {
      final response = await _client
          .from('Listing')
          .select('*')
          .order('createdAt', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      debugPrint('Error fetching listings: $e');
      return [];
    }
  }

  // Add a new listing
  static Future<bool> addListing(Map<String, dynamic> listing) async {
    try {
      await _client.from('Listing').insert(listing);
      return true;
    } catch (e) {
      debugPrint('Error adding listing: $e');
      return false;
    }
  }

  // Update a listing
  static Future<bool> updateListing(
      String id, Map<String, dynamic> updates) async {
    try {
      await _client.from('Listing').update(updates).eq('_id', id);
      return true;
    } catch (e) {
      debugPrint('Error updating listing: $e');
      return false;
    }
  }

  // Delete a listing
  static Future<bool> deleteListing(String id) async {
    try {
      await _client.from('Listing').delete().eq('_id', id);
      return true;
    } catch (e) {
      debugPrint('Error deleting listing: $e');
      return false;
    }
  }

  // Toggle favorite status for a listing
  static Future<bool> toggleFavorite(String listingId, String userId) async {
    try {
      // Get current user's favoriteIds
      final userResponse = await _client
          .from('User')
          .select('favoriteIds')
          .eq('_id', userId)
          .single();

      List<String> favoriteIds =
          List<String>.from(userResponse['favoriteIds'] ?? []);

      if (favoriteIds.contains(listingId)) {
        // Remove from favorites
        favoriteIds.remove(listingId);
      } else {
        // Add to favorites
        favoriteIds.add(listingId);
      }

      // Update user's favoriteIds
      await _client
          .from('User')
          .update({'favoriteIds': favoriteIds}).eq('_id', userId);

      return true;
    } catch (e) {
      debugPrint('Error toggling favorite: $e');
      return false;
    }
  }

  // Get user's favorite listings
  static Future<List<Map<String, dynamic>>> getUserFavorites(
      String userId) async {
    try {
      final userResponse = await _client
          .from('User')
          .select('favoriteIds')
          .eq('_id', userId)
          .single();

      List<String> favoriteIds =
          List<String>.from(userResponse['favoriteIds'] ?? []);

      if (favoriteIds.isEmpty) {
        return [];
      }

      final response = await _client
          .from('Listing')
          .select('*')
          .inFilter('_id', favoriteIds);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      debugPrint('Error fetching favorites: $e');
      return [];
    }
  }

  // Create a reservation
  static Future<bool> createReservation(
      Map<String, dynamic> reservation) async {
    try {
      await _client.from('Reservation').insert(reservation);
      return true;
    } catch (e) {
      debugPrint('Error creating reservation: $e');
      return false;
    }
  }

  // Get user's reservations
  static Future<List<Map<String, dynamic>>> getUserReservations(
      String userId) async {
    try {
      final response = await _client
          .from('Reservation')
          .select('*, Listing(*)')
          .eq('user_id', userId)
          .order('createdAt', ascending: false);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      debugPrint('Error fetching reservations: $e');
      return [];
    }
  }

  // Get listing by ID
  static Future<Map<String, dynamic>?> getListingById(String id) async {
    try {
      final response =
          await _client.from('Listing').select('*').eq('_id', id).single();

      return response;
    } catch (e) {
      debugPrint('Error fetching listing by ID: $e');
      return null;
    }
  }

  // Check if a listing is favorited by user
  static Future<bool> isListingFavorited(
      String listingId, String userId) async {
    try {
      final userResponse = await _client
          .from('User')
          .select('favoriteIds')
          .eq('_id', userId)
          .single();

      List<String> favoriteIds =
          List<String>.from(userResponse['favoriteIds'] ?? []);
      return favoriteIds.contains(listingId);
    } catch (e) {
      debugPrint('Error checking favorite status: $e');
      return false;
    }
  }

  // Create or update user profile
  static Future<bool> createUserProfile(Map<String, dynamic> userData) async {
    try {
      await _client.from('User').upsert(userData);
      return true;
    } catch (e) {
      debugPrint('Error creating user profile: $e');
      return false;
    }
  }

  // Get user profile
  static Future<Map<String, dynamic>?> getUserProfile(String userId) async {
    try {
      final response =
          await _client.from('User').select('*').eq('_id', userId).single();

      return response;
    } catch (e) {
      debugPrint('Error fetching user profile: $e');
      return null;
    }
  }
}
