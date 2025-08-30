import 'package:flutter/foundation.dart';

class Trip {
  final String id;
  final String listingTitle;
  final String imageUrl;
  final String startDate;
  final String endDate;
  final double totalPrice;
  final String status;

  Trip({
    required this.id,
    required this.listingTitle,
    required this.imageUrl,
    required this.startDate,
    required this.endDate,
    required this.totalPrice,
    required this.status,
  });

  factory Trip.fromJson(Map<String, dynamic> json) {
    return Trip(
      id: json['id'] ?? '',
      listingTitle: json['listing']?['title'] ?? '',
      imageUrl: json['listing']?['imageUrl'] ?? '',
      startDate: json['startDate'] ?? '',
      endDate: json['endDate'] ?? '',
      totalPrice: (json['totalPrice'] ?? 0).toDouble(),
      status: json['status'] ?? 'upcoming',
    );
  }
}

class TripsProvider extends ChangeNotifier {
  List<Trip> _trips = [];
  bool _isLoading = false;
  String? _error;

  List<Trip> get trips => _trips;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Get upcoming trips
  List<Trip> get upcomingTrips =>
      _trips.where((trip) => trip.status == 'upcoming').toList();

  // Get past trips
  List<Trip> get pastTrips =>
      _trips.where((trip) => trip.status == 'confirmed').toList();

  Future<void> loadTrips() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      debugPrint('Loading trips...');

      // Simulate API call - replace with actual API call
      await Future.delayed(const Duration(seconds: 1));

      // Mock data for now
      _trips = [
        Trip(
          id: '1',
          listingTitle: 'Luxury Beach Villa',
          imageUrl:
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          startDate: '2024-12-12',
          endDate: '2024-12-18',
          totalPrice: 1500,
          status: 'confirmed',
        ),
        Trip(
          id: '2',
          listingTitle: 'Mountain Cabin',
          imageUrl:
              'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
          startDate: '2024-01-15',
          endDate: '2024-01-22',
          totalPrice: 1260,
          status: 'upcoming',
        ),
      ];

      debugPrint('Loaded ${_trips.length} trips');
    } catch (e) {
      _error = 'Error loading trips: $e';
      debugPrint('Error loading trips: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Trip?> getTripById(String id) async {
    try {
      final index = _trips.indexWhere((trip) => trip.id == id);
      if (index != -1) {
        return _trips[index];
      }
      return null;
    } catch (e) {
      _error = 'Error getting trip: $e';
      debugPrint('Error getting trip: $e');
      return null;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void refresh() {
    loadTrips();
  }
}
