// app/api/auth/reset/verify/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, newPassword } = await request.json(); // احذف code من هنا

  try {
    // 1. التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, hashedPassword: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير مسجل" },
        { status: 400 }
      );
    }

    // 2. تحديث كلمة المرور مباشرة (بدون التحقق من code)
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "تم تحديث كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("خطأ في إعادة تعيين كلمة المرور:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث كلمة المرور" },
      { status: 500 }
    );
  }
}
