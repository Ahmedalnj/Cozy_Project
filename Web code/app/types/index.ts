import type { Listing, User } from "@prisma/client";

export type SafeListing = Omit<
  Listing,
  "createdAt"

> & {
  crearedAt: string; // تحويل تاريخ الإنشاء إلى string
}

// تعريف نوع SafeUser مع الحقول المناسبة
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string; // تحويل تاريخ الإنشاء إلى string
  updatedAt: string; // تحويل تاريخ التحديث إلى string
  emailVerified: string | null; // الحفاظ على نوع البريد الإلكتروني المؤكد كـ string أو null
};