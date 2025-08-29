import 'package:flutter/material.dart';
import '../../core/api_service.dart';
import '../../core/token_manager.dart';
import '../../shared/widgets/bottom_nav_bar.dart';
import '../../shared/widgets/listing_card.dart';

class MyListingsScreen extends StatefulWidget {
  const MyListingsScreen({super.key});

  @override
  State<MyListingsScreen> createState() => _MyListingsScreenState();
}

class _MyListingsScreenState extends State<MyListingsScreen> {
  List<Map<String, dynamic>> _myListings = [];
  bool _isLoading = true;
  String? _currentUserId;
  int _selectedIndex = 3; // My Listings tab

  @override
  void initState() {
    super.initState();
    _getCurrentUser();
    _loadMyListings();
  }

  Future<void> _getCurrentUser() async {
    final user = await TokenManager.getUser();
    if (user != null) {
      setState(() {
        _currentUserId = user['id'];
      });
    }
  }

  Future<void> _loadMyListings() async {
    if (_currentUserId == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      // Get listings created by the current user
      final listingsData = await ApiService.getMyListings();

      setState(() {
        _myListings = List<Map<String, dynamic>>.from(listingsData);
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading my listings: $e');
      setState(() {
        _isLoading = false;
      });
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
        Navigator.pushReplacementNamed(context, '/favorites');
        break;
      case 2: // My Trips
        Navigator.pushReplacementNamed(context, '/trips');
        break;
      case 3: // My Listings
        // Already on my listings screen
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
      appBar: AppBar(
        title: const Text(
          'My Listings',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _myListings.isEmpty
              ? _buildEmptyState()
              : _buildListingsList(),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to new listing screen
          Navigator.pushNamed(context, '/new-listing').then((_) {
            // Refresh the list when returning from new listing screen
            _loadMyListings();
          });
        },
        backgroundColor: Colors.pink,
        child: const Icon(Icons.add, color: Colors.white),
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
              Icons.home_outlined,
              size: 60,
              color: Colors.grey[400],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No listings yet',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Start by adding your first property listing',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 32),
          FilledButton(
            onPressed: () {
              Navigator.pushNamed(context, '/new-listing').then((_) {
                _loadMyListings();
              });
            },
            style: FilledButton.styleFrom(
              backgroundColor: Colors.pink,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'Add Your First Listing',
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

  Widget _buildListingsList() {
    return RefreshIndicator(
      onRefresh: _loadMyListings,
      child: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: _myListings.length,
        itemBuilder: (context, index) {
          final listing = _myListings[index];
          return _buildListingCard(listing);
        },
      ),
    );
  }

  Widget _buildListingCard(Map<String, dynamic> listing) {
    // Determine listing status (you can add a status field to your database)
    final isListed = listing['isActive'] ?? true; // Default to listed
    final status = isListed ? 'Listed' : 'Unlisted';

    // Get listing details
    final title = listing['title'] ?? 'Untitled Listing';
    final guestCount = listing['guestCount'] ?? 0;
    final roomCount = listing['roomCount'] ?? 0;
    final bathroomCount = listing['bathroomCount'] ?? 0;
    final imageUrl = listing['imageSrc']?.isNotEmpty == true
        ? listing['imageSrc'][0]
        : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop';

    return GestureDetector(
      onTap: () {
        // Create PropertyListing object and navigate to detail screen
        final property = PropertyListing(
          id: listing['_id']?.toString() ?? '',
          title: title,
          location: listing['locationValue'] ?? 'Unknown location',
          rating: 4.5, // Default rating
          distance: 'My Property',
          dates: 'Available',
          price: listing['price'] ?? 0,
          imageUrl: imageUrl,
          isFavorite: false,
        );

        Navigator.pushNamed(
          context,
          '/detail',
          arguments: property,
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey[200]!),
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
            // Left side - Text content
            Expanded(
              flex: 2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Status
                  Text(
                    status,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),

                  // Title
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),

                  // Details
                  Text(
                    '$guestCount guests · $roomCount bedrooms · $roomCount beds · $bathroomCount bath',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Edit button
                  OutlinedButton.icon(
                    onPressed: () {
                      // Navigate to edit listing screen (you can reuse new listing screen)
                      Navigator.pushNamed(
                        context,
                        '/new-listing',
                        arguments: listing, // Pass listing data for editing
                      ).then((_) {
                        _loadMyListings();
                      });
                    },
                    icon: const Icon(Icons.edit, size: 16),
                    label: const Text('Edit Listing'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.grey[300]!),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 16),

            // Right side - Image
            Expanded(
              flex: 1,
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  image: DecorationImage(
                    image: NetworkImage(imageUrl),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
