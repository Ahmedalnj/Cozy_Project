import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(
    params: IParams
){
        try{

        const {listingId, userId, authorId } = params;

        const query: {
            userId?: string;
            listing?: { userId: string };
        } = {};

        if (listingId) {
            query.userId = userId;
        }

        if (authorId) {
            query.listing = { userId: authorId}
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeReservation = reservations.map(
            (reservation) => ({
                ...reservation,
                createdAt: reservation.createdAt.toISOString(),
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                listing: {
                    ...reservation.listing,
                    createdAt: reservation.listing.createdAt.toISOString()
                }
            })
        );

        return safeReservation;
    }catch (error: unknown){
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }

}