class UserModel {
  final String id;
  final String? email;
  final String? name;
  final DateTime? emailVerified;
  final String? image;
  final String? hashedPassword;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String>? favoriteIds;
  final String? role;
  final DateTime? codeExpiresAt;
  final String? resetCode;

  UserModel({
    required this.id,
    this.email,
    this.name,
    this.emailVerified,
    this.image,
    this.hashedPassword,
    required this.createdAt,
    required this.updatedAt,
    this.favoriteIds,
    this.role,
    this.codeExpiresAt,
    this.resetCode,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? '',
      email: json['email'],
      name: json['name'],
      emailVerified: json['emailVerified'] != null
          ? DateTime.parse(json['emailVerified'])
          : null,
      image: json['image'],
      hashedPassword: json['hashedPassword'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      favoriteIds: json['favoriteIds'] != null
          ? List<String>.from(json['favoriteIds'])
          : null,
      role: json['role'],
      codeExpiresAt: json['codeExpiresAt'] != null
          ? DateTime.parse(json['codeExpiresAt'])
          : null,
      resetCode: json['resetCode'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'email': email,
      'name': name,
      'emailVerified': emailVerified?.toIso8601String(),
      'image': image,
      'hashedPassword': hashedPassword,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'favoriteIds': favoriteIds,
      'role': role,
      'codeExpiresAt': codeExpiresAt?.toIso8601String(),
      'resetCode': resetCode,
    };
  }

  UserModel copyWith({
    String? id,
    String? email,
    String? name,
    DateTime? emailVerified,
    String? image,
    String? hashedPassword,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<String>? favoriteIds,
    String? role,
    DateTime? codeExpiresAt,
    String? resetCode,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      emailVerified: emailVerified ?? this.emailVerified,
      image: image ?? this.image,
      hashedPassword: hashedPassword ?? this.hashedPassword,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      favoriteIds: favoriteIds ?? this.favoriteIds,
      role: role ?? this.role,
      codeExpiresAt: codeExpiresAt ?? this.codeExpiresAt,
      resetCode: resetCode ?? this.resetCode,
    );
  }

  @override
  String toString() {
    return 'UserModel(id: $id, email: $email, name: $name, role: $role)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is UserModel && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
