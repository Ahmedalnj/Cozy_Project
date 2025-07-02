import type { User } from "@prisma/client";

// تعريف نوع SafeUser مع الحقول المناسبة
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string; // تحويل تاريخ الإنشاء إلى string
  updatedAt: string; // تحويل تاريخ التحديث إلى string
  emailVerified: string | null; // الحفاظ على نوع البريد الإلكتروني المؤكد كـ string أو null
};