import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import Stripe from "stripe";

// تعريف واجهات الأخطاء
interface StripeError {
  code?: string;
  message?: string;
}

interface PrismaError {
  code?: string;
  message?: string;
}

// Initialize Stripe only if the secret key is available
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    console.log("Received sessionId:", sessionId);

    if (!sessionId) {
      console.log("Session ID is missing");
      return NextResponse.json(
        { success: false, error: "Session ID مفقود" },
        { status: 400 }
      );
    }

    // ✅ التحقق من صحة format الـ sessionId
    if (typeof sessionId !== "string" || sessionId.trim() === "") {
      console.log("Session ID is invalid:", sessionId);
      return NextResponse.json(
        { success: false, error: "Session ID غير صالح" },
        { status: 400 }
      );
    }

    // ✅ التحقق أولاً إذا كان الحجز موجوداً بالفعل لهذه sessionId
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        SessionId: sessionId,
      },
      include: {
        payments: true,
      },
    });

    if (existingReservation) {
      console.log(`Reservation already exists for session: ${sessionId}`);
      return NextResponse.json({
        success: true,
        reservationId: existingReservation.id,
        message: "تم تأكيد الحجز مسبقاً",
        alreadyConfirmed: true,
        payment: existingReservation.payments[0] || null,
      });
    }

    // ✅ التحقق من الجلسة عند Stripe مع معالجة أفضل للأخطاء
    let session;
    try {
      console.log("Retrieving Stripe session:", sessionId);
      const stripe = getStripe();
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent", "line_items"],
      });
      console.log("Stripe session retrieved:", {
        id: session.id,
        payment_status: session.payment_status,
        metadata: session.metadata,
      });
    } catch (stripeError: unknown) {
      console.error("Stripe session retrieval error:", stripeError);

      // التحقق من نوع الخطأ
      if (
        stripeError &&
        typeof stripeError === "object" &&
        "code" in stripeError
      ) {
        const error = stripeError as StripeError;
        if (error.code === "resource_missing") {
          return NextResponse.json(
            {
              success: false,
              error: "جلسة الدفع غير موجودة أو منتهية الصلاحية",
            },
            { status: 404 }
          );
        }
      }

      return NextResponse.json(
        { success: false, error: "خطأ في التحقق من جلسة الدفع" },
        { status: 500 }
      );
    }

    if (!session) {
      console.log("No session found");
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على جلسة" },
        { status: 404 }
      );
    }

    if (session.payment_status !== "paid") {
      console.log("Payment not completed, status:", session.payment_status);
      return NextResponse.json(
        { success: false, error: "عملية الدفع لم تكتمل" },
        { status: 400 }
      );
    }

    // ✅ التحقق من وجود metadata
    if (!session.metadata) {
      console.log("No metadata in session");
      return NextResponse.json(
        { success: false, error: "البيانات مفقودة من الجلسة" },
        { status: 400 }
      );
    }

    const { listingId, userId, startDate, endDate, totalPrice } =
      session.metadata;

    console.log("Session metadata:", {
      listingId,
      userId,
      startDate,
      endDate,
      totalPrice,
    });

    // ✅ التحقق من وجود جميع البيانات المطلوبة
    if (!listingId || !userId || !startDate || !endDate || !totalPrice) {
      console.log("Missing required data:", {
        listingId: !!listingId,
        userId: !!userId,
        startDate: !!startDate,
        endDate: !!endDate,
        totalPrice: !!totalPrice,
      });
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

    // ✅ التحقق من عدم وجود حجز مسبق لنفس الفترة (باستثناء نفس session)
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        OR: [
          {
            startDate: { lte: endDateObj },
            endDate: { gte: startDateObj },
          },
        ],
        NOT: {
          SessionId: sessionId, // استثناء الحجوزات بنفس sessionId
        },
      },
    });

    if (conflictingReservation) {
      console.log("Conflicting reservation found:", conflictingReservation.id);
      return NextResponse.json(
        { success: false, error: "الفترة محجوزة مسبقًا" },
        { status: 409 }
      );
    }

    // ✅ إنشاء الحجز والدفع في نفس المعاملة
    console.log(`Creating reservation and payment for session: ${sessionId}`);

    const result = await prisma.$transaction(async (tx) => {
      // إنشاء الحجز
      const reservation = await tx.reservation.create({
        data: {
          listingId,
          userId,
          startDate: startDateObj,
          endDate: endDateObj,
          totalPrice: price,
          SessionId: sessionId,
        },
      });

      // استخراج معلومات الدفع من Stripe
      const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
      const paymentMethod = session.payment_method_types?.[0] || "card";

      // إنشاء سجل الدفع
      const payment = await tx.payment.create({
        data: {
          reservationId: reservation.id,
          userId,
          listingId,
          stripeSession: sessionId,
          transactionId: paymentIntent?.id || session.id,
          paymentMethod: paymentMethod,
          status: "PAID",
          amount: price,
          currency: session.currency || "usd",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 ساعة
        },
      });

      return { reservation, payment };
    });

    console.log(
      `Reservation ${result.reservation.id} and Payment ${result.payment.id} created successfully for session: ${sessionId}`
    );

    // ✅ إرسال الفاتورة تلقائياً بعد نجاح الحجز
    try {
      console.log("Sending automatic invoice...");

      // التحقق من وجود URL التطبيق
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!appUrl) {
        console.log("⚠️ NEXT_PUBLIC_APP_URL not configured, skipping invoice");
        return;
      }

      // جلب بيانات المستخدم لإرسال الفاتورة
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        // إرسال الفاتورة
        const invoiceResponse = await fetch(
          `${appUrl}/api/payments/send-invoice`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: result.payment.id,
              email: user.email,
            }),
          }
        );

        if (invoiceResponse.ok) {
          console.log("✅ Invoice sent successfully");
        } else {
          console.log(
            "⚠️ Failed to send invoice, but reservation was successful"
          );
        }
      }
    } catch (invoiceError) {
      console.log("⚠️ Error sending invoice:", invoiceError);
      // لا نوقف العملية إذا فشل إرسال الفاتورة
    }

    return NextResponse.json({
      success: true,
      reservationId: result.reservation.id,
      paymentId: result.payment.id,
      message: "تم تأكيد الحجز والدفع بنجاح",
      alreadyConfirmed: false,
      payment: result.payment,
    });
  } catch (error: unknown) {
    console.error("Confirm Reservation Error:", error);

    // التحقق من نوع الخطأ
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === "P2002") {
        console.log("Duplicate session detected");
        return NextResponse.json(
          { success: false, error: "تم تأكيد هذا الحجز مسبقاً" },
          { status: 409 }
        );
      }

      // ✅ تحسين رسائل الخطأ
      if (prismaError.code === "P2003") {
        console.log("Foreign key constraint violation");
        return NextResponse.json(
          { success: false, error: "بيانات الحجز غير صحيحة" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "خطأ أثناء تأكيد الحجز" },
      { status: 500 }
    );
  }
}
