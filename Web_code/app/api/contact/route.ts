import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// استخدام نفس إعدادات emailService.ts بالضبط
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    // إضافة logging للتأكد من قراءة المتغيرات
    console.log("متغيرات البيئة:", {
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USER: process.env.EMAIL_USER ? "موجود" : "غير موجود",
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "موجود" : "غير موجود",
      CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    });

    // التحقق من وجود متغيرات البيئة المطلوبة
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("متغيرات البيئة غير موجودة:", {
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
      });
      return NextResponse.json(
        {
          error:
            "إعدادات البريد الإلكتروني غير مكتملة. يرجى التحقق من ملف .env",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صحيح" },
        { status: 400 }
      );
    }

    // إنشاء محتوى البريد الإلكتروني
    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رسالة جديدة من صفحة التواصل</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f9fafb;
            color: #1f2937;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 24px;
          }
          .contact-info {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
          }
          .contact-info h3 {
            color: #374151;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }
          .label {
            font-weight: 600;
            color: #6b7280;
            min-width: 80px;
          }
          .value {
            color: #111827;
            font-weight: 500;
          }
          .message-section {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
          }
          .message-section h3 {
            color: #92400e;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .message-content {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            white-space: pre-wrap;
            line-height: 1.6;
            color: #374151;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .timestamp {
            background: #f9fafb;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 رسالة جديدة من صفحة التواصل</h1>
          </div>
          
          <div class="contact-info">
            <h3>👤 معلومات المرسل</h3>
            <div class="info-row">
              <span class="label">الاسم:</span>
              <span class="value">${name}</span>
            </div>
            <div class="info-row">
              <span class="label">البريد الإلكتروني:</span>
              <span class="value">${email}</span>
            </div>
            <div class="info-row">
              <span class="label">التاريخ:</span>
              <span class="value">${new Date().toLocaleDateString(
                "ar-SA"
              )}</span>
            </div>
            <div class="info-row">
              <span class="label">الوقت:</span>
              <span class="value">${new Date().toLocaleTimeString(
                "ar-SA"
              )}</span>
            </div>
          </div>
          
          <div class="message-section">
            <h3>💬 الرسالة</h3>
            <div class="message-content">${message}</div>
          </div>
          
          <div class="timestamp">
            تم إرسال هذه الرسالة في ${new Date().toLocaleString("ar-SA")}
          </div>
          
          <div class="footer">
            <p>هذه رسالة تلقائية من موقع Cozy Libya</p>
            <p>يرجى الرد على البريد الإلكتروني أعلاه للتواصل مع العميل</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // إعداد خيارات البريد الإلكتروني
    const mailOptions = {
      from: `"Cozy Libya - Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER, // إرسال إلى بريد الشركة
      subject: `رسالة جديدة من ${name} - صفحة التواصل`,
      html: emailHtml,
      replyTo: email, // للرد مباشرة على العميل
    };

    // إرسال البريد الإلكتروني
    await transporter.sendMail(mailOptions);

    // إرسال تأكيد للعميل
    const confirmationHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد استلام رسالتك</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f9fafb;
            color: #1f2937;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #059669;
            margin: 0;
            font-size: 24px;
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .message {
            background: #d1fae5;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #10b981;
            margin-bottom: 25px;
          }
          .message h3 {
            color: #065f46;
            margin-top: 0;
            margin-bottom: 10px;
          }
          .message p {
            color: #064e3b;
            margin: 0;
          }
          .details {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
          }
          .details h3 {
            color: #374151;
            margin-top: 0;
            margin-bottom: 15px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }
          .label {
            font-weight: 600;
            color: #6b7280;
          }
          .value {
            color: #111827;
            font-weight: 500;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>تم استلام رسالتك بنجاح</h1>
          </div>
          
          <div class="message">
            <h3>شكراً لك ${name}!</h3>
            <p>لقد تم استلام رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
          </div>
          
          <div class="details">
            <h3>تفاصيل الرسالة</h3>
            <div class="info-row">
              <span class="label">الاسم:</span>
              <span class="value">${name}</span>
            </div>
            <div class="info-row">
              <span class="label">البريد الإلكتروني:</span>
              <span class="value">${email}</span>
            </div>
            <div class="info-row">
              <span class="label">تاريخ الإرسال:</span>
              <span class="value">${new Date().toLocaleDateString(
                "ar-SA"
              )}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>هذه رسالة تلقائية من موقع Cozy Libya</p>
            <p>للاستفسارات الإضافية، يمكنك التواصل معنا عبر البريد الإلكتروني</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // إرسال تأكيد للعميل
    const confirmationMailOptions = {
      from: `"Cozy Libya" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "تأكيد استلام رسالتك - Cozy Libya",
      html: confirmationHtml,
    };

    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json(
      { message: "تم إرسال الرسالة بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("خطأ في إرسال الرسالة:", error);

    // رسالة خطأ أكثر تفصيلاً
    let errorMessage = "حدث خطأ في إرسال الرسالة";

    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        errorMessage = "خطأ في بيانات تسجيل الدخول للبريد الإلكتروني";
      } else if (error.message.includes("Authentication failed")) {
        errorMessage = "فشل في المصادقة مع خادم البريد الإلكتروني";
      } else if (error.message.includes("Connection timeout")) {
        errorMessage = "انتهت مهلة الاتصال بخادم البريد الإلكتروني";
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
