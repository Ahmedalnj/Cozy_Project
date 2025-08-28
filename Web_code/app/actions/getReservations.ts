import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (listingId) {
      whereClause.listingId = listingId;
    }

    if (userId) {
      whereClause.userId = userId;
    }

    if (authorId) {
      whereClause.listing = {
        is: {
          userId: authorId,
        },
      };
    }

    // لو الشرط فارغ، نحاول جلب جميع الحجوزات (أو نرجع مصفوفة فارغة)
    if (!listingId && !userId && !authorId) {
      console.log("No filters provided, returning empty array.");
      return [];
    }

    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      include: {
        listing: {
          include: {
            user: true, // <== هنا نضيف user ضمن listing
          },
        },
        user: true,
        payments: {
          select: {
            id: true,
            status: true,
            paymentMethod: true,
            amount: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Get the most recent payment
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // تحويل التواريخ إلى string
    const safeReservation = reservations.map((reservation) => ({
      ...reservation,
      status: reservation.status, // <== حالة الحجز
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
      payment: reservation.payments[0] ? {
        id: reservation.payments[0].id,
        status: reservation.payments[0].status,
        paymentMethod: reservation.payments[0].paymentMethod,
        amount: reservation.payments[0].amount,
      } : null,
    }));

    return safeReservation;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}
