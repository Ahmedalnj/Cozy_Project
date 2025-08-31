-- إصلاح RLS Policies لجدول Listing - النسخة النهائية
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- أولاً، تأكد من تفعيل RLS
ALTER TABLE public."Listing" ENABLE ROW LEVEL SECURITY;

-- حذف السياسات الموجودة (إذا وجدت)
DROP POLICY IF EXISTS "Users can view all listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can insert their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can update their own listings" ON public."Listing";
DROP POLICY IF EXISTS "Users can delete their own listings" ON public."Listing";

-- إنشاء سياسات جديدة
-- السماح للجميع بعرض العقارات (مهم!)
CREATE POLICY "Users can view all listings" ON public."Listing"
FOR SELECT USING (true);

-- السماح للمستخدمين بإضافة عقاراتهم
CREATE POLICY "Users can insert their own listings" ON public."Listing"
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- السماح للمستخدمين بتحديث عقاراتهم
CREATE POLICY "Users can update their own listings" ON public."Listing"
FOR UPDATE USING (auth.uid()::text = user_id::text);

-- السماح للمستخدمين بحذف عقاراتهم
CREATE POLICY "Users can delete their own listings" ON public."Listing"
FOR DELETE USING (auth.uid()::text = user_id::text);

-- اختبار السياسات
SELECT COUNT(*) as total_listings FROM public."Listing";
