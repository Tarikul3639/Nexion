"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const User_1 = __importDefault(require("@/models/User"));
const otplib_1 = require("otplib");
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email",
            });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // 🔹 Generate OTP
        const otp = otplib_1.authenticator.generate(process.env.OTP_SECRET || "default-secret");
        // 🔹 OTP expiration time (e.g. 5 minutes)
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        // 🔹 Save to DB
        user.otp = otp;
        user.otpExpires = otpExpiry;
        user.otpVerified = false; // Reset verification status
        await user.save();
        console.log(`Generated OTP for ${email}: ${otp}, expires at: ${otpExpiry}`);
        // 🔹 Send OTP via Email (later)
        // await sendEmail({ to: email, subject: "Your OTP Code", text: `Your OTP code is ${otp}` });
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.forgotPassword = forgotPassword;
