import 'package:flutter/material.dart';
import '../../shared/widgets/bottom_nav_bar.dart';
import '../../shared/widgets/listing_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  List<PropertyListing> _recommendedPlaces = [];
  bool _isLoading = true;
  String? _currentUserId = "user123"; // Mock user ID

  @override
  void initState() {
    super.initState();
    _loadProperties();
  }

  Future<void> _loadProperties() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate loading data
    await Future.delayed(const Duration(seconds: 2));

    // Mock data
    final mockListings = [
      PropertyListing(
        id: "1",
        title: "فيلا فاخرة في دبي",
        location: "دبي مارينا",
        price: 500,
        rating: 4.8,
        distance: "2 كم من المركز",
        dates: "متاح",
        imageUrl:
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
        isFavorite: false,
      ),
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
        id: "3",
        title: "بيت تقليدي في الشارقة",
        location: "قلب الشارقة",
        price: 200,
        rating: 4.9,
        distance: "3 كم من المركز",
        dates: "متاح",
        imageUrl:
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
        isFavorite: false,
      ),
    ];

    setState(() {
      _recommendedPlaces = mockListings;
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
        // Already on home screen
        break;
      case 1: // Favorites
        Navigator.pushNamed(context, '/favorites');
        break;
      case 2: // My Trips
        Navigator.pushNamed(context, '/trips');
        break;
      case 3: // My Listings
        Navigator.pushNamed(context, '/my-listings');
        break;
      case 4: // Account
        Navigator.pushNamed(context, '/account');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 20,
                    backgroundImage: NetworkImage(
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'مرحباً بك في',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                        const Text(
                          'Cozy',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.notifications_outlined),
                    onPressed: () {
                      // Handle notifications
                    },
                  ),
                ],
              ),
            ),

            // Search Bar
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(25),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    spreadRadius: 1,
                    blurRadius: 5,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.search, color: Colors.grey),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      decoration: const InputDecoration(
                        hintText: 'ابحث عن مكان للإقامة...',
                        border: InputBorder.none,
                        hintStyle: TextStyle(color: Colors.grey),
                      ),
                      onTap: () {
                        // Handle search
                      },
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.pink.shade400,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(
                      Icons.tune,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Recommended Places Section
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                        color: Colors.pink,
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: _recommendedPlaces.length,
                      itemBuilder: (context, index) {
                        final property = _recommendedPlaces[index];
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
}
