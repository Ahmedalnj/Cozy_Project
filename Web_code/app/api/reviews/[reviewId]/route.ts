import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const { reviewId } = await params;
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

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if review exists and belongs to current user
    const existingReview = await prismadb.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    if (existingReview.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "You can only edit your own reviews" },
        { status: 403 }
      );
    }

    // Update the review
    const updatedReview = await prismadb.review.update({
      where: {
        id: reviewId,
      },
      data: {
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
      ...updatedReview,
      createdAt: updatedReview.createdAt.toISOString(),
      updatedAt: updatedReview.updatedAt.toISOString(),
    };

    return NextResponse.json(safeReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const { reviewId } = await params;

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Check if review exists and belongs to current user
    const existingReview = await prismadb.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    if (existingReview.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "You can only delete your own reviews" },
        { status: 403 }
      );
    }

    // Delete the review
    await prismadb.review.delete({
      where: {
        id: reviewId,
      },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
