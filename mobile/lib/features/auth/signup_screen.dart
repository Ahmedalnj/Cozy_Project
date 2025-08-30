import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/supabase_client.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirm = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirm.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    try {
      debugPrint('Attempting signup with email: ${_email.text}');
      final AuthResponse res = await Supabase.instance.client.auth.signUp(
        email: _email.text,
        password: _password.text,
      );
      setState(() => _loading = false);
      if (res.user != null) {
        debugPrint('Signup successful! User ID: ${res.user!.id}');
        // Create user profile in User table
        try {
          await SupabaseService.createUserProfile({
            '_id': res.user!.id,
            'email': _email.text,
            'name': _name.text,
            'createdAt': DateTime.now().toIso8601String(),
            'updatedAt': DateTime.now().toIso8601String(),
            'favoriteIds': [],
            'role': 'USER',
          });
          debugPrint('User profile created successfully');
        } catch (e) {
          debugPrint('Error creating user profile: $e');
        }

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Account created successfully!')),
          );
          // Navigate to login screen after successful signup
          Navigator.pushReplacementNamed(context, '/login');
        }
      } else {
        debugPrint('Signup failed: No user returned');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to create account')),
          );
        }
      }
    } on AuthException catch (e) {
      setState(() => _loading = false);
      debugPrint('AuthException: ${e.message}');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message)),
        );
      }
    } catch (e) {
      setState(() => _loading = false);
      debugPrint('Unexpected error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Unexpected error: $e')),
        );
      }
    }
  }

  Future<void> _signInWithGoogle() async {
    setState(() => _loading = true);
    try {
      debugPrint('Attempting Google sign up...');
      await Supabase.instance.client.auth.signInWithOAuth(
        OAuthProvider.google,
        redirectTo: 'io.supabase.flutter://login-callback/',
      );
      setState(() => _loading = false);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Redirecting to Google...')),
        );
      }
    } on AuthException catch (e) {
      setState(() => _loading = false);
      debugPrint('Google AuthException: ${e.message}');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.message)),
        );
      }
    } catch (e) {
      setState(() => _loading = false);
      debugPrint('Google sign up unexpected error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Google sign up error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            width: 370,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.of(context).maybePop(),
                    ),
                    const Spacer(),
                    const Text(
                      "Create account",
                      style:
                          TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
                    ),
                    const Spacer(flex: 2),
                  ],
                ),
                const SizedBox(height: 8),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    "Welcome to Cozy",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    "Create an account!",
                    style: TextStyle(
                      color: Colors.black54,
                      fontSize: 15,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _name,
                        decoration: const InputDecoration(
                          labelText: "Name",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(8)),
                          ),
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                        ),
                        validator: (v) =>
                            (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _email,
                        decoration: const InputDecoration(
                          labelText: "Email",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(8)),
                          ),
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                        ),
                        keyboardType: TextInputType.emailAddress,
                        validator: (v) =>
                            (v == null || v.isEmpty) ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _password,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: "Password",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(8)),
                          ),
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                        ),
                        validator: (v) => (v == null || v.length < 6)
                            ? 'At least 6 characters'
                            : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _confirm,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: "Confirm Password",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(8)),
                          ),
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                        ),
                        validator: (v) => (v == null || v != _password.text)
                            ? 'Passwords do not match'
                            : null,
                      ),
                      const SizedBox(height: 24),
                      // Continue button
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: FilledButton(
                          style: FilledButton.styleFrom(
                            backgroundColor: Colors.pink.shade400,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            textStyle: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                          onPressed: _loading ? null : _submit,
                          child: _loading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Text("Continue"),
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Google button
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            side: BorderSide(color: Colors.grey.shade300),
                            backgroundColor: Colors.white,
                          ),
                          icon: Image.asset(
                            'assets/images/google_icon.png',
                            height: 22,
                            width: 22,
                            errorBuilder: (c, e, s) => Container(
                              width: 22,
                              height: 22,
                              decoration: BoxDecoration(
                                color: Colors.grey.shade600,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Icon(
                                Icons.g_mobiledata,
                                color: Colors.white,
                                size: 16,
                              ),
                            ),
                          ),
                          label: const Text(
                            "Continue with Google",
                            style: TextStyle(
                              color: Colors.black87,
                              fontWeight: FontWeight.w500,
                              fontSize: 15,
                            ),
                          ),
                          onPressed: _loading ? null : _signInWithGoogle,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                // Footer - Login link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      "Already have an account? ",
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.black87,
                      ),
                    ),
                    GestureDetector(
                      onTap: () =>
                          Navigator.pushReplacementNamed(context, '/login'),
                      child: Text(
                        "Login",
                        style: TextStyle(
                          color: Colors.pink.shade400,
                          fontWeight: FontWeight.w600,
                          fontSize: 13.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
