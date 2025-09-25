import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";

// Choose one of these auth methods. For quick start, use SMTP_HOST/USER/PASS.
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

let transporter: nodemailer.Transporter | null = null;

export function getTransporter() {
  if (transporter) return transporter;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  } else {
    // Fallback: JSON transport (logs emails to console)
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return transporter;
}

export async function notifyAdmin(subject: string, message: string) {
  const tx = getTransporter();
  const info = await tx.sendMail({
    from: `"Installer Bot" <no-reply@fleetwatch.com.au>`,
    to: ADMIN_EMAIL,
    subject,
    text: message,
  });
  console.log("ADMIN EMAIL SENT:", info);
}
