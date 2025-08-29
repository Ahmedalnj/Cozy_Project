# 📱 دليل تحديث Flutter لاستخدام Next.js Backend

## 🔄 التغييرات المطلوبة

### **1. تحديث login_screen.dart**
```dart
// استبدال import
import '../../core/api_service.dart';

// في _signIn method
Future<void> _signIn() async {
  if (_formKey.currentState!.validate()) {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.login(_emailController.text, _passwordController.text);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login successful')),
        );
        Navigator.pushReplacementNamed(context, '/');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }
}

// في _signInWithGoogle method
Future<void> _signInWithGoogle() async {
  try {
    final response = await ApiService.googleSignIn();
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Google sign in successful')),
      );
      Navigator.pushReplacementNamed(context, '/');
    }
  } catch (e) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Google sign in failed: $e')),
      );
    }
  }
}
```

### **2. تحديث signup_screen.dart**
```dart
// استبدال import
import '../../core/api_service.dart';

// في _signUp method
Future<void> _signUp() async {
  if (_formKey.currentState!.validate()) {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await ApiService.signup(
        _nameController.text,
        _emailController.text,
        _passwordController.text,
      );
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Account created successfully')),
        );
        Navigator.pushReplacementNamed(context, '/login');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Signup failed: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }
}
```

### **3. تحديث home_screen.dart**
```dart
// استبدال import
import '../../core/api_service.dart';

// في _loadProperties method
Future<void> _loadProperties() async {
  setState(() {
    _isLoading = true;
  });

  try {
    final properties = await ApiService.getListings();
    setState(() {
      _properties = properties;
    });
  } catch (e) {
    debugPrint('Error loading properties: $e');
  } finally {
    setState(() {
      _isLoading = false;
    });
  }
}

// في _toggleFavorite method
Future<void> _toggleFavorite(PropertyListing property) async {
  try {
    await ApiService.toggleFavorite(property.id);
    
    setState(() {
      final index = _properties.indexWhere((p) => p.id == property.id);
      if (index != -1) {
        _properties[index] = _properties[index].copyWith(
          isFavorite: !_properties[index].isFavorite,
        );
      }
    });
  } catch (e) {
    debugPrint('Error toggling favorite: $e');
  }
}
```

### **4. تحديث favorites_screen.dart**
```dart
// استبدال import
import '../../core/api_service.dart';

// في _loadFavorites method
Future<void> _loadFavorites() async {
  setState(() {
    _isLoading = true;
  });

  try {
    final favorites = await ApiService.getFavorites();
    setState(() {
      _favorites = favorites;
    });
  } catch (e) {
    debugPrint('Error loading favorites: $e');
  } finally {
    setState(() {
      _isLoading = false;
    });
  }
}

// في _removeFromFavorites method
Future<void> _removeFromFavorites(PropertyListing property) async {
  try {
    await ApiService.toggleFavorite(property.id);
    
    setState(() {
      _favorites.removeWhere((f) => f.id == property.id);
    });
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Removed from favorites')),
      );
    }
  } catch (e) {
    debugPrint('Error removing from favorites: $e');
  }
}
```

### **5. تحديث detail_screen.dart**
```dart
// استبدال import
import '../../core/api_service.dart';

// في _loadPropertyDetails method
Future<void> _loadPropertyDetails() async {
  try {
    final details = await ApiService.getListingById(widget.property.id);
    final isFavorite = await ApiService.isFavorite(widget.property.id);
    
    setState(() {
      _propertyDetails = details;
      _isFavorite = isFavorite;
      _isLoading = false;
    });
  } catch (e) {
    debugPrint('Error loading property details: $e');
    setState(() {
      _isLoading = false;
    });
  }
}

// في _toggleFavorite method
Future<void> _toggleFavorite() async {
  try {
    await ApiService.toggleFavorite(widget.property.id);
    setState(() {
      _isFavorite = !_isFavorite;
    });
  } catch (e) {
    debugPrint('Error toggling favorite: $e');
  }
}
```

### **6. تحديث new_listing_screen.dart**
```dart
// استبدال import
import '../../core/api_service.dart';

// في _publishListing method
Future<void> _publishListing() async {
  if (_formKey.currentState!.validate()) {
    setState(() {
      _isLoading = true;
    });

    try {
      final listingData = {
        'title': _titleController.text,
        'description': _descriptionController.text,
        'locationValue': _locationController.text,
        'price': int.parse(_priceController.text),
        'roomCount': int.parse(_roomsController.text),
        'bathroomCount': int.parse(_bathroomsController.text),
        'guestCount': int.parse(_guestsController.text),
        'category': _selectedCategory,
        'imageSrc': _imageUrls,
      };

      await ApiService.addListing(listingData);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Listing published successfully')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to publish listing: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }
}
```

