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
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      guestCount,
      roomCount,
      bathroomCount,
      startDate,
      endDate,
      locationValue,
      category,
    } = params;

    // بناء كائن الاستعلام بشكل تدريجي
    const query: Prisma.ListingWhereInput = {};

    // فلترة حسب المعرف إذا وجد
    if (userId) {
      query.userId = userId;
    }

    // فلترة حسب الفئة إذا وجدت
    if (category) {
      query.category = category;
    }

    // فلترة حسب الموقع إذا وجد
    if (locationValue) {
      query.locationValue = locationValue;
    }

    // فلترة حسب عدد الغرف إذا وجد
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount, // استخدام + للتحويل إلى عدد
      };
    }

    // فلترة حسب عدد الحمامات إذا وجد
    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    // فلترة حسب عدد الضيوف إذا وجد
    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    // فلترة حسب التواريخ إذا وجدت
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // التأكد من أن التواريخ صالحة
      if (isNaN(start.getTime())) throw new Error("تاريخ البداية غير صالح");
      if (isNaN(end.getTime())) throw new Error("تاريخ النهاية غير صالح");

      // التأكد من أن تاريخ البداية قبل النهاية
      if (start > end) {
        throw new Error("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
      }

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

    // تنفيذ الاستعلام
    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    // تحويل النتائج إلى تنسيق آمن
    return listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`فشل في جلب القوائم: ${error.message}`);
    }
    throw new Error("حدث خطأ غير معروف أثناء جلب القوائم");
  }
}