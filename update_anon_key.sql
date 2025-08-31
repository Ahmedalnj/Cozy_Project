-- اختبار Anon Key
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- اختبار الوصول باستخدام Anon Key
SELECT COUNT(*) as test_access FROM public."Listing";

-- عرض العقارات للتأكد
SELECT title, price, "locationValue" FROM public."Listing" LIMIT 5;
