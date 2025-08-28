import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { sendCashPaymentAcceptedNotification } from "@/app/libs/emailService";

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
    const { reservationId } = body;

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
        { success: false, error: "غير مصرح لك بقبول هذا الحجز" },
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

    // Update the payment status to SUCCESS
    const updatedPayment = await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        status: "SUCCESS",
      },
    });

    // Send email notification to the user
    try {
      await sendCashPaymentAcceptedNotification({
        userEmail: reservation.user.email!,
        userName: reservation.user.name!,
        listingTitle: reservation.listing.title,
        listingLocation: reservation.listing.locationValue,
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        totalPrice: reservation.totalPrice,
        reservationId: reservation.id,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Continue with the response even if email fails
    }

    return NextResponse.json({
      success: true,
      message: "تم قبول الدفع النقدي بنجاح",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Accept cash payment error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء قبول الدفع النقدي" },
      { status: 500 }
    );
  }
}