### **7. تحديث trips_screen.dart**
```dart
// استبدال import
import '../../core/api_service.dart';

// في _loadTrips method
Future<void> _loadTrips() async {
  setState(() {
    _isLoading = true;
  });

  try {
    final trips = await ApiService.getUserReservations();
    setState(() {
      _trips = trips;
    });
  } catch (e) {
    debugPrint('Error loading trips: $e');
  } finally {
    setState(() {
      _isLoading = false;
    });
  }
}
```

### **8. تحديث my_listings_screen.dart**
```dart
// استبدال import
import '../../core/api_service.dart';

// في _loadMyListings method
Future<void> _loadMyListings() async {
  setState(() {
    _isLoading = true;
  });

  try {
    final listings = await ApiService.getMyListings();
    setState(() {
      _myListings = listings;
    });
  } catch (e) {
    debugPrint('Error loading my listings: $e');
  } finally {
    setState(() {
      _isLoading = false;
    });
  }
}
```

### **9. تحديث account_screen.dart**
```dart
// استبدال import
import '../../core/api_service.dart';

// في _loadUserProfile method
Future<void> _loadUserProfile() async {
  try {
    final profile = await ApiService.getUserProfile();
    if (profile != null) {
      setState(() {
        _userName = profile['name'] ?? 'User';
        _userEmail = profile['email'] ?? 'user@email.com';
        _userImage = profile['image'];
      });
    }
  } catch (e) {
    debugPrint('Error loading user profile: $e');
  }
}

// في _logout method
Future<void> _logout() async {
  try {
    // Clear any stored tokens
    // Navigate to welcome screen
    if (mounted) {
      Navigator.pushNamedAndRemoveUntil(
        context,
        '/welcome',
        (route) => false,
      );
    }
  } catch (e) {
    debugPrint('Error logging out: $e');
  }
}
```

## 🔧 إعدادات إضافية

### **10. إضافة Token Management**
```dart
// lib/core/token_manager.dart
import 'package:shared_preferences/shared_preferences.dart';

class TokenManager {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> saveUser(Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(user));
  }

  static Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString(_userKey);
    if (userString != null) {
      return jsonDecode(userString);
    }
    return null;
  }

  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }
}
```

### **11. تحديث ApiService لاستخدام Token**
```dart
// في ApiService، تحديث جميع methods لاستخدام token
static Future<String?> _getStoredToken() async {
  return await TokenManager.getToken();
}

// مثال على method محدث
static Future<List<PropertyListing>> getListings() async {
  try {
    final token = await _getStoredToken();
    final response = await http.get(
      Uri.parse('$baseUrl/listings'),
      headers: _authHeaders(token),
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => PropertyListing.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load listings: ${response.body}');
    }
  } catch (e) {
    debugPrint('Get listings error: $e');
    rethrow;
  }
}
```

### **12. تحديث Authentication Flow**
```dart
// في login_screen.dart بعد تسجيل الدخول الناجح
final response = await ApiService.login(_emailController.text, _passwordController.text);

// حفظ token و user data
await TokenManager.saveToken(response['token']);
await TokenManager.saveUser(response['user']);
```

## ✅ التحقق من التحديثات

### **13. اختبار التكامل**
1. تأكد من تشغيل Next.js backend
2. اختبار تسجيل الدخول
3. اختبار جلب العقارات
4. اختبار إضافة عقار جديد
5. اختبار المفضلة
6. اختبار الحجوزات

### **14. إضافة shared_preferences dependency**
```yaml
# في pubspec.yaml
dependencies:
  shared_preferences: ^2.2.2
```

## 🐛 استكشاف الأخطاء

### **15. مشاكل شائعة**
- **Network errors**: تأكد من تشغيل backend
- **CORS errors**: تحقق من إعدادات CORS في Next.js
- **Token errors**: تحقق من حفظ واسترجاع token
- **Data format errors**: تحقق من تنسيق البيانات المرسلة والمستلمة

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من console logs
2. تأكد من صحة API endpoints
3. تحقق من تنسيق البيانات
4. تأكد من تشغيل backend
