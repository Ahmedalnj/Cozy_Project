import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { sendCashReservationConfirmation } from "@/app/libs/emailService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reservationId, listingId, userId, startDate, endDate, totalPrice } =
      body;

    console.log("Creating cash reservation:", {
      reservationId,
      listingId,
      userId,
      startDate,
      endDate,
      totalPrice,
    });

    // ✅ التحقق من وجود جميع البيانات المطلوبة
    if (!listingId || !userId || !startDate || !endDate || !totalPrice) {
      console.log("Missing required data for cash reservation");
      return NextResponse.json(
        { success: false, error: "بيانات الحجز غير مكتملة" },
        { status: 400 }
      );
    }

    // ✅ التحقق من صحة التواريخ
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      console.log("Invalid dates:", { startDate, endDate });
      return NextResponse.json(
        { success: false, error: "تواريخ غير صالحة" },
        { status: 400 }
      );
    }

    if (startDateObj >= endDateObj) {
      console.log("Start date is after or equal to end date:", {
        startDate,
        endDate,
      });
      return NextResponse.json(
        {
          success: false,
          error: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية",
        },
        { status: 400 }
      );
    }

    // ✅ التحقق من صحة السعر
    const price = Number(totalPrice);
    if (isNaN(price) || price <= 0) {
      console.log("Invalid price:", totalPrice);
      return NextResponse.json(
        { success: false, error: "السعر غير صالح" },
        { status: 400 }
      );
    }

    // ✅ التحقق من عدم وجود حجز مسبق لنفس الفترة
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        OR: [
          {
            startDate: { lte: endDateObj },
            endDate: { gte: startDateObj },
          },
        ],
      },
    });

    if (conflictingReservation) {
      console.log("Conflicting reservation found:", conflictingReservation.id);
      return NextResponse.json(
        { success: false, error: "الفترة محجوزة مسبقًا" },
        { status: 409 }
      );
    }

    // ✅ إنشاء الحجز والدفع النقدي في نفس المعاملة
    console.log("Creating cash reservation and payment");

    const result = await prisma.$transaction(async (tx) => {
      // إنشاء الحجز
      const reservation = await tx.reservation.create({
        data: {
          listingId,
          userId,
          startDate: startDateObj,
          endDate: endDateObj,
          totalPrice: price,
          SessionId: `cash_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`, // إنشاء session ID فريد للحجز النقدي
        },
      });

      // إنشاء سجل الدفع النقدي
      const payment = await tx.payment.create({
        data: {
          reservationId: reservation.id,
          userId,
          listingId,
          stripeSession: `cash_${reservation.id}`,
          transactionId: `cash_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          paymentMethod: "cash",
          status: "PENDING", // حالة معلقة حتى يتم الدفع عند الوصول
          amount: price,
          currency: "usd",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم
        },
      });

      return { reservation, payment };
    });

    // ✅ جلب بيانات المستخدم والعقار لإرسال البريد الإلكتروني
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { title: true, locationValue: true },
    });

    // ✅ إرسال تأكيد الحجز النقدي للضيف
    console.log("Sending cash reservation confirmation email");
    await sendCashReservationConfirmation({
      userEmail: user!.email!,
      userName: user!.name!,
      listingTitle: listing!.title,
      listingLocation: listing!.locationValue,
      startDate: startDate,
      endDate: endDate,
      totalPrice: price,
      reservationId: result.reservation.id,
    });

    return NextResponse.json({
      success: true,
      reservationId: result.reservation.id,
      paymentId: result.payment.id,
      message: "تم إنشاء الحجز النقدي بنجاح",
      payment: result.payment,
    });
  } catch (error: unknown) {
    console.error("Cash Reservation Error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code: unknown }).code === "string"
    ) {
      const code = (error as { code: string }).code;

      if (code === "P2002") {
        console.log("Duplicate reservation detected");
        return NextResponse.json(
          { success: false, error: "تم إنشاء هذا الحجز مسبقاً" },
          { status: 409 }
        );
      }

      if (code === "P2003") {
        console.log("Foreign key constraint violation");
        return NextResponse.json(
          { success: false, error: "بيانات الحجز غير صحيحة" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "خطأ أثناء إنشاء الحجز النقدي" },
      { status: 500 }
    );
  }
}
