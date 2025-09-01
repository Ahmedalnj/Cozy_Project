import { Prisma } from "@prisma/client";
import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export default async function getListings(params: IListingsParams) {
  const {
    userId,
    guestCount,
    roomCount,
    bathroomCount,
    startDate,
    endDate,
    locationValue,
    category,
    minPrice,
    maxPrice,
  } = params;

  const query: Prisma.ListingWhereInput = {};

  if (userId) query.userId = userId;
  if (category) query.category = category;
  if (locationValue) query.locationValue = locationValue;
  if (roomCount) query.roomCount = { gte: +roomCount };
  if (bathroomCount) query.bathroomCount = { gte: +bathroomCount };
  if (guestCount) query.guestCount = { gte: +guestCount };
  if (minPrice && maxPrice) {
    query.price = { gte: +minPrice, lte: +maxPrice };
  } else if (minPrice) {
    query.price = { gte: +minPrice };
  } else if (maxPrice) {
    query.price = { lte: +maxPrice };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) throw new Error("تاريخ البداية غير صالح");
    if (isNaN(end.getTime())) throw new Error("تاريخ النهاية غير صالح");
    if (start > end)
      throw new Error("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");

    query.NOT = {
      reservations: {
        some: {
          OR: [
            {
              startDate: { lte: end },
              endDate: { gte: start },
            },
          ],
        },
      },
    };
  }

  const listings = await prisma.listing.findMany({
    where: query,
    include: {
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return listings.map((listing) => {
    // حساب إحصائيات المراجعات
    const reviewCount = listing.reviews.length;
    const averageRating = reviewCount > 0 
      ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      reviewStats: {
        count: reviewCount,
        averageRating: Math.round(averageRating * 10) / 10, // تقريب إلى رقم عشري واحد
      },
      reviews: undefined, // إزالة بيانات المراجعات الكاملة
    };
  });
}
