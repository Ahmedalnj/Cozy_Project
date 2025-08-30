import 'package:flutter/foundation.dart';
import '../shared/widgets/listing_card.dart';
import '../core/supabase_client.dart';

class ListingsProvider extends ChangeNotifier {
  List<PropertyListing> _listings = [];
  bool _isLoading = false;
  String? _error;
  String? _currentUserId;

  List<PropertyListing> get listings => _listings;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get currentUserId => _currentUserId;

  // Get user's own listings
  List<PropertyListing> get myListings => _listings
      .where((listing) => listing.createdBy == _currentUserId)
      .toList();

  // Get favorite listings
  List<PropertyListing> get favoriteListings =>
      _listings.where((listing) => listing.isFavorite).toList();

  Future<void> loadListings() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      debugPrint('Loading listings...');
      final listingsData = await SupabaseService.getListings();

      final properties = listingsData.map((data) {
        return PropertyListing(
          id: data['_id']?.toString() ?? '',
          title: data['title'] ?? '',
          location: data['locationValue'] ?? '',
          rating: 4.5, // Default rating
          distance: 'Nearby', // Default distance
          dates: 'Available', // Default availability
          price: data['price'] ?? 0,
          imageUrl: data['imageSrc']?.isNotEmpty == true
              ? data['imageSrc'][0]
              : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
          isFavorite: false, // Will be updated after checking user favorites
          createdBy: data['user_id']?.toString() ?? '',
        );
      }).toList();

      // Check favorite status for each property if user is logged in
      if (_currentUserId != null) {
        for (var property in properties) {
          final isFavorited = await SupabaseService.isListingFavorited(
              property.id, _currentUserId!);
          property.isFavorite = isFavorited;
        }
      }

      _listings = properties;
      debugPrint('Loaded ${_listings.length} listings');
    } catch (e) {
      _error = 'Error loading listings: $e';
      debugPrint('Error loading listings: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> toggleFavorite(String listingId) async {
    if (_currentUserId == null) {
      _error = 'Please log in to save favorites';
      notifyListeners();
      return false;
    }

    try {
      final success =
          await SupabaseService.toggleFavorite(listingId, _currentUserId!);
      if (success) {
        // Update the listing's favorite status
        final index =
            _listings.indexWhere((listing) => listing.id == listingId);
        if (index != -1) {
          _listings[index].isFavorite = !_listings[index].isFavorite;
          notifyListeners();
        }
        return true;
      }
      return false;
    } catch (e) {
      _error = 'Error toggling favorite: $e';
      debugPrint('Error toggling favorite: $e');
      notifyListeners();
      return false;
    }
  }

  Future<bool> addListing(Map<String, dynamic> listingData) async {
    if (_currentUserId == null) {
      _error = 'Please log in to add listings';
      notifyListeners();
      return false;
    }

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await SupabaseService.addListing(listingData);
      if (success) {
        // Reload listings to get the new one
        await loadListings();
        return true;
      }
      return false;
    } catch (e) {
      _error = 'Error adding listing: $e';
      debugPrint('Error adding listing: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<PropertyListing?> getListingById(String id) async {
    try {
      final index = _listings.indexWhere((listing) => listing.id == id);
      if (index != -1) {
        return _listings[index];
      }
      return null;
    } catch (e) {
      _error = 'Error getting listing: $e';
      debugPrint('Error getting listing: $e');
      return null;
    }
  }

  void setCurrentUserId(String? userId) {
    _currentUserId = userId;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void refresh() {
    loadListings();
  }
}
