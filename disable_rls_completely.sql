-- تعطيل RLS تماماً على جدول Listing
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- تعطيل RLS على جدول Listing
ALTER TABLE public."Listing" DISABLE ROW LEVEL SECURITY;

-- حذف جميع السياسات
DROP POLICY IF EXISTS "Users can view all listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can insert their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can update their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can delete their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Allow public read access" ON public."Listing";

-- اختبار الوصول
SELECT COUNT(*) as total_listings FROM public."Listing";

-- عرض بعض العقارات للتأكد
SELECT title, price, "locationValue" FROM public."Listing" LIMIT 3;
