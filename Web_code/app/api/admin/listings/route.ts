// app/api/admin/listings/route.ts
import { NextResponse } from "next/server";
import getListings from "@/app/actions/getListings";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const params = {
    userId: searchParams.get("userId") || undefined,
    guestCount: searchParams.get("guestCount")
      ? Number(searchParams.get("guestCount"))
      : undefined,
    roomCount: searchParams.get("roomCount")
      ? Number(searchParams.get("roomCount"))
      : undefined,
    bathroomCount: searchParams.get("bathroomCount")
      ? Number(searchParams.get("bathroomCount"))
      : undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    locationValue: searchParams.get("locationValue") || undefined,
    category: searchParams.get("category") || undefined,
  };

  try {
    const listings = await getListings(params);
    return NextResponse.json(listings);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "فشل في جلب العقارات";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
