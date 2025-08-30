-- إعادة تفعيل RLS للجداول
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Listing" ENABLE ROW LEVEL SECURITY;

-- حذف أي policies موجودة (اختياري)
DROP POLICY IF EXISTS "Users can insert their own records" ON "User";
DROP POLICY IF EXISTS "Users can view their own records" ON "User";
DROP POLICY IF EXISTS "Users can update their own records" ON "User";

-- إضافة policies جديدة لجدول User
CREATE POLICY "Users can insert their own records" ON "User"
FOR INSERT WITH CHECK (auth.uid()::text = _id::text);

CREATE POLICY "Users can view their own records" ON "User"
FOR SELECT USING (auth.uid()::text = _id::text);

CREATE POLICY "Users can update their own records" ON "User"
FOR UPDATE USING (auth.uid()::text = _id::text);

-- إضافة policies لجدول Listing (إذا كان موجود)
CREATE POLICY "Users can view all listings" ON "Listing"
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own listings" ON "Listing"
FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own listings" ON "Listing"
FOR UPDATE USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete their own listings" ON "Listing"
FOR DELETE USING (auth.uid()::text = "userId"::text);
