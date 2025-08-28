import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser"; // 🟢 تأكد أن عندك هذه الفنكشن تجيب اليوزر الحالي

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك. سجل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { reservationId } = await params;

    if (!reservationId) {
      return NextResponse.json(
        { success: false, error: "معرّف الحجز مطلوب" },
        { status: 400 }
      );
    }

    // جلب الحجز مع تفاصيل المستخدم والعقار
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            locationValue: true,
            price: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            transactionId: true,
            paymentMethod: true,
            createdAt: true,
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على الحجز" },
        { status: 404 }
      );
    }

    // التحقق إن كان المستخدم هو صاحب الحجز أو Admin
    if (reservation.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك بعرض هذا الحجز" },
        { status: 403 }
      );
    }

    // تحويل التواريخ إلى string
    const safeReservation = {
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      updatedAt: reservation.updatedAt.toISOString(),
      payments: reservation.payments.map(payment => ({
        ...payment,
        createdAt: payment.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({
      success: true,
      reservation: safeReservation,
    });
  } catch (error) {
    console.error("Get reservation error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء جلب تفاصيل الحجز" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reservationId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك. سجل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { reservationId } = await params;

    if (!reservationId) {
      return NextResponse.json(
        { success: false, error: "معرّف الحجز مطلوب" },
        { status: 400 }
      );
    }

    // جلب الحجز للتحقق من المالك
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على الحجز" },
        { status: 404 }
      );
    }

    // التحقق إن كان المستخدم هو صاحب الحجز أو Admin
    if (reservation.userId !== currentUser.id && currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك بإلغاء هذا الحجز" },
        { status: 403 }
      );
    }

    // حذف الحجز
    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    return NextResponse.json({
      success: true,
      message: "تم إلغاء الحجز بنجاح",
    });
  } catch (error) {
    console.error("Delete reservation error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إلغاء الحجز" },
      { status: 500 }
    );
  }
}
