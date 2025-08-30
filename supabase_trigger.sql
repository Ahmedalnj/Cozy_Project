-- إنشاء trigger تلقائي لإنشاء سجل في جدول User
-- عند إنشاء مستخدم جديد في auth.users

-- أولاً، إنشاء function محسنة
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (
    _id,
    email,
    name,
    "emailVerified",
    image,
    "hashedPassword",
    "createdAt",
    "updatedAt",
    "favoriteIds",
    role,
    "codeExpiresAt",
    "resetCode"
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    CASE 
      WHEN NEW.email_confirmed_at IS NOT NULL THEN NEW.email_confirmed_at
      ELSE NULL
    END,
    NEW.raw_user_meta_data->>'avatar_url',
    NULL, -- hashedPassword سيتم إدارته من قبل Supabase Auth
    NOW(),
    NOW(),
    ARRAY[]::uuid[], -- مصفوفة فارغة للمفضلة
    'USER',
    NULL, -- codeExpiresAt
    NULL  -- resetCode
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- تسجيل الخطأ ولكن لا نوقف العملية
    RAISE LOG 'Error creating user record: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- إضافة policies محسنة لجميع الجداول
-- User table policies
DROP POLICY IF EXISTS "Users can insert their own records" ON "User";
DROP POLICY IF EXISTS "Users can view their own records" ON "User";
DROP POLICY IF EXISTS "Users can update their own records" ON "User";

CREATE POLICY "Users can insert their own records" ON "User"
FOR INSERT WITH CHECK (auth.uid()::text = _id::text);

CREATE POLICY "Users can view their own records" ON "User"
FOR SELECT USING (auth.uid()::text = _id::text);

CREATE POLICY "Users can update their own records" ON "User"
FOR UPDATE USING (auth.uid()::text = _id::text);

-- Listing table policies
DROP POLICY IF EXISTS "Users can view all listings" ON "Listing";
DROP POLICY IF EXISTS "Users can insert their own listings" ON "Listing";
DROP POLICY IF EXISTS "Users can update their own listings" ON "Listing";
DROP POLICY IF EXISTS "Users can delete their own listings" ON "Listing";

CREATE POLICY "Users can view all listings" ON "Listing"
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own listings" ON "Listing"
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own listings" ON "Listing"
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own listings" ON "Listing"
FOR DELETE USING (auth.uid()::text = user_id::text);

-- Reservation table policies
DROP POLICY IF EXISTS "Users can view their reservations" ON "Reservation";
DROP POLICY IF EXISTS "Users can create reservations" ON "Reservation";
DROP POLICY IF EXISTS "Users can update their reservations" ON "Reservation";
DROP POLICY IF EXISTS "Users can delete their reservations" ON "Reservation";

CREATE POLICY "Users can view their reservations" ON "Reservation"
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create reservations" ON "Reservation"
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their reservations" ON "Reservation"
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their reservations" ON "Reservation"
FOR DELETE USING (auth.uid()::text = user_id::text);

-- Reviews table policies
DROP POLICY IF EXISTS "Users can view all reviews" ON "reviews";
DROP POLICY IF EXISTS "Users can create reviews" ON "reviews";
DROP POLICY IF EXISTS "Users can update their reviews" ON "reviews";
DROP POLICY IF EXISTS "Users can delete their reviews" ON "reviews";

CREATE POLICY "Users can view all reviews" ON "reviews"
FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON "reviews"
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their reviews" ON "reviews"
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their reviews" ON "reviews"
FOR DELETE USING (auth.uid()::text = user_id::text);
