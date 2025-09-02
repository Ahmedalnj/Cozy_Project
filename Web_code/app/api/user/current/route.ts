import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      );
    }

    // إرجاع بيانات المستخدم مع حالة المضيف
    return NextResponse.json({
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      image: currentUser.image,
      hostStatus: currentUser.hostStatus,
      role: currentUser.role,
    });

  } catch (error) {
    console.error("خطأ في جلب بيانات المستخدم:", error);
    return NextResponse.json(
      { error: "حدث خطأ داخلي في الخادم" },
      { status: 500 }
    );
  }
}


