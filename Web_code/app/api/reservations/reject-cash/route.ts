import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { sendCashReservationRejectionNotification } from "@/app/libs/emailService";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك. سجل الدخول أولاً" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { reservationId, rejectionReason } = body;

    if (!reservationId) {
      return NextResponse.json(
        { success: false, error: "معرّف الحجز مطلوب" },
        { status: 400 }
      );
    }

    // Get the reservation and verify ownership
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        listing: true,
        payments: true,
        user: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على الحجز" },
        { status: 404 }
      );
    }

    // Check if the current user is the owner of the listing
    if (reservation.listing.userId !== currentUser.id) {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك برفض هذا الحجز" },
        { status: 403 }
      );
    }

    // Check if there's already a payment for this reservation
    const existingPayment = reservation.payments[0];
    if (!existingPayment) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على معلومات الدفع" },
        { status: 404 }
      );
    }

    // Delete the reservation and its associated payment automatically
    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    // Note: Payment will be automatically deleted due to cascade
    const updatedReservation = null;

    // Send email notification to the user
    try {
      await sendCashReservationRejectionNotification({
        userEmail: reservation.user.email!,
        userName: reservation.user.name!,
        listingTitle: reservation.listing.title,
        listingLocation: reservation.listing.locationValue,
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        totalPrice: reservation.totalPrice,
        reservationId: reservation.id,
        rejectionReason: rejectionReason || "لم يتم تحديد سبب الرفض",
        hostName: currentUser.name || "المضيف",
      });
    } catch (emailError) {
      console.error("Failed to send rejection email notification:", emailError);
      // Continue with the response even if email fails
    }

    return NextResponse.json({
      success: true,
      message: "تم رفض الحجز بنجاح",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("Reject cash reservation error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء رفض الحجز" },
      { status: 500 }
    );
  }
}
