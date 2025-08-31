-- تعطيل RLS على جميع الجداول
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- تعطيل RLS على جدول Listing
ALTER TABLE public."Listing" DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS على جدول User
ALTER TABLE public."User" DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS على جدول Reservation
ALTER TABLE public."Reservation" DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS على جدول reviews
ALTER TABLE public."reviews" DISABLE ROW LEVEL SECURITY;

-- تعطيل RLS على جدول payments
ALTER TABLE public."payments" DISABLE ROW LEVEL SECURITY;

-- التحقق من حالة RLS
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('Listing', 'User', 'Reservation', 'reviews', 'payments');

-- اختبار الوصول
SELECT COUNT(*) as total_listings FROM public."Listing";
