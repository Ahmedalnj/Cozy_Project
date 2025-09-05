import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { hostRequestId } = body;

    if (!hostRequestId) {
      return NextResponse.json(
        { error: "معرف طلب المضيف مطلوب" },
        { status: 400 }
      );
    }

    // البحث عن طلب المضيف
    const hostRequest = await prismadb.hostRequest.findUnique({
      where: { id: hostRequestId },
      include: { user: true },
    });

    if (!hostRequest) {
      return NextResponse.json(
        { error: "طلب المضيف غير موجود" },
        { status: 404 }
      );
    }

    if (hostRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "يمكن الموافقة على الطلبات المعلقة فقط" },
        { status: 400 }
      );
    }

    // تحديث حالة طلب المضيف
    await prismadb.hostRequest.update({
      where: { id: hostRequestId },
      data: { status: "APPROVED" },
    });

    // تحديث حالة المستخدم
    await prismadb.user.update({
      where: { id: hostRequest.userId },
      data: { hostStatus: "APPROVED" },
    });

    return NextResponse.json(
      { 
        message: "تمت الموافقة على طلب المضيف بنجاح",
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("خطأ في الموافقة على طلب المضيف:", error);
    return NextResponse.json(
      { error: "حدث خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}






