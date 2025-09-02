import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    // التحقق من أن المستخدم لم يطلب المضيف من قبل
    if (currentUser.hostStatus !== "NOT_REQUESTED") {
      return NextResponse.json(
        { error: "لقد قمت بطلب المضيف من قبل" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      requestType,
      companyName,
      companyWebsite,
      idCardNumber,
      idCardType,
    } = body;

    // التحقق من الحقول الأساسية
    if (!fullName || !email || !phone || !requestType) {
      return NextResponse.json(
        { error: "جميع الحقول الأساسية مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق من أن البريد الإلكتروني يتطابق مع المستخدم الحالي
    if (email !== currentUser.email) {
      return NextResponse.json(
        { error: "البريد الإلكتروني يجب أن يتطابق مع حسابك" },
        { status: 400 }
      );
    }

    // التحقق من الحقول حسب نوع الطلب
    if (requestType === "business") {
      if (!companyName || !companyWebsite) {
        return NextResponse.json(
          { error: "جميع حقول الشركة مطلوبة" },
          { status: 400 }
        );
      }
    } else if (requestType === "personal") {
      if (!idCardNumber || !idCardType) {
        return NextResponse.json(
          { error: "جميع حقول الهوية مطلوبة" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "نوع الطلب غير صحيح" },
        { status: 400 }
      );
    }

    // إنشاء طلب المضيف
    const hostRequest = await prismadb.hostRequest.create({
      data: {
        userId: currentUser.id,
        status: "PENDING",
        fullName,
        phone,
        // حفظ البيانات الإضافية كـ JSON في حقل واحد
        idCardUrl: JSON.stringify({
          requestType,
          email,
          companyName: requestType === "business" ? companyName : null,
          companyWebsite: requestType === "business" ? companyWebsite : null,
          idCardNumber: requestType === "personal" ? idCardNumber : null,
          idCardType: requestType === "personal" ? idCardType : null,
        }),
      },
    });

    // تحديث حالة المستخدم
    await prismadb.user.update({
      where: { id: currentUser.id },
      data: { hostStatus: "PENDING" },
    });

    return NextResponse.json(
      { 
        message: "تم إرسال طلبك بنجاح",
        success: true,
        hostRequest 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("خطأ في معالجة طلب المضيف:", error);
    return NextResponse.json(
      { error: "حدث خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}
