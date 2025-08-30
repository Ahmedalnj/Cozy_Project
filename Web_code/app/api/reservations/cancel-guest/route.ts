import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

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

    // جلب الحجز مع تفاصيل العقار
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        listing: true,
        user: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على الحجز" },
        { status: 404 }
      );
    }

    // التحقق إن كان المستخدم هو صاحب العقار
    if (reservation.listing.userId !== currentUser.id) {
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
      message: "تم إلغاء حجز الضيف بنجاح",
    });
  } catch (error) {
    console.error("Cancel guest reservation error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إلغاء الحجز" },
      { status: 500 }
    );
  }
}




