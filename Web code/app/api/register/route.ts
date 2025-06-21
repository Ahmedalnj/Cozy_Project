import bcrypt from 'bcrypt';
import prisma from "@/app/libs/prismadb"; // تأكد من المسار الصحيح
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  console.log('Received data:', body);  // طباعة البيانات الواردة

  // تحقق إذا كان البريد الإلكتروني موجودًا بالفعل
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // إذا كان الحساب موجودًا بالفعل، نرجع استجابة تحتوي على رسالة خطأ
    return NextResponse.json(
      { error: "Account with this email already exists!" },
      { status: 400 }
    );
  }

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 12);
  console.log('Hashed password:', hashedPassword);  // طباعة كلمة المرور المشفرة

  // إنشاء المستخدم في قاعدة البيانات
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hasPassword: hashedPassword, // استخدام hasPassword بدلاً من hashedPassword
    },
  });

  console.log('User created:', user);  // طباعة المستخدم الذي تم إنشاؤه

  // إرجاع المستخدم بعد إنشائه
  return NextResponse.json(user, { status: 201 });
}
