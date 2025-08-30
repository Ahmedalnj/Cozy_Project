import 'package:flutter/material.dart';
import '../../shared/widgets/bottom_nav_bar.dart';
import '../../shared/widgets/listing_card.dart';

class MyListingsScreen extends StatefulWidget {
  const MyListingsScreen({super.key});

  @override
  State<MyListingsScreen> createState() => _MyListingsScreenState();
}

class _MyListingsScreenState extends State<MyListingsScreen> {
  int _selectedIndex = 3;
  List<PropertyListing> _myListings = [];
  bool _isLoading = true;
  String? _currentUserId = "user123"; // Mock user ID

  @override
  void initState() {
    super.initState();
    _loadMyListings();
  }

  Future<void> _loadMyListings() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate loading data
    await Future.delayed(const Duration(seconds: 2));

    // Mock data
    final mockListings = [
      PropertyListing(
        id: "5",
        title: "فيلا خاصة في العين",
        location: "جبل حفيت",
        price: 800,
        rating: 4.9,
        distance: "5 كم من المركز",
        dates: "متاح",
        imageUrl:
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
        isFavorite: false,
      ),
      PropertyListing(
        id: "6",
        title: "شقة في دبي هيلز",
        location: "دبي هيلز إستيت",
        price: 600,
        rating: 4.7,
        distance: "3 كم من المركز",
        dates: "متاح",
        imageUrl:
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
        isFavorite: false,
      ),
    ];

    setState(() {
      _myListings = mockListings;
      _isLoading = false;
    });
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
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'عقاراتي',
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
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: Colors.black),
            onPressed: () {
              Navigator.pushNamed(context, '/new-listing');
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                color: Colors.pink,
              ),
            )
          : _myListings.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _myListings.length,
                  itemBuilder: (context, index) {
                    final property = _myListings[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: ListingCard(
                        property: property,
                        onFavoriteToggle: () {
                          // Handle favorite toggle
                        },
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
            Icons.home_outlined,
            size: 80,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'لا توجد عقارات',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'أضف عقارك الأول ليظهر هنا',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade500,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              Navigator.pushNamed(context, '/new-listing');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.pink.shade400,
              foregroundColor: Colors.white,
            ),
            child: const Text('إضافة عقار جديد'),
          ),
        ],
      ),
    );
  }
}
