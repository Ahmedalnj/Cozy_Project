// app/api/auth/reset/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { generateRandomCode } from "@/app/Password/utils";
import { sendPasswordResetCode } from "@/app/Password/mail";

export async function POST(request: Request) {
  const { email } = await request.json();

  // إنشاء كود مكون من 6 أرقام
  const code = generateRandomCode(6);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // صلاحية 15 دقيقة

  // حفظ الكود في قاعدة البيانات
  await prisma.user.update({
    where: { email },
    data: {
      resetCode: code,
      codeExpiresAt: expiresAt,
    },
  });

  // إرسال البريد الإلكتروني
  await sendPasswordResetCode(email, code);

  return NextResponse.json({ message: "Verification code sent" });
}
