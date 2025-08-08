import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  // جلب listingId من الـ URL (request.nextUrl.pathname أو .searchParams)
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split("/");
  const listingId = pathnameParts[pathnameParts.length - 1];

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  const favoriteIds = [...(currentUser.favoriteIds || [])];
  favoriteIds.push(listingId);

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds },
  });

  return NextResponse.json(user);
}

export async function DELETE(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const url = new URL(request.url);
  const pathnameParts = url.pathname.split("/");
  const listingId = pathnameParts[pathnameParts.length - 1];

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];
  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { favoriteIds },
  });

  return NextResponse.json(user);
}
