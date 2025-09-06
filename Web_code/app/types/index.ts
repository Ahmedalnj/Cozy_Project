import type { Listing, Reservation, User, Review } from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  reviewStats?: {
    count: number;
    averageRating: number;
  };
};

export type SaveReservation = Omit<
  Reservation,
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  id: string;
  user: {
    name: string | null;
    email: string | null;
    image?: string | null;
  };
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
  payment?: {
    id: string;
    status: string;
    paymentMethod: string | null; // السماح بالقيمة null
    amount: number;
  } | null;
};

export type SafeReview = Omit<Review, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    email: string | null;
    image?: string | null;
  };
};

// تعريف نوع SafeUser مع الحقول المناسبة
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string; // تحويل تاريخ الإنشاء إلى string
  updatedAt: string; // تحويل تاريخ التحديث إلى string
  emailVerified: string | null; // الحفاظ على نوع البريد الإلكتروني المؤكد كـ string أو null
};

export type PublicUser = Pick<
  User,
  "id" | "name" | "email" | "role" | "image" | "hostStatus"
> & {
  createdAt: string;
  image?: string | null;
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("ar-LY", {
    style: "currency",
    currency: "LYD",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(amount);
