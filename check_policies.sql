-- التحقق من السياسات الموجودة على جدول Listing
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- التحقق من السياسات
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'Listing';

-- اختبار الوصول المباشر
SELECT COUNT(*) as direct_access_test FROM public."Listing";

-- عرض بعض العقارات
SELECT title, price, "locationValue" FROM public."Listing" LIMIT 3;
