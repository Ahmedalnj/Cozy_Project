import type { Listing, Reservation, User } from "@prisma/client";

export type SafeListing = Omit<
  Listing,
  "createdAt"

> & {
  createdAt: string; // تحويل تاريخ الإنشاء إلى string
}

export type SaveReservation =Omit<
Reservation,
"createdAt" | "startDate" | "endDate" |"listing" 
>&{
  createdAt :string;
  startDate :string;
  endDate:string;
  listing:SafeListing;
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