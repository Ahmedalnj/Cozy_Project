import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}

export async function DELETE(request: Request, props: { params: Promise<IParams> }) {
  const params = await props.params;
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  const { listingId } = params;
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}

export async function PUT(request: Request, props: { params: Promise<IParams> }) {
  const params = await props.params;
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  const { listingId } = params;
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  const body = await request.json();
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  const existingListing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!existingListing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (existingListing.userId !== currentUser.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
    },
  });

  return NextResponse.json(updatedListing);
}
