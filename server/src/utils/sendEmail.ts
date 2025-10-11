import nodemailer from "nodemailer";
import config from "config";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: EmailOptions): Promise<void> => {
  try {
    // 🔹 Create Transporter
    const transporter = nodemailer.createTransport({
      host: config.get("email.host"),
      port: Number(config.get("email.port")) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.get("email.auth.user"),
        pass: config.get("email.auth.pass"),
      },
    });

    // 🔹 Send Mail
    await transporter.sendMail({
      from: `"Nexion Support" <${config.get("email.auth.user")}>`,
      to,
      subject,
      text,
      html: html || text,
    });

    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
