// libs/mail.ts
import nodemailer from "nodemailer";

export async function sendPasswordResetCode(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Cozy Project" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset. Here is your verification code:</p>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 3px; color: #2c3e50;">${code}</h1>
        </div>
        
        <p style="color: #7f8c8d; font-size: 14px;">
          This code will expire in 15 minutes. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
    text: `Your password reset code is: ${code}\n\nThis code expires in 15 minutes.`, // نسخة نصية للبريد
  });
}
