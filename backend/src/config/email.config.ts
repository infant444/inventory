import nodemailer from "nodemailer";
import Mailgen from "mailgen";

// ======================
// Nodemailer Transporter
// ======================

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
});

// ======================
// Mailgen Configuration
// ======================

export const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "ABC Company",
    link: process.env.FRONTEND_URL || "http://localhost:4200",
    logo:
      "https://res.cloudinary.com/dftvthudb/image/upload/v1744654813/icon-text_jztpvu.png",
    copyright: "© 2025 ABC Company Pvt. Ltd. All rights reserved.",
  },
});