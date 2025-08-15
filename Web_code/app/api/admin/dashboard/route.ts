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

    const revenueData = await prisma.reservation.findMany({
      select: { totalPrice: true },
    });

    const totalRevenue = revenueData.reduce(
      (sum, r) => sum + (r.totalPrice || 0),
      0
    );

    const allUsersRaw = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
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
      },
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));

    return NextResponse.json({
      stats: {
        totalUsers: users,
        totalListings: listings,
        totalReservations: reservations,
        totalRevenue: totalRevenue,
      },
      users: allUsers,
      listings: allListings,
      reservations: allReservations,
    });
  } catch (error) {
    console.error("Error in admin dashboard API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
