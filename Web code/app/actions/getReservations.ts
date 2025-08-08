import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;

    console.log("Received params:", params);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (listingId) {
      whereClause.listingId = listingId;
      console.log("Filter by listingId:", listingId);
    }

    if (userId) {
      whereClause.userId = userId;
      console.log("Filter by userId:", userId);
    }

    if (authorId) {
      whereClause.listing = {
        is: {
          userId: authorId,
        },
      };
      console.log("Filter by authorId (listing.userId):", authorId);
    }

    console.log("Final where clause:", JSON.stringify(whereClause, null, 2));

    // لو الشرط فارغ، نحاول جلب جميع الحجوزات (أو نرجع مصفوفة فارغة)
    if (!listingId && !userId && !authorId) {
      console.log("No filters provided, returning empty array.");
      return [];
    }

    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      include: {
        listing: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Fetched reservations:", reservations.length);

    // تحويل التواريخ إلى string
    const safeReservation = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
      user: {
        name: reservation.user?.name ?? null,
        email: reservation.user?.email ?? null,
      },
    }));

    return safeReservation;
  } catch (error: unknown) {
    console.error("Error in getReservations:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}
