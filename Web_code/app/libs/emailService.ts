import nodemailer from "nodemailer";

// إعداد إرسال البريد الإلكتروني
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface CashReservationData {
  userEmail: string;
  userName: string;
  listingTitle: string;
  listingLocation: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  reservationId: string;
}

interface CashPaymentAcceptedData {
  userEmail: string;
  userName: string;
  listingTitle: string;
  listingLocation: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  reservationId: string;
}

interface CashReservationRejectionData {
  userEmail: string;
  userName: string;
  listingTitle: string;
  listingLocation: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  reservationId: string;
  rejectionReason: string;
  hostName: string;
}

export async function sendCashReservationConfirmation(
  data: CashReservationData
) {
  const {
    userEmail,
    userName,
    listingTitle,
    listingLocation,
    startDate,
    endDate,
    totalPrice,
    reservationId,
  } = data;

  const confirmationHtml = `
    <!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>تأكيد الحجز - ${listingTitle}</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: #f9fafb;
      color: #1f2937;
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .confirmation-container {
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 650px;
      width: 100%;
      box-shadow: 0 6px 16px rgba(0,0,0,0.08);
    }

    /* ===== Header ===== */
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .header h1 {
      font-size: 26px;
      color: #2563eb;
      margin-bottom: 10px;
    }
    .reservation-number {
      background: #2563eb;
      color: white;
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      display: inline-block;
      box-shadow: 0 2px 6px rgba(37,99,235,0.3);
    }

    /* ===== Sections ===== */
    .section {
      margin-bottom: 24px;
      padding: 20px;
      border-radius: 12px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    .section h3 {
      font-size: 18px;
      color: #2563eb;
      margin-top: 0;
      margin-bottom: 15px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .label {
      font-weight: 500;
      color: #6b7280;
    }
    .value {
      font-weight: 600;
      color: #111827;
    }

    /* ===== Payment Notice ===== */
    .payment-notice {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin-top: 25px;
      border: 1px solid #fcd34d;
      box-shadow: 0 3px 10px rgba(251,191,36,0.2);
    }
    .payment-notice h3 {
      color: #b45309;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .payment-notice p {
      margin: 6px 0;
      color: #78350f;
      font-weight: 500;
    }

    /* ===== Footer ===== */
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="confirmation-container">
    <div class="header">
      <h1>⏳ تم إنشاء الحجز مؤقتاً</h1>
      <div class="reservation-number">رقم الحجز: NO_${reservationId.slice(
        -8
      )}</div>
    </div>

    <div class="section">
      <h3>👤 معلومات العميل</h3>
      <div class="row"><span class="label">الاسم:</span><span class="value">${userName}</span></div>
      <div class="row"><span class="label">البريد:</span><span class="value">${userEmail}</span></div>
      <div class="row"><span class="label">تاريخ الحجز:</span><span class="value">${new Date().toLocaleDateString(
        "ar-SA"
      )}</span></div>
    </div>

    <div class="section">
      <h3>🏠 تفاصيل العقار</h3>
      <div class="row"><span class="label">الاسم:</span><span class="value">${listingTitle}</span></div>
      <div class="row"><span class="label">الموقع:</span><span class="value">${listingLocation}</span></div>
    </div>

    <div class="section">
      <h3>📅 تفاصيل الحجز</h3>
      <div class="row"><span class="label">الوصول:</span><span class="value">${new Date(
        startDate
      ).toLocaleDateString("ar-LY")}</span></div>
      <div class="row"><span class="label">المغادرة:</span><span class="value">${new Date(
        endDate
      ).toLocaleDateString("ar-LY")}</span></div>
      <div class="row"><span class="label">المبلغ:</span><span class="value">$${totalPrice} USD</span></div>
    </div>

    <div class="payment-notice">
      <h3>⏳ في انتظار موافقة المضيف</h3>
      <p>تم إنشاء الحجز مؤقتاً! نحن في انتظار موافقة المضيف على الحجز.</p>
      <p><strong>سيتم إعلامك برسالة بريد إلكتروني عند قبول الحجز.</strong></p>
    </div>

    <div class="payment-notice" style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 1px solid #fcd34d;">
      <h3>💵 الدفع عند الوصول</h3>
      <p>بعد قبول الحجز، يرجى الدفع نقداً أو بالبطاقة عند الوصول.</p>
      <p><strong>يرجى إحضار بطاقة هوية عند الوصول.</strong></p>
    </div>

    <div class="footer">
      <p>شكراً لاختيارك خدماتنا 🙏</p>
      <p>للاستفسارات يرجى التواصل عبر البريد الإلكتروني</p>
      <p>نتمنى لك إقامة ممتعة ✨</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Cozy Project" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `تأكيد الحجز النقدي - ${listingTitle}`,
    html: confirmationHtml,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendCashReservationRejectionNotification(
  data: CashReservationRejectionData
) {
  const {
    userEmail,
    userName,
    listingTitle,
    listingLocation,
    startDate,
    endDate,
    totalPrice,
    reservationId,
    rejectionReason,
    hostName,
  } = data;

  const rejectionHtml = `
    <!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>رفض الحجز - ${listingTitle}</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: #f9fafb;
      color: #1f2937;
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .confirmation-container {
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 650px;
      width: 100%;
      box-shadow: 0 6px 16px rgba(0,0,0,0.08);
    }

    /* ===== Header ===== */
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .header h1 {
      font-size: 26px;
      color: #dc2626;
      margin-bottom: 10px;
    }
    .reservation-number {
      background: #dc2626;
      color: white;
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      display: inline-block;
      box-shadow: 0 2px 6px rgba(220,38,38,0.3);
    }

    /* ===== Sections ===== */
    .section {
      margin-bottom: 24px;
      padding: 20px;
      border-radius: 12px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    .section h3 {
      font-size: 18px;
      color: #dc2626;
      margin-top: 0;
      margin-bottom: 15px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .label {
      font-weight: 500;
      color: #6b7280;
    }
    .value {
      font-weight: 600;
      color: #111827;
    }

    /* ===== Rejection Notice ===== */
    .rejection-notice {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin-top: 25px;
      border: 1px solid #f87171;
      box-shadow: 0 3px 10px rgba(248,113,113,0.2);
    }
    .rejection-notice h3 {
      color: #991b1b;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .rejection-notice p {
      margin: 6px 0;
      color: #7f1d1d;
      font-weight: 500;
    }

    /* ===== Reason Section ===== */
    .reason-section {
      background: linear-gradient(135deg, #fef2f2, #fecaca);
      padding: 20px;
      border-radius: 12px;
      margin-top: 15px;
      border: 1px solid #fca5a5;
    }
    .reason-section h3 {
      color: #991b1b;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .reason-section p {
      color: #7f1d1d;
      font-weight: 500;
      line-height: 1.5;
    }

    /* ===== Next Steps ===== */
    .next-steps {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      padding: 20px;
      border-radius: 12px;
      margin-top: 15px;
      border: 1px solid #7dd3fc;
    }
    .next-steps h3 {
      color: #0c4a6e;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .next-steps p {
      color: #0c4a6e;
      font-weight: 500;
      line-height: 1.5;
    }

    /* ===== Footer ===== */
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="confirmation-container">
    <div class="header">
      <h1>❌ تم رفض الحجز</h1>
      <div class="reservation-number">رقم الحجز: NO_${reservationId.slice(
        -8
      )}</div>
    </div>

    <div class="section">
      <h3>👤 معلومات العميل</h3>
      <div class="row"><span class="label">الاسم:</span><span class="value">${userName}</span></div>
      <div class="row"><span class="label">البريد:</span><span class="value">${userEmail}</span></div>
      <div class="row"><span class="label">تاريخ الرفض:</span><span class="value">${new Date().toLocaleDateString(
        "ar-SA"
      )}</span></div>
    </div>

    <div class="section">
      <h3>🏠 تفاصيل العقار</h3>
      <div class="row"><span class="label">الاسم:</span><span class="value">${listingTitle}</span></div>
      <div class="row"><span class="label">الموقع:</span><span class="value">${listingLocation}</span></div>
      <div class="row"><span class="label">المضيف:</span><span class="value">${hostName}</span></div>
    </div>

    <div class="section">
      <h3>📅 تفاصيل الحجز المرفوض</h3>
      <div class="row"><span class="label">الوصول:</span><span class="value">${new Date(
        startDate
      ).toLocaleDateString("ar-LY")}</span></div>
      <div class="row"><span class="label">المغادرة:</span><span class="value">${new Date(
        endDate
      ).toLocaleDateString("ar-LY")}</span></div>
      <div class="row"><span class="label">المبلغ:</span><span class="value">$${totalPrice} USD</span></div>
    </div>

    <div class="rejection-notice">
      <h3>❌ تم رفض الحجز</h3>
      <p>نعتذر، تم رفض حجزك من قبل المضيف وتم حذفه من النظام.</p>
      <p>يمكنك البحث عن عقارات أخرى متاحة.</p>
    </div>

    <div class="reason-section">
      <h3>📝 سبب الرفض</h3>
      <p>${rejectionReason}</p>
    </div>

    <div class="next-steps">
      <h3>🔄 الخطوات التالية</h3>
      <p>• يمكنك البحث عن عقارات أخرى متاحة في نفس المنطقة</p>
      <p>• تأكد من قراءة شروط الحجز بعناية</p>
      <p>• لا تتردد في التواصل معنا للاستفسارات</p>
    </div>

    <div class="footer">
      <p>نعتذر عن الإزعاج 🙏</p>
      <p>للاستفسارات يرجى التواصل عبر البريد الإلكتروني</p>
      <p>نتمنى لك حجزاً ناجحاً في المرة القادمة ✨</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Cozy Project" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `رفض الحجز - ${listingTitle}`,
    html: rejectionHtml,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendCashPaymentAcceptedNotification(
  data: CashPaymentAcceptedData
) {
  const {
    userEmail,
    userName,
    listingTitle,
    listingLocation,
    startDate,
    endDate,
    totalPrice,
    reservationId,
  } = data;

  const acceptedHtml = `
    <!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>تم قبول الحجز - ${listingTitle}</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: #f9fafb;
      color: #1f2937;
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .confirmation-container {
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 650px;
      width: 100%;
      box-shadow: 0 6px 16px rgba(0,0,0,0.08);
    }

    /* ===== Header ===== */
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .header h1 {
      font-size: 26px;
      color: #059669;
      margin-bottom: 10px;
    }
    .reservation-number {
      background: #059669;
      color: white;
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      display: inline-block;
      box-shadow: 0 2px 6px rgba(5,150,105,0.3);
    }

    /* ===== Sections ===== */
    .section {
      margin-bottom: 24px;
      padding: 20px;
      border-radius: 12px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    .section h3 {
      font-size: 18px;
      color: #059669;
      margin-top: 0;
      margin-bottom: 15px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .label {
      font-weight: 500;
      color: #6b7280;
    }
    .value {
      font-weight: 600;
      color: #111827;
    }

    /* ===== Success Notice ===== */
    .success-notice {
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin-top: 25px;
      border: 1px solid #10b981;
      box-shadow: 0 3px 10px rgba(16,185,129,0.2);
    }
    .success-notice h3 {
      color: #065f46;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .success-notice p {
      margin: 6px 0;
      color: #064e3b;
      font-weight: 500;
    }

    /* ===== Payment Notice ===== */
    .payment-notice {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      margin-top: 15px;
      border: 1px solid #fcd34d;
      box-shadow: 0 3px 10px rgba(251,191,36,0.2);
    }
    .payment-notice h3 {
      color: #b45309;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .payment-notice p {
      margin: 6px 0;
      color: #78350f;
      font-weight: 500;
    }

    /* ===== Footer ===== */
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="confirmation-container">
    <div class="header">
      <h1>✅ تم قبول الحجز بنجاح</h1>
      <div class="reservation-number">رقم الحجز: NO_${reservationId.slice(
        -8
      )}</div>
    </div>

    <div class="section">
      <h3>👤 معلومات العميل</h3>
      <div class="row"><span class="label">الاسم:</span><span class="value">${userName}</span></div>
      <div class="row"><span class="label">البريد:</span><span class="value">${userEmail}</span></div>
      <div class="row"><span class="label">تاريخ القبول:</span><span class="value">${new Date().toLocaleDateString(
        "ar-SA"
      )}</span></div>
    </div>

    <div class="section">
      <h3>🏠 تفاصيل العقار</h3>
      <div class="row"><span class="label">الاسم:</span><span class="value">${listingTitle}</span></div>
      <div class="row"><span class="label">الموقع:</span><span class="value">${listingLocation}</span></div>
    </div>

    <div class="section">
      <h3>📅 تفاصيل الحجز</h3>
      <div class="row"><span class="label">الوصول:</span><span class="value">${new Date(
        startDate
      ).toLocaleDateString("ar-LY")}</span></div>
      <div class="row"><span class="label">المغادرة:</span><span class="value">${new Date(
        endDate
      ).toLocaleDateString("ar-LY")}</span></div>
      <div class="row"><span class="label">المبلغ:</span><span class="value">$${totalPrice} USD</span></div>
    </div>

    <div class="success-notice">
      <h3>🎉 تم قبول الحجز</h3>
      <p>مبروك! تم قبول حجزك بنجاح من قبل المضيف.</p>
      <p>يمكنك الآن التخطيط لرحلتك بثقة.</p>
    </div>

    <div class="payment-notice">
      <h3>💵 الدفع عند الوصول</h3>
      <p>يرجى الدفع نقداً أو بالبطاقة عند الوصول.</p>
      <p><strong>يرجى إحضار بطاقة هوية عند الوصول.</strong></p>
    </div>

    <div class="footer">
      <p>شكراً لاختيارك خدماتنا 🙏</p>
      <p>للاستفسارات يرجى التواصل عبر البريد الإلكتروني</p>
      <p>نتمنى لك إقامة ممتعة ✨</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Cozy Project" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `تم قبول الحجز - ${listingTitle}`,
    html: acceptedHtml,
  };

  await transporter.sendMail(mailOptions);
}
