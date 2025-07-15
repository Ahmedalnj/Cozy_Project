import prisma from "@/app/libs/prismadb";
import { gte } from "lodash";

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
export default async function getListing(params: IListingsParams) {
  try {
    const {
      userId,
      guestCount,
      roomCount,
      bathroomCount,
      startDate,
      endDate,
      locationValue,
      category
    } = params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if(category){
        query.category=category;
    }

    if(roomCount){
        query.roomCount={
            gte : +roomCount
        }
    }

    if(bathroomCount){
        query.bathroomCount={
            gte : +bathroomCount
        }
    }

    if(guestCount){
        query.guestCount={
            gte : +guestCount
        }
    }

    if(locationValue){
        query.locationValue = locationValue;
    }

    if (startDate && endDate) {
  query.reservations = {
    none: {
      AND: [
        {
          startDate: {
            lte: new Date(endDate),
          },
        },
        {
          endDate: {
            gte: new Date(startDate),
          },
        },
      ],
    },
  };
}

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(), // تحويل التاريخ إلى سلسلة نصية
    }));

    return safeListings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
}
