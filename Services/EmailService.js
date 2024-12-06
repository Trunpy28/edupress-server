import path from 'path';
import { fileURLToPath } from 'url';

// Tạo __dirname trong ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tiếp tục với logic của bạn
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import handlebars from 'handlebars';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmailResetPassword = async (email, token) => {
  try {
    const resetPasswordLink = `${process.env.CLIENT_URL}/account/recovery/reset-password?email=${encodeURIComponent(email)}&verify_token=${token}`;
    
    // Đọc template HTML
    const sourceHtml = fs.readFileSync(path.resolve(__dirname, "../templateEmails/resetPassword.html"), { encoding: "utf8" });

    // Biên dịch template bằng handlebars
    const template = handlebars.compile(sourceHtml);

    // Dữ liệu cho context của template
    const context = {
      otpCode: token,
      resetLink: resetPasswordLink,
    };

    // Tạo HTML từ template
    const resetPasswordHtml = template(context);

    // Cấu hình thông tin email
    const mailOptions = {
      from: process.env.MAIL_ACCOUNT, // Địa chỉ gửi
      to: email, // Địa chỉ nhận
      subject: "Đặt lại mật khẩu", // Tiêu đề email
      text: "Đặt lại mật khẩu của bạn", // Nội dung văn bản (fallback cho email client không hỗ trợ HTML)
      html: resetPasswordHtml, // Nội dung HTML của email
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    throw new Error('Không thể gửi email reset password.');
  }
};
