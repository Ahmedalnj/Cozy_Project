// app/api/auth/reset/verify/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, code, newPassword } = await request.json();

  try {
    // 1. التحقق من وجود المستخدم وصحة الكود
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        resetCode: true,
        codeExpiresAt: true,
      },
    });

    if (!user || !user.resetCode || user.resetCode !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // 2. التحقق من صلاحية الكود
    if (new Date() > new Date(user.codeExpiresAt!)) {
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // 3. تحديث كلمة المرور إذا تم تقديمها
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { email: email.id },
        data: {
          hashedPassword: hashedPassword,
          resetCode: null, // مسح كود التحقق
          codeExpiresAt: null, // مسح تاريخ الانتهاء
        },
      });

      return NextResponse.json({
        success: true,
        message: "Password updated successfully",
      });
    }

    // 4. إذا لم يتم تقديم كلمة مرور جديدة (فقط التحقق من الكود)
    return NextResponse.json({
      success: true,
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
