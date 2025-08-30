import 'package:flutter/material.dart';
import '../../shared/widgets/bottom_nav_bar.dart';
import '../../shared/widgets/listing_card.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  int _selectedIndex = 1;
  List<PropertyListing> _favorites = [];
  bool _isLoading = true;
  String? _currentUserId = "user123"; // Mock user ID

  @override
  void initState() {
    super.initState();
    _loadFavorites();
  }

  Future<void> _loadFavorites() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate loading data
    await Future.delayed(const Duration(seconds: 2));

    // Mock data
    final mockFavorites = [
      PropertyListing(
        id: "2",
        title: "شقة عصرية في أبو ظبي",
        location: "كورنيش أبو ظبي",
        price: 300,
        rating: 4.6,
        distance: "1 كم من المركز",
        dates: "متاح",
        imageUrl:
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
        isFavorite: true,
      ),
      PropertyListing(
        id: "4",
        title: "فيلا خاصة في العين",
        location: "جبل حفيت",
        price: 800,
        rating: 4.9,
        distance: "5 كم من المركز",
        dates: "متاح",
        imageUrl:
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
        isFavorite: true,
      ),
    ];

    setState(() {
      _favorites = mockFavorites;
      _isLoading = false;
    });
  }

  Future<void> _toggleFavorite(PropertyListing property) async {
    if (_currentUserId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('يرجى تسجيل الدخول لحفظ المفضلة')),
      );
      return;
    }

    // Simulate API call
    await Future.delayed(const Duration(milliseconds: 500));

    setState(() {
      property.isFavorite = !property.isFavorite;
      if (!property.isFavorite) {
        _favorites.remove(property);
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(property.isFavorite
            ? 'تم إضافة العقار إلى المفضلة'
            : 'تم إزالة العقار من المفضلة'),
        backgroundColor: Colors.green,
      ),
    );
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
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'المفضلة',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                color: Colors.pink,
              ),
            )
          : _favorites.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _favorites.length,
                  itemBuilder: (context, index) {
                    final property = _favorites[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: ListingCard(
                        property: property,
                        onFavoriteToggle: () => _toggleFavorite(property),
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            '/detail',
                            arguments: property,
                          );
                        },
                      ),
                    );
                  },
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
          Icon(
            Icons.favorite_border,
            size: 80,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'لا توجد مفضلات',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'أضف عقارات إلى مفضلتك لتظهر هنا',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade500,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.pink.shade400,
              foregroundColor: Colors.white,
            ),
            child: const Text('تصفح العقارات'),
          ),
        ],
      ),
    );
  }
}
