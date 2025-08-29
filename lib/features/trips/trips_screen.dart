import 'package:flutter/material.dart';
import '../../core/api_service.dart';
import '../../core/token_manager.dart';
import '../../shared/widgets/bottom_nav_bar.dart';
import '../../shared/widgets/listing_card.dart';

class TripsScreen extends StatefulWidget {
  const TripsScreen({super.key});

  @override
  State<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends State<TripsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<Map<String, dynamic>> _upcomingTrips = [];
  List<Map<String, dynamic>> _pastTrips = [];
  bool _isLoading = true;
  String? _currentUserId;
  int _selectedIndex = 2; // My Trips tab

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _getCurrentUser();
    _loadTrips();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _getCurrentUser() async {
    final user = await TokenManager.getUser();
    if (user != null) {
      setState(() {
        _currentUserId = user['id'];
      });
    }
  }

  Future<void> _loadTrips() async {
    if (_currentUserId == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final reservationsData = await ApiService.getUserReservations();

      final now = DateTime.now();
      final upcoming = <Map<String, dynamic>>[];
      final past = <Map<String, dynamic>>[];

      for (final reservation in reservationsData) {
        final startDate = DateTime.parse(reservation['startDate']);
        if (startDate.isAfter(now)) {
          upcoming.add(reservation);
        } else {
          past.add(reservation);
        }
      }

      setState(() {
        _upcomingTrips = upcoming;
        _pastTrips = past;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading trips: $e');
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
        // Already on trips screen
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
      appBar: AppBar(
        title: const Text(
          'My Trips',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 24,
            color: Colors.black87,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.pink,
          labelColor: Colors.pink,
          unselectedLabelColor: Colors.grey,
          indicatorWeight: 3,
          tabs: const [
            Tab(
              text: 'Upcoming',
              icon: Icon(Icons.flight_takeoff),
            ),
            Tab(
              text: 'Past',
              icon: Icon(Icons.flight_land),
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : TabBarView(
              controller: _tabController,
              children: [
                _buildTripsList(_upcomingTrips, 'upcoming'),
                _buildTripsList(_pastTrips, 'past'),
              ],
            ),
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _selectedIndex,
        onTap: _onNavBarTap,
      ),
    );
  }

  Widget _buildTripsList(List<Map<String, dynamic>> trips, String type) {
    if (trips.isEmpty) {
      return _buildEmptyState(type);
    }

    return RefreshIndicator(
      onRefresh: _loadTrips,
      child: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: trips.length,
        itemBuilder: (context, index) {
          final trip = trips[index];
          return _buildTripCard(trip, type);
        },
      ),
    );
  }

  Widget _buildTripCard(Map<String, dynamic> trip, String type) {
    final title = trip['listing_title'] ?? 'Trip';
    final startDate = trip['startDate'] ?? '';
    final endDate = trip['endDate'] ?? '';
    final totalPrice = trip['totalPrice'] ?? 0;
    final imageUrl = trip['image_url'] ??
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop';

    // Format dates
    final start = DateTime.tryParse(startDate);
    final end = DateTime.tryParse(endDate);
    final formattedStart =
        start != null ? '${start.day}/${start.month}/${start.year}' : startDate;
    final formattedEnd =
        end != null ? '${end.day}/${end.month}/${end.year}' : endDate;

    return GestureDetector(
      onTap: () {
        // Create PropertyListing object and navigate to detail screen
        final property = PropertyListing(
          id: trip['listing_id']?.toString() ?? '',
          title: title,
          location: trip['location'] ?? 'Unknown location',
          rating: 4.5, // Default rating
          distance: type == 'upcoming' ? 'Upcoming Trip' : 'Past Trip',
          dates: '$formattedStart - $formattedEnd',
          price: (totalPrice).toInt(),
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
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 15,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            // Image and Status
            Stack(
              children: [
                ClipRRect(
                  borderRadius:
                      const BorderRadius.vertical(top: Radius.circular(16)),
                  child: Image.network(
                    imageUrl,
                    width: double.infinity,
                    height: 200,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        width: double.infinity,
                        height: 200,
                        color: Colors.grey[300],
                        child: const Icon(
                          Icons.image,
                          size: 50,
                          color: Colors.grey,
                        ),
                      );
                    },
                  ),
                ),
                // Status Badge
                Positioned(
                  top: 16,
                  right: 16,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color:
                          type == 'upcoming' ? Colors.green : Colors.grey[600],
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      type == 'upcoming' ? 'Upcoming' : 'Completed',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),

                  // Dates
                  Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: Colors.grey[600],
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '$formattedStart - $formattedEnd',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Price and Action
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Total Price',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                          Text(
                            '\$${totalPrice.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                        ],
                      ),
                      OutlinedButton(
                        onPressed: () {
                          // Navigate to trip details or booking management
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Trip details for $title'),
                              backgroundColor: Colors.pink,
                            ),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.pink),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: Text(
                          type == 'upcoming' ? 'Manage' : 'View Details',
                          style: const TextStyle(color: Colors.pink),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(String type) {
    final isUpcoming = type == 'upcoming';

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
              isUpcoming ? Icons.flight_takeoff : Icons.flight_land,
              size: 60,
              color: Colors.grey[400],
            ),
          ),
          const SizedBox(height: 24),
          Text(
            isUpcoming ? 'No upcoming trips' : 'No past trips',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            isUpcoming
                ? 'Start planning your next adventure'
                : 'Your travel history will appear here',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 32),
          if (isUpcoming)
            FilledButton(
              onPressed: () {
                Navigator.pushReplacementNamed(context, '/');
              },
              style: FilledButton.styleFrom(
                backgroundColor: Colors.pink,
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
}
