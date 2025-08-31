-- حل سريع لإصلاح RLS لجدول Listing
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- أولاً، تحقق من عدد العقارات الموجودة
SELECT COUNT(*) as existing_listings FROM public."Listing";

-- عرض بعض العقارات للتأكد
SELECT title, price, "locationValue" FROM public."Listing" LIMIT 3;

-- إصلاح RLS Policies
-- حذف السياسات الموجودة
DROP POLICY IF EXISTS "Users can view all listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can insert their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can update their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can delete their own listings" ON public."Listing";

-- إنشاء سياسة واحدة تسمح بالوصول الكامل (للاختبار)
CREATE POLICY "Allow all operations on listings" ON public."Listing"
FOR ALL USING (true) WITH CHECK (true);

-- اختبار الوصول
SELECT COUNT(*) as accessible_listings FROM public."Listing";
