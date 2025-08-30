import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class UserProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;

  UserProvider() {
    _initializeUser();
  }

  Future<void> _initializeUser() async {
    _isLoading = true;
    notifyListeners();

    try {
      // Check if user is already logged in
      final currentUser = Supabase.instance.client.auth.currentUser;
      if (currentUser != null) {
        _user = currentUser;
      }

      // Listen for auth state changes
      Supabase.instance.client.auth.onAuthStateChange.listen((data) {
        final AuthChangeEvent event = data.event;
        final Session? session = data.session;

        if (event == AuthChangeEvent.signedIn && session != null) {
          _user = session.user;
          _error = null;
          debugPrint('User signed in: ${_user!.id}');
        } else if (event == AuthChangeEvent.signedOut) {
          _user = null;
          _error = null;
          debugPrint('User signed out');
        }
        notifyListeners();
      });
    } catch (e) {
      _error = e.toString();
      debugPrint('Error initializing user: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      debugPrint('Attempting login with email: $email');
      final AuthResponse res = await Supabase.instance.client.auth
          .signInWithPassword(email: email, password: password);

      if (res.user != null) {
        _user = res.user;
        debugPrint('Login successful! User ID: ${res.user!.id}');
        return true;
      } else {
        _error = 'Login failed: No user returned';
        debugPrint('Login failed: No user returned');
        return false;
      }
    } on AuthException catch (e) {
      _error = e.message;
      debugPrint('AuthException: ${e.message}');
      return false;
    } catch (e) {
      _error = 'Unexpected error: $e';
      debugPrint('Unexpected error: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> signup(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      debugPrint('Attempting signup with email: $email');
      final AuthResponse res = await Supabase.instance.client.auth.signUp(
        email: email,
        password: password,
        data: {'name': name},
      );

      if (res.user != null) {
        _user = res.user;
        debugPrint('Signup successful! User ID: ${res.user!.id}');
        return true;
      } else {
        _error = 'Signup failed: No user returned';
        debugPrint('Signup failed: No user returned');
        return false;
      }
    } on AuthException catch (e) {
      _error = e.message;
      debugPrint('AuthException: ${e.message}');
      return false;
    } catch (e) {
      _error = 'Unexpected error: $e';
      debugPrint('Unexpected error: $e');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signInWithGoogle() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      debugPrint('Attempting Google sign in...');
      await Supabase.instance.client.auth.signInWithOAuth(
        OAuthProvider.google,
        redirectTo: 'io.supabase.flutter://login-callback/',
      );
      debugPrint('Google OAuth initiated');
    } on AuthException catch (e) {
      _error = e.message;
      debugPrint('Google AuthException: ${e.message}');
    } catch (e) {
      _error = 'Google sign in error: $e';
      debugPrint('Google sign in unexpected error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    try {
      await Supabase.instance.client.auth.signOut();
      _user = null;
      _error = null;
      debugPrint('User logged out successfully');
    } catch (e) {
      _error = 'Logout error: $e';
      debugPrint('Logout error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
