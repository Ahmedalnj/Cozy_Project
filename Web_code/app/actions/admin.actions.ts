import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

export async function getAdminSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentAdminUser() {
  try {
    const session = await getAdminSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: unknown) {
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getDashboardData() {
  try {
    const currentUser = await getCurrentAdminUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
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

    return {
      stats: {
        totalUsers: users,
        totalListings: listings,
        totalReservations: reservations,
        totalRevenue: totalRevenue,
      },
      users: allUsers,
      listings: allListings,
      reservations: allReservations,
    };
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
