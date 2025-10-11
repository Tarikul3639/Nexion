import { Request, Response } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs";

export const passwordReset = async (req: Request, res: Response) => {
  const { email, newPassword, passwordResetToken } = req.body;
  console.log("Received password reset request:", {
    email,
    newPassword,
    passwordResetToken,
  });
  try {
    if (!email || !newPassword || !passwordResetToken) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, new password, and password reset token",
      });
    }
    // 🔹 Find user by email and select OTP fields
    const user = await User.findOne({ email }).select("+otpVerified");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // 🔹 Ensure OTP was verified
    if (!user.otpVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP not verified",
      });
    }

    // 🔹 Verify password reset token
    const jwtSecret = config.get<string>("jwt.secret");
    if (!jwtSecret) {
      console.error("JWT secret is not configured");
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    try {
      const decoded = jwt.verify(passwordResetToken, jwtSecret) as {
        userId: string;
      };
      if (decoded.userId !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Invalid password reset token",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid password reset token",
      });
    }
    // TODO: Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔹 Update user's password
    user.password = hashedPassword;
    user.otp = undefined; // Clear OTP
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
