import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import nodemailer from "nodemailer";

// إعداد إرسال البريد الإلكتروني
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, email } = body;

    if (!paymentId || !email) {
      return NextResponse.json(
        { success: false, error: "معرف الدفع والبريد الإلكتروني مطلوبان" },
        { status: 400 }
      );
    }

    // جلب تفاصيل الدفع والحجز
    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        reservation: {
          include: {
            listing: {
              select: {
                title: true,
                locationValue: true,
                imageSrc: true,
              },
            },
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على الدفع" },
        { status: 404 }
      );
    }

    const reservation = payment.reservation;
    if (!reservation) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على الحجز المرتبط" },
        { status: 404 }
      );
    }

    // إنشاء محتوى الفاتورة
    const invoiceHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاتورة الدفع - ${reservation.listing.title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .invoice-container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #e11d48;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #e11d48;
            margin: 0;
            font-size: 28px;
          }
          .invoice-number {
            background: #e11d48;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
          }
          .section {
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .section h3 {
            color: #e11d48;
            margin-top: 0;
            border-bottom: 2px solid #e11d48;
            padding-bottom: 5px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .label {
            font-weight: bold;
            color: #6b7280;
          }
          .value {
            font-weight: 600;
            color: #374151;
          }
          .total {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-top: 20px;
          }
          .total .amount {
            font-size: 24px;
            font-weight: bold;
            color: #e11d48;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>فاتورة الدفع</h1>
            <div class="invoice-number">رقم الفاتورة: ${payment.id.slice(
              -8
            )}</div>
          </div>

          <div class="section">
            <h3>معلومات العميل</h3>
            <div class="row">
              <span class="label">الاسم:</span>
              <span class="value">${reservation.user.name}</span>
            </div>
            <div class="row">
              <span class="label">البريد الإلكتروني:</span>
              <span class="value">${reservation.user.email}</span>
            </div>
            <div class="row">
              <span class="label">تاريخ الحجز:</span>
              <span class="value">${new Date(
                reservation.createdAt
              ).toLocaleDateString("ar-SA")}</span>
            </div>
          </div>

          <div class="section">
            <h3>تفاصيل العقار</h3>
            <div class="row">
              <span class="label">اسم العقار:</span>
              <span class="value">${reservation.listing.title}</span>
            </div>
            <div class="row">
              <span class="label">الموقع:</span>
              <span class="value">${reservation.listing.locationValue}</span>
            </div>
          </div>

          <div class="section">
            <h3>تفاصيل الحجز</h3>
            <div class="row">
              <span class="label">تاريخ الوصول:</span>
              <span class="value">${new Date(
                reservation.startDate
              ).toLocaleDateString("ar-SA")}</span>
            </div>
            <div class="row">
              <span class="label">تاريخ المغادرة:</span>
              <span class="value">${new Date(
                reservation.endDate
              ).toLocaleDateString("ar-SA")}</span>
            </div>
          </div>

          <div class="section">
            <h3>تفاصيل الدفع</h3>
            <div class="row">
              <span class="label">طريقة الدفع:</span>
              <span class="value">${payment.paymentMethod}</span>
            </div>
            <div class="row">
              <span class="label">رقم المعاملة:</span>
              <span class="value">${payment.transactionId?.slice(-12)}</span>
            </div>
            <div class="row">
              <span class="label">حالة الدفع:</span>
              <span class="value" style="color: #059669;">${
                payment.status === "PAID" ? "مكتمل" : payment.status
              }</span>
            </div>
          </div>

          <div class="total">
            <div class="label">المجموع الإجمالي:</div>
            <div class="amount">$${
              payment.amount
            } ${payment.currency.toUpperCase()}</div>
          </div>

          <div class="footer">
            <p>شكراً لاختيارك خدماتنا! 🙏</p>
            <p>للاستفسارات، يرجى التواصل معنا عبر البريد الإلكتروني</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // إرسال البريد الإلكتروني
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `فاتورة الدفع - ${reservation.listing.title}`,
      html: invoiceHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "تم إرسال الفاتورة بنجاح",
    });
  } catch (error) {
    console.error("Send invoice error:", error);
    return NextResponse.json(
      { success: false, error: "خطأ أثناء إرسال الفاتورة" },
      { status: 500 }
    );
  }
}
