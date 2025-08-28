// test-email.js - ملف اختبار إرسال البريد الإلكتروني
const nodemailer = require('nodemailer');

// إعداد الناقل (transporter)
const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'ahmed.alnjjar40@gmail.com',
        pass: 'icys ikna mhuo nvou'
    }
});

// دالة اختبار إرسال البريد
async function testEmail() {
    try {
        console.log('🚀 بدء اختبار إرسال البريد الإلكتروني...');

        const mailOptions = {
            from: 'ahmed.alnjjar40@gmail.com',
            to: 'ahmed.alnjjar40@gmail.com', // إرسال لنفس البريد للاختبار
            subject: 'اختبار إرسال البريد - Cozy Project',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48;">🎉 اختبار إرسال البريد الإلكتروني</h2>
          <p>مرحباً! هذا اختبار لإرسال البريد الإلكتروني من Cozy Project.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>✅ إذا وصلتك هذه الرسالة، فإرسال البريد يعمل بشكل صحيح!</h3>
            <p>الوقت: ${new Date().toLocaleString('ar-SA')}</p>
          </div>
          <p style="color: #666;">شكراً لك! 🏠✨</p>
        </div>
      `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ تم إرسال البريد بنجاح!');
        console.log('Message ID:', result.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(result));

    } catch (error) {
        console.error('❌ خطأ في إرسال البريد:', error);
        console.error('تفاصيل الخطأ:', error.message);
    }
}

// تشغيل الاختبار
testEmail();


