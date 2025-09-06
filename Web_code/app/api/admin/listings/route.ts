// app/api/admin/listings/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "غير مصرح لك. سجل الدخول أولاً" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول لهذه البيانات" },
        { status: 403 }
      );
    }

    const listings = await prisma.listing.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      listings.map((listing) => {
        // حساب إحصائيات المراجعات
        const reviewCount = listing.reviews.length;
        const averageRating =
          reviewCount > 0
            ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviewCount
            : 0;

        return {
          ...listing,
          createdAt: listing.createdAt.toISOString(),
          reviewStats: {
            count: reviewCount,
            averageRating: Math.round(averageRating * 10) / 10,
          },
          reviews: undefined, // إزالة بيانات المراجعات الكاملة
        };
      })
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "فشل في جلب العقارات";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
