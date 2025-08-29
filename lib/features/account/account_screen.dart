import 'package:flutter/material.dart';
import '../../core/api_service.dart';
import '../../core/token_manager.dart';
import '../../shared/widgets/bottom_nav_bar.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key});

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  String? _userName;
  String? _userEmail;
  String? _userImage;
  int _selectedIndex = 4; // Account tab
  String _selectedLanguage = 'English';

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    try {
      final user = await TokenManager.getUser();
      if (user != null) {
        final profile = await ApiService.getUserProfile();
        setState(() {
          _userName = profile?['name'] ?? 'User';
          _userEmail = user['email'] ?? 'user@email.com';
          _userImage = profile?['image'];
        });
      }
    } catch (e) {
      debugPrint('Error loading user profile: $e');
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
        Navigator.pushReplacementNamed(context, '/trips');
        break;
      case 3: // My Listings
        Navigator.pushReplacementNamed(context, '/my-listings');
        break;
      case 4: // Account
        // Already on account screen
        break;
    }
  }

  Future<void> _showLanguageDialog() async {
    final result = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Language'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile<String>(
              title: const Text('English'),
              value: 'English',
              groupValue: _selectedLanguage,
              onChanged: (value) {
                setState(() {
                  _selectedLanguage = value!;
                });
                Navigator.pop(context, value);
              },
            ),
            RadioListTile<String>(
              title: const Text('العربية'),
              value: 'Arabic',
              groupValue: _selectedLanguage,
              onChanged: (value) {
                setState(() {
                  _selectedLanguage = value!;
                });
                Navigator.pop(context, value);
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );

    if (result != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Language changed to $result'),
          backgroundColor: Colors.pink,
        ),
      );
    }
  }

  void _showPrivacyPolicy() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Privacy Policy'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Cozy Privacy Policy',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Last updated: December 2024',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                '1. Information We Collect',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'We collect information you provide directly to us, such as when you create an account, make a reservation, or contact us for support.',
              ),
              const SizedBox(height: 16),
              const Text(
                '2. How We Use Your Information',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.',
              ),
              const SizedBox(height: 16),
              const Text(
                '3. Information Sharing',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.',
              ),
              const SizedBox(height: 16),
              const Text(
                '4. Data Security',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
              ),
              const SizedBox(height: 16),
              const Text(
                '5. Your Rights',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                'You have the right to access, update, or delete your personal information. You can also opt out of certain communications.',
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Help & Support'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.support_agent,
              size: 48,
              color: Colors.pink,
            ),
            const SizedBox(height: 16),
            const Text(
              'Need help? Contact our support team:',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Cozy@help.ly',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.pink,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            const Text(
              'We\'re here to help you with any questions or issues you may have.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.grey,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Future<void> _logout() async {
    try {
      await TokenManager.clearToken();
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Account',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        backgroundColor: Colors.grey[100],
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // User Profile Section
            _buildUserProfile(),
            const SizedBox(height: 40),

            // Settings Section
            _buildSettingsSection(),
            const SizedBox(height: 40),

            // Logout Button
            _buildLogoutButton(),
          ],
        ),
      ),
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _selectedIndex,
        onTap: _onNavBarTap,
      ),
    );
  }

  Widget _buildUserProfile() {
    return Column(
      children: [
        // Profile Picture
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.grey[200],
            image: _userImage != null
                ? DecorationImage(
                    image: NetworkImage(_userImage!),
                    fit: BoxFit.cover,
                  )
                : null,
          ),
          child: _userImage == null
              ? Icon(
                  Icons.person,
                  size: 50,
                  color: Colors.grey[400],
                )
              : null,
        ),
        const SizedBox(height: 16),

        // User Name
        Text(
          _userName ?? 'User',
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),

        // User Email
        Text(
          _userEmail ?? 'user@email.com',
          style: const TextStyle(
            fontSize: 16,
            color: Colors.pink,
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Settings',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 16),

        // Settings Items
        _buildSettingsItem(
          icon: Icons.language,
          title: 'Change Language',
          subtitle: _selectedLanguage,
          onTap: _showLanguageDialog,
        ),
        _buildSettingsItem(
          icon: Icons.home,
          title: 'My Listings',
          onTap: () => Navigator.pushNamed(context, '/my-listings'),
        ),
        _buildSettingsItem(
          icon: Icons.add_home,
          title: 'Add New Listing',
          onTap: () => Navigator.pushNamed(context, '/new-listing'),
        ),
        _buildSettingsItem(
          icon: Icons.notifications,
          title: 'Notifications',
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Coming Soon'),
                backgroundColor: Colors.pink,
              ),
            );
          },
        ),
        _buildSettingsItem(
          icon: Icons.privacy_tip,
          title: 'Privacy',
          onTap: _showPrivacyPolicy,
        ),
        _buildSettingsItem(
          icon: Icons.help,
          title: 'Help',
          onTap: _showHelpDialog,
        ),
      ],
    );
  }

  Widget _buildSettingsItem({
    required IconData icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          color: Colors.pink,
          size: 20,
        ),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: Colors.black87,
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            )
          : null,
      trailing: const Icon(
        Icons.arrow_forward_ios,
        size: 16,
        color: Colors.grey,
      ),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(vertical: 4),
    );
  }

  Widget _buildLogoutButton() {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: FilledButton(
        onPressed: _logout,
        style: FilledButton.styleFrom(
          backgroundColor: Colors.pink,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: const Text(
          'Logout',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
