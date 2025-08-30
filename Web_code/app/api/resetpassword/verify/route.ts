// app/api/auth/reset/verify/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const { email, code } = await request.json();

  // 1. البحث عن المستخدم والكود
  const user = await prisma.user.findUnique({
    where: { email },
    select: { resetCode: true, codeExpiresAt: true },
  });

  // 2. التحقق من وجود المستخدم وصحة الكود
  if (!user || !user.resetCode || user.resetCode !== code) {
    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 400 }
    );
  }

  // 3. التحقق من صلاحية الكود
  if (new Date() > new Date(user.codeExpiresAt!)) {
    return NextResponse.json(
      { error: "Verification code has expired" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
