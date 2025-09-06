// app/api/admin/dashboard/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export const dynamic = "force-dynamic"; // Ensure dynamic fetching

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.count();
    const listings = await prisma.listing.count();
    const reservations = await prisma.reservation.count();
    const payments = await prisma.payment.count();

    const revenueData = await prisma.reservation.findMany({
      select: { totalPrice: true },
    });

    const totalRevenue = revenueData.reduce(
      (sum, r) => sum + (r.totalPrice || 0),
      0
    );

    const allUsersRaw = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50, // زيادة العدد ليشمل جميع المستخدمين
    });

    const allUsers = allUsersRaw.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified
        ? user.emailVerified.toISOString()
        : null,
    }));

    const allListingsRaw = await prisma.listing.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const allListings = allListingsRaw.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    const allReservationsRaw = await prisma.reservation.findMany({
      include: {
        user: true,
        listing: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const allReservations = allReservationsRaw.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      user: {
        name: reservation.user?.name ?? "",
        email: reservation.user?.email ?? "",
        image: reservation.user?.image ?? "",
      },
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));

    // جلب آخر 10 مدفوعات
    const allPaymentsRaw = await prisma.payment.findMany({
      include: {
        user: true,
        listing: {
          include: {
            user: true,
          },
        },
        reservation: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const allPayments = allPaymentsRaw.map((payment) => ({
      ...payment,
      createdAt: payment.createdAt.toISOString(),
      user: {
        id: payment.user?.id ?? "",
        name: payment.user?.name ?? "",
        email: payment.user?.email ?? "",
        image: payment.user?.image ?? null,
      },
      listing: {
        title: payment.listing?.title ?? "",
        id: payment.listing?.id ?? "",
        locationValue: payment.listing?.locationValue ?? "",
        user: {
          id: payment.listing?.user?.id ?? "",
          name: payment.listing?.user?.name ?? "",
          email: payment.listing?.user?.email ?? "",
          image: payment.listing?.user?.image ?? null,
        },
      },
      reservation: {
        id: payment.reservation?.id ?? "",
        startDate: payment.reservation?.startDate?.toISOString() ?? "",
        endDate: payment.reservation?.endDate?.toISOString() ?? "",
        totalPrice: payment.reservation?.totalPrice ?? 0,
      },
    }));

    const response = {
      stats: {
        totalUsers: users,
        totalListings: listings,
        totalReservations: reservations,
        totalPayments: payments,
        totalRevenue: totalRevenue,
      },
      users: allUsers,
      listings: allListings,
      reservations: allReservations,
      payments: allPayments,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in admin dashboard API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
