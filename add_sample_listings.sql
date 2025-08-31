-- إضافة بيانات تجريبية لجدول Listing
-- قم بتنفيذ هذا الكود في Supabase SQL Editor

-- أولاً، تأكد من وجود مستخدمين في جدول User
-- إذا لم يكن لديك مستخدمين، قم بإنشاء حساب جديد من التطبيق أولاً

-- إضافة عقارات تجريبية
INSERT INTO public."Listing" (
  _id,
  title,
  description,
  "createdAt",
  category,
  "roomCount",
  "bathroomCount",
  "guestCount",
  "locationValue",
  price,
  user_id,
  "imageSrc",
  offers
) VALUES 
(
  gen_random_uuid(),
  'فيلا فاخرة في دبي مارينا',
  'فيلا حديثة مع إطلالة رائعة على البحر، 3 غرف نوم، مطبخ مجهز بالكامل، حديقة خاصة',
  NOW(),
  'فيلا',
  3,
  2,
  6,
  'دبي مارينا، دبي، الإمارات العربية المتحدة',
  800,
  (SELECT _id FROM public."User" LIMIT 1), -- استخدم أول مستخدم موجود
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
  ARRAY['واي فاي مجاني', 'موقف سيارات', 'مسبح']
),
(
  gen_random_uuid(),
  'شقة عصرية في أبو ظبي',
  'شقة أنيقة في قلب أبو ظبي، قريبة من جميع الخدمات، 2 غرف نوم، مطبخ مفتوح',
  NOW(),
  'شقة',
  2,
  1,
  4,
  'كورنيش أبو ظبي، أبو ظبي، الإمارات العربية المتحدة',
  500,
  (SELECT _id FROM public."User" LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
  ARRAY['واي فاي مجاني', 'صالة رياضية', 'مطعم']
),
(
  gen_random_uuid(),
  'بيت تقليدي في الشارقة',
  'بيت عربي أصيل مع ساحة داخلية، 4 غرف نوم، مطبخ تقليدي، حديقة عربية',
  NOW(),
  'بيت',
  4,
  3,
  8,
  'قلب الشارقة، الشارقة، الإمارات العربية المتحدة',
  600,
  (SELECT _id FROM public."User" LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
  ARRAY['حديقة عربية', 'مطبخ تقليدي', 'موقف سيارات']
),
(
  gen_random_uuid(),
  'استوديو في العين',
  'استوديو حديث ومريح، مناسب للعزاب أو الأزواج، مطبخ مجهز، حمام خاص',
  NOW(),
  'استوديو',
  1,
  1,
  2,
  'العين، أبو ظبي، الإمارات العربية المتحدة',
  300,
  (SELECT _id FROM public."User" LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
  ARRAY['واي فاي مجاني', 'تكييف مركزي', 'غسالة']
),
(
  gen_random_uuid(),
  'فيلا عائلية في رأس الخيمة',
  'فيلا كبيرة مناسبة للعائلات، 5 غرف نوم، 4 حمامات، مسبح خاص، حديقة واسعة',
  NOW(),
  'فيلا',
  5,
  4,
  12,
  'رأس الخيمة، الإمارات العربية المتحدة',
  1200,
  (SELECT _id FROM public."User" LIMIT 1),
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
  ARRAY['مسبح خاص', 'حديقة واسعة', 'موقف سيارات', 'مطبخ خارجي']
);

-- عرض العقارات المضافة
SELECT * FROM public."Listing" ORDER BY "createdAt" DESC;
