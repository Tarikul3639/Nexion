import { Request, Response } from "express";
import User from "@/models/User";
import { IUser } from "@/models/User/UserTypes";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs";

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, device } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user with password
    const user = (await User.findOne({ email }).select(
      "+password"
    )) as IUser | null;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account is registered via social media.",
      });
    }

    // Password validation
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Record failed login attempt in loginHistory
      user.loginHistory.push({
        ipAddress: req.ip,
        userAgent: device || "Unknown Device",
        loginMethod: "email",
        status: "failed",
        loginAt: new Date(),
      });
      await user.save();
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect" });
    }

    // JWT creation
    const key = config.get("jwt.secret") as string;
    if (!key) throw new Error("JWT secret key not found");

    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email },
      key,
      { expiresIn: "7d" }
    );

    // Get IP
    const ipRaw =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Unknown IP";
    const ip = Array.isArray(ipRaw) ? ipRaw[0] : String(ipRaw);

    const now = new Date();

    // Update sessions according to schema
    user.sessions.push({
      userAgent: device || "Unknown Device",
      ipAddress: ip,
      token,
    });

    // Update loginHistory (successful login)
    user.loginHistory.push({
      ipAddress: ip,
      userAgent: device || "Unknown Device",
      loginMethod: "email",
      status: "success",
      loginAt: now,
    });

    // Update lastSeen and lastActiveAt
    user.lastSeen = now;
    user.lastActiveAt = now;

    await user.save();

    // Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          sessions: user.sessions, // Optional: show active sessions
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
