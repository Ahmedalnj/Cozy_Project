import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const { listingId } = await params;

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    const reviews = await prismadb.review.findMany({
      where: {
        listingId: listingId,
      },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform dates to strings for JSON serialization
    const safeReviews = reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    }));

    return NextResponse.json(safeReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { listingId } = await params;
    
    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Check if listing exists
    const listing = await prismadb.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { 
      rating, 
      comment, 
      cleanliness, 
      accuracy, 
      checkIn, 
      communication, 
      location, 
      value 
    } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this listing
    const existingReview = await prismadb.review.findFirst({
      where: {
        listingId: listingId,
        userId: currentUser.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this listing" },
        { status: 400 }
      );
    }

    // Check if user has stayed at this listing (optional validation)
    // Commented out for now to allow reviews without reservations
    // const hasReservation = await prismadb.reservation.findFirst({
    //   where: {
    //     listingId: listingId,
    //     userId: currentUser.id,
    //     endDate: {
    //       lt: new Date(), // Past reservations only
    //     },
    //   },
    // });

    // Create the review
    const review = await prismadb.review.create({
      data: {
        listingId: listingId,
        userId: currentUser.id,
        rating: rating,
        comment: comment || null,
        cleanliness: cleanliness || null,
        accuracy: accuracy || null,
        checkIn: checkIn || null,
        communication: communication || null,
        location: location || null,
        value: value || null,
      },
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
    });

    const safeReview = {
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };

    return NextResponse.json(safeReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
