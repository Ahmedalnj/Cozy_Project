import 'package:flutter/material.dart';
import '../../core/api_service.dart';
import '../../core/token_manager.dart';
import '../../shared/widgets/listing_card.dart';
import '../../shared/widgets/bottom_nav_bar.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  List<PropertyListing> _favorites = [];
  bool _isLoading = true;
  String? _currentUserId;
  int _selectedIndex = 1; // Favorites tab

  @override
  void initState() {
    super.initState();
    _getCurrentUser();
    _loadFavorites();
  }

  Future<void> _getCurrentUser() async {
    final user = await TokenManager.getUser();
    if (user != null) {
      setState(() {
        _currentUserId = user['id'];
      });
    }
  }

  Future<void> _loadFavorites() async {
    if (_currentUserId == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final favoritesData = await ApiService.getFavorites();

      final favorites = favoritesData;

      setState(() {
        _favorites = favorites;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading favorites: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _removeFromFavorites(PropertyListing property) async {
    if (_currentUserId == null) return;

    try {
      final success = await ApiService.toggleFavorite(property.id);
      if (success) {
        setState(() {
          _favorites.removeWhere((item) => item.id == property.id);
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Removed from favorites'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Error removing from favorites: $e');
    }
  }

  void _onNavBarTap(int index) {
    setState(() {
      _selectedIndex = index;
    });

    // Navigate to different screens based on index
    switch (index) {
      case 0: // Home
        Navigator.pushReplacementNamed(context, '/');
        break;
      case 1: // Favorites
        // Already on favorites screen
        break;
      case 2: // My Trips
        Navigator.pushReplacementNamed(context, '/trips');
        break;
      case 3: // My Listings
        Navigator.pushReplacementNamed(context, '/my-listings');
        break;
      case 4: // Account
        Navigator.pushReplacementNamed(context, '/account');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Favorites',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      // Settings functionality (ignored as requested)
                    },
                    icon: Icon(
                      Icons.settings,
                      color: Colors.grey[600],
                      size: 24,
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(),
                    )
                  : _favorites.isEmpty
                      ? _buildEmptyState()
                      : _buildFavoritesList(),
            ),
          ],
        ),
      ),
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _selectedIndex,
        onTap: _onNavBarTap,
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(60),
            ),
            child: Icon(
              Icons.favorite_border,
              size: 60,
              color: Colors.grey[400],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No favorites yet',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Start exploring and save your favorite places',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 32),
          FilledButton(
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/');
            },
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFF667eea),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'Explore Places',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFavoritesList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Title
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20.0),
          child: Text(
            'Saved properties',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Favorites List
        Expanded(
          child: RefreshIndicator(
            onRefresh: _loadFavorites,
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: _favorites.length,
              itemBuilder: (context, index) {
                final property = _favorites[index];
                return _buildFavoriteCard(property);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFavoriteCard(PropertyListing property) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Left side - Text details
          Expanded(
            flex: 2,
            child: GestureDetector(
              onTap: () {
                // Navigate to detail screen
                Navigator.pushNamed(
                  context,
                  '/detail',
                  arguments: property,
                );
              },
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Property type and beds
                    Text(
                      'Entire house - ${property.rating.toInt()} beds',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 4),

                    // Property title
                    Text(
                      property.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),

                    // Location, price and rating
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            '${property.location} · \$${property.price}/night · ★ ${property.rating}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Favorite indicator
                    GestureDetector(
                      onTap: () {
                        _removeFromFavorites(property);
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.favorite,
                              size: 12,
                              color: Colors.red,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'filled',
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey[700],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Right side - Image thumbnail
          Expanded(
            flex: 1,
            child: GestureDetector(
              onTap: () {
                // Navigate to detail screen
                Navigator.pushNamed(
                  context,
                  '/detail',
                  arguments: property,
                );
              },
              child: Container(
                height: 100,
                margin: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  image: DecorationImage(
                    image: NetworkImage(property.imageUrl),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
