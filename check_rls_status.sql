-- التحقق من حالة RLS على جدول Listing
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- التحقق من حالة RLS
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'Listing';

-- التحقق من السياسات الموجودة
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
