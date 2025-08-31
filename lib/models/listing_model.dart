class ListingModel {
  final String id;
  final String title;
  final String description;
  final DateTime createdAt;
  final String category;
  final int roomCount;
  final int bathroomCount;
  final int guestCount;
  final String locationValue;
  final int price;
  final String userId;
  final List<String>? imageSrc;
  final List<String>? offers;

  ListingModel({
    required this.id,
    required this.title,
    required this.description,
    required this.createdAt,
    required this.category,
    required this.roomCount,
    required this.bathroomCount,
    required this.guestCount,
    required this.locationValue,
    required this.price,
    required this.userId,
    this.imageSrc,
    this.offers,
  });

  factory ListingModel.fromJson(Map<String, dynamic> json) {
    return ListingModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      createdAt: DateTime.parse(json['createdAt']),
      category: json['category'] ?? '',
      roomCount: json['roomCount'] ?? 0,
      bathroomCount: json['bathroomCount'] ?? 0,
      guestCount: json['guestCount'] ?? 0,
      locationValue: json['locationValue'] ?? '',
      price: json['price'] ?? 0,
      userId: json['user_id'] ?? '',
      imageSrc: json['imageSrc'] != null 
          ? List<String>.from(json['imageSrc'])
          : null,
      offers: json['offers'] != null 
          ? List<String>.from(json['offers'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'description': description,
      'createdAt': createdAt.toIso8601String(),
      'category': category,
      'roomCount': roomCount,
      'bathroomCount': bathroomCount,
      'guestCount': guestCount,
      'locationValue': locationValue,
      'price': price,
      'user_id': userId,
      'imageSrc': imageSrc,
      'offers': offers,
    };
  }

  @override
  String toString() {
    return 'ListingModel(id: $id, title: $title, price: $price, location: $locationValue)';
  }
}
