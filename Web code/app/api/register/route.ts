"use client";
import bcrypt from 'bcrypt';
import prisma from "@/app/libs/prismadb"; // تأكد من المسار الصحيح
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password} = body; // إضافة provider لتحديد نوع الحساب

  // في حالة عدم وجود المستخدم، نقوم بإنشاء حساب جديد
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

    return NextResponse.json(user);
  }

