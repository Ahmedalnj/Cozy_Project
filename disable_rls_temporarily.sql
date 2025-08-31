-- تعطيل RLS مؤقتاً على جدول Listing
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- تعطيل RLS على جدول Listing
ALTER TABLE public."Listing" DISABLE ROW LEVEL SECURITY;

-- اختبار الوصول
SELECT COUNT(*) as total_listings FROM public."Listing";

-- عرض العقارات
SELECT title, price, "locationValue" FROM public."Listing" LIMIT 5;
