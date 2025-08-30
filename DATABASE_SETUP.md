# 🗄️ إعداد قاعدة البيانات في Supabase

## 📋 الخطوات المطلوبة:

### 1. اذهب إلى Supabase SQL Editor:
1. افتح [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. اختر مشروعك: `Cozy`
3. اذهب إلى **SQL Editor** (في القائمة الجانبية)

### 2. انسخ والصق الكود التالي:

```sql
-- Create the properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.0,
    distance VARCHAR(100),
    dates VARCHAR(100),
    price INTEGER NOT NULL,
    image_url TEXT,
    description TEXT,
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    max_guests INTEGER DEFAULT 2,
    amenities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Create the users table for additional user information
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for properties table
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Properties can be created by authenticated users" ON properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Properties can be updated by owner" ON properties
    FOR UPDATE USING (auth.uid()::text = created_by::text);

CREATE POLICY "Properties can be deleted by owner" ON properties
    FOR DELETE USING (auth.uid()::text = created_by::text);

-- Create policies for favorites table
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_profiles table
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Add a created_by column to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Create a function to automatically set created_by
CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set created_by
CREATE TRIGGER set_properties_created_by
    BEFORE INSERT ON properties
    FOR EACH ROW
    EXECUTE FUNCTION set_created_by();

-- Insert sample data
INSERT INTO properties (title, location, rating, distance, dates, price, image_url, description, bedrooms, bathrooms, max_guests, amenities) VALUES
('Beachfront Villa, Dubai', 'Dubai, UAE', 4.85, '3,456 kilometers away', 'Jun 24-29', 550, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop', 'Luxurious beachfront villa with stunning ocean views', 4, 3, 8, ARRAY['WiFi', 'Pool', 'Kitchen', 'Parking', 'Air Conditioning']),
('Downtown Apartment, Riyadh', 'Riyadh, Saudi Arabia', 4.92, '1,234 kilometers away', 'Jul 1-6', 320, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', 'Modern apartment in the heart of Riyadh', 2, 2, 4, ARRAY['WiFi', 'Gym', 'Kitchen', 'Balcony', 'Air Conditioning']),
('Mountain Cabin, Jeddah', 'Jeddah, Saudi Arabia', 4.78, '2,100 kilometers away', 'Aug 15-20', 280, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', 'Cozy mountain cabin with scenic views', 3, 2, 6, ARRAY['WiFi', 'Fireplace', 'Kitchen', 'Hiking Trails', 'Mountain Views']),
('Luxury Penthouse, Abu Dhabi', 'Abu Dhabi, UAE', 4.95, '4,200 kilometers away', 'Sep 10-15', 750, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', 'Ultra-luxurious penthouse with city skyline views', 5, 4, 10, ARRAY['WiFi', 'Infinity Pool', 'Chef Kitchen', 'Helipad', 'Concierge Service']),
('Desert Resort Villa', 'Al Ula, Saudi Arabia', 4.88, '1,800 kilometers away', 'Oct 5-10', 420, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop', 'Unique desert resort experience', 3, 3, 6, ARRAY['WiFi', 'Desert Tours', 'Spa', 'Restaurant', 'Stargazing']),
('Modern Loft, Dammam', 'Dammam, Saudi Arabia', 4.76, '950 kilometers away', 'Nov 12-17', 290, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop', 'Contemporary loft in vibrant Dammam', 1, 1, 2, ARRAY['WiFi', 'Workspace', 'Kitchen', 'City Views', 'Air Conditioning']);
```

### 3. اضغط "Run" لتنفيذ الكود

### 4. تحقق من إنشاء الجداول:
- اذهب إلى **Table Editor**
- ستجد الجداول التالية:
  - `properties`
  - `favorites`
  - `user_profiles`

## ✅ بعد إنشاء الجداول:

1. **جرب إنشاء حساب جديد** في التطبيق
2. **تأكد من نجاح العملية**
3. **تحقق من وجود المستخدم** في Authentication > Users
4. **تحقق من وجود البيانات** في Table Editor

## 🔍 استكشاف الأخطاء:

إذا واجهت مشاكل:
- تأكد من تنفيذ الكود بالكامل
- تحقق من وجود الجداول في Table Editor
- راجع console logs للأخطاء

## 📞 الدعم:

إذا واجهت مشاكل، تحقق من:
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
