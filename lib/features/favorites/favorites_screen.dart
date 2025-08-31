import 'package:flutter/material.dart';
import '../../shared/widgets/bottom_nav_bar.dart';
import '../../shared/widgets/listing_card.dart';
import '../../services/auth_service.dart';
import '../../services/listing_service.dart';
import '../../services/favorites_service.dart';
import '../../models/listing_model.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  int _selectedIndex = 1;
  List<PropertyListing> _favorites = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadFavorites();
  }

  Future<void> _loadFavorites() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // جلب المستخدم الحالي
      final currentUser = AuthService.getCurrentUser();
      if (currentUser == null) {
        setState(() {
          _favorites = [];
          _isLoading = false;
        });
        return;
      }

      // جلب IDs العقارات المفضلة
      final favoriteIds = await FavoritesService().getFavoriteListingIds();

      if (favoriteIds.isEmpty) {
        setState(() {
          _favorites = [];
          _isLoading = false;
        });
        return;
      }

      // جلب تفاصيل العقارات المفضلة
      final favoriteListings =
          await ListingService.getListingsByIds(favoriteIds);

      // تحويل إلى PropertyListing للتوافق مع UI
      final propertyListings = favoriteListings
          .map((listing) => PropertyListing(
                id: listing.id,
                title: listing.title,
                location: listing.locationValue,
                price: listing.price,
                rating: 4.5, // افتراضي
                distance: "متاح",
                dates: "متاح",
                imageUrl: listing.imageSrc?.isNotEmpty == true
                    ? listing.imageSrc!.first
                    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
                isFavorite: true,
              ))
          .toList();

      setState(() {
        _favorites = propertyListings;
        _isLoading = false;
      });

      print('✅ تم تحميل ${propertyListings.length} عقار مفضل من Supabase');
    } catch (error) {
      print('❌ خطأ في تحميل المفضلة: $error');

      setState(() {
        _favorites = [];
        _isLoading = false;
      });
    }
  }

  Future<void> _toggleFavorite(PropertyListing property) async {
    final currentUser = AuthService.getCurrentUser();
    if (currentUser == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('يرجى تسجيل الدخول لحفظ المفضلة')),
      );
      return;
    }

    try {
      // استخدام FavoritesService للتبديل
      final favoritesService = FavoritesService();
      final isFav = await favoritesService.toggle(property.id);

      setState(() {
        property.isFavorite = isFav;
        if (!isFav) {
          _favorites.remove(property);
        }
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(isFav
              ? 'تم إضافة العقار إلى المفضلة'
              : 'تم إزالة العقار من المفضلة'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (error) {
      print('❌ خطأ في تبديل المفضلة: $error');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('حدث خطأ في تحديث المفضلة'),
          backgroundColor: Colors.red,
        ),
      );
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
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : _favorites.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.favorite_border,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'لا توجد عقارات في المفضلة',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'اضغط على القلب لإضافة عقارات للمفضلة',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                )
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
}
