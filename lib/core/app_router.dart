import 'package:flutter/material.dart';
import '../features/home/home_screen.dart';
import '../features/auth/welcome_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/signup_screen.dart';
import '../features/favorites/favorites_screen.dart';
import '../features/trips/trips_screen.dart';
import '../features/listings/detail_screen.dart';
import '../features/listings/new_listing_screen.dart';
import '../features/my_listings/my_listings_screen.dart';
import '../features/account/account_screen.dart';

class AppRouter {
  static const home = '/';
  static const welcome = '/welcome';
  static const login = '/login';
  static const signup = '/signup';
  static const favorites = '/favorites';
  static const trips = '/trips';
  static const myListings = '/my-listings';
  static const account = '/account';
  static const detail = '/detail';
  static const newListing = '/new-listing';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case welcome:
        return MaterialPageRoute(builder: (_) => const WelcomeScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case signup:
        return MaterialPageRoute(builder: (_) => const SignupScreen());
      case favorites:
        return MaterialPageRoute(builder: (_) => const FavoritesScreen());
      case trips:
        return MaterialPageRoute(builder: (_) => const TripsScreen());
      case detail:
        final property = settings.arguments as dynamic;
        return MaterialPageRoute(
          builder: (_) => DetailScreen(property: property),
        );
      case newListing:
        return MaterialPageRoute(
          builder: (_) => const NewListingScreen(),
        );
      case myListings:
        return MaterialPageRoute(builder: (_) => const MyListingsScreen());
      case account:
        return MaterialPageRoute(builder: (_) => const AccountScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(
            body: Center(child: Text('404')),
          ),
        );
    }
  }
}
