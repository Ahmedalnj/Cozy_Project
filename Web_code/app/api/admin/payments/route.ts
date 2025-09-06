import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "غير مصرح لك. سجل الدخول أولاً" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول لهذه البيانات" },
        { status: 403 }
      );
    }

    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            locationValue: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        reservation: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            totalPrice: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 }
    );
  }
}
