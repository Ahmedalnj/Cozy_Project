import 'package:flutter/material.dart';
import '../features/home/home_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/signup_screen.dart';

class AppRouter {
  static const home = '/';
  static const login = '/login';
  static const signup = '/signup';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case signup:
        return MaterialPageRoute(builder: (_) => const SignupScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(
            body: Center(child: Text('404')),
          ),
        );
    }
  }
}
