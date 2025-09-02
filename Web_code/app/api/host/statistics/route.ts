import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    // جلب المستخدم
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.hostStatus !== "APPROVED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    // جلب عدد العقارات
    const propertiesCount = await prisma.listing.count({
      where: { userId: user.id },
    });

    // جلب عدد الحجوزات
    const reservationsCount = await prisma.reservation.count({
      where: { 
        listing: { userId: user.id }
      },
    });

    // جلب متوسط التقييم
    const reviews = await prisma.review.findMany({
      where: { 
        listing: { userId: user.id }
      },
      select: { rating: true },
    });

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    // جلب الإيرادات (مجموع المدفوعات الناجحة)
    const totalRevenue = await prisma.payment.aggregate({
      where: {
        listing: { userId: user.id },
        status: { in: ["SUCCESS", "PAID"] }
      },
      _sum: { amount: true }
    });

    const revenue = totalRevenue._sum.amount || 0;

    // جلب النشاطات الأخيرة (آخر 5 حجوزات)
    const recentActivities = await prisma.reservation.findMany({
      where: {
        listing: { userId: user.id }
      },
      include: {
        listing: {
          select: { title: true }
        },
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    // جلب إحصائيات إضافية
    const pendingReservations = await prisma.reservation.count({
      where: {
        listing: { userId: user.id },
        startDate: { gte: new Date() } // الحجوزات المستقبلية
      }
    });

    const completedReservations = await prisma.reservation.count({
      where: {
        listing: { userId: user.id },
        endDate: { lt: new Date() } // الحجوزات المنتهية
      }
    });

    const activities = recentActivities.map(reservation => ({
      id: reservation.id,
      type: "حجز جديد",
      message: `حجز جديد للعقار "${reservation.listing.title}" من ${reservation.user.name}`,
      time: reservation.createdAt,
      status: "PENDING"
    }));

    return NextResponse.json({
      statistics: {
        propertiesCount,
        reservationsCount,
        pendingReservations,
        completedReservations,
        averageRating: Math.round(averageRating * 10) / 10,
        revenue: Math.round(revenue * 100) / 100,
      },
      recentActivities: activities
    });

  } catch (error) {
    console.error("خطأ في جلب الإحصائيات:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الإحصائيات" },
      { status: 500 }
    );
  }
}
