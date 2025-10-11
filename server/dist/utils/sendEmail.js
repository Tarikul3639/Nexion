"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        // 🔹 Create Transporter
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        // 🔹 Send Mail
        await transporter.sendMail({
            from: `"Nexion Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || text,
        });
        console.log(`✅ Email sent successfully to ${to}`);
    }
    catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Email could not be sent");
    }
};
exports.sendEmail = sendEmail;
