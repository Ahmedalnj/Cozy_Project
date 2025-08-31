-- حل بسيط لـ RLS - السماح بالعرض فقط
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- تفعيل RLS
ALTER TABLE public."Listing" ENABLE ROW LEVEL SECURITY;

-- حذف جميع السياسات الموجودة
DROP POLICY IF EXISTS "Users can view all listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can insert their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can update their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can delete their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Allow all operations on listings" ON public."Listing";

-- سياسة واحدة بسيطة: السماح للجميع بالعرض فقط
CREATE POLICY "Allow public read access" ON public."Listing"
FOR SELECT USING (true);

-- اختبار
SELECT COUNT(*) as accessible_listings FROM public."Listing";
