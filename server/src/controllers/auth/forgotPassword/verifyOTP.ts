import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import config from "config";

export const VerifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    console.log("Received OTP verification request:", { email, otp });
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and OTP",
      });
    }

    // 🔹 Find user by email and select OTP fields
    const user = await User.findOne({ email }).select("+otp +otpExpires +otpVerified");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log('User found for OTP verification:', user);

    // 🔹 Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 🔹 Check if OTP is expired
    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // 🔹 Check if OTP is already verified
    if (user.otpVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP already used",
      });
    }

    // generate temporary token
    const jwtSecret = config.get<string>("jwt.secret");
    if (!jwtSecret) {
      console.error("JWT secret is not configured");
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
    const passwordResetToken = jwt.sign({ userId: user._id.toString() }, jwtSecret, { expiresIn: '5m' });

    // 🔹 OTP is valid
    user.otpVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      passwordResetToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};