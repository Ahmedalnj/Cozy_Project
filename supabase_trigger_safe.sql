-- تنفيذ Trigger فقط أولاً (آمن)
-- هذا سيحل مشكلة إنشاء سجلات User تلقائياً

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (
    _id,
    email,
    name,
    "emailVerified",
    image,
    "hashedPassword",
    "createdAt",
    "updatedAt",
    "favoriteIds",
    role,
    "codeExpiresAt",
    "resetCode"
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    CASE 
      WHEN NEW.email_confirmed_at IS NOT NULL THEN NEW.email_confirmed_at
      ELSE NULL
    END,
    NEW.raw_user_meta_data->>'avatar_url',
    NULL, -- hashedPassword سيتم إدارته من قبل Supabase Auth
    NOW(),
    NOW(),
    ARRAY[]::uuid[], -- مصفوفة فارغة للمفضلة
    'USER',
    NULL, -- codeExpiresAt
    NULL  -- resetCode
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- تسجيل الخطأ ولكن لا نوقف العملية
    RAISE LOG 'Error creating user record: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
