import { Request, Response } from "express";
import User from "@/models/User";
import { IUser } from "@/models/User/UserTypes";
import jwt from "jsonwebtoken";
import config from "config";

// Google login handler
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name, avatar, googleId, token } = req.body;

    if (!email || !googleId || !token) {
      return res.status(400).json({
        success: false,
        message: "Google authentication failed. Missing required data.",
      });
    }

    // 🔹 Find existing user by email or OAuth providerId
    let user = (await User.findOne({
      $or: [
        { email },
        { "oauth.provider": "google", "oauth.providerId": googleId },
      ],
    })) as IUser | null;

    // 🔹 If user doesn't exist, create a new one
    if (!user) {
      user = new User({
        name,
        email,
        username: email.split("@")[0],
        avatar,
        oauth: [
          {
            provider: "google",
            providerId: googleId,
            email,
            avatar,
          },
        ],
      });

      await user.save();
    } else {
      // 🔹 If user exists but OAuth not linked, add provider
      const alreadyLinked = user.oauth.some(
        (o) => o.provider === "google" && o.providerId === googleId
      );
      if (!alreadyLinked) {
        user.oauth.push({
          provider: "google",
          providerId: googleId,
          email,
          avatar,
        });
      }
    }

    // 🔹 Generate JWT token
    const key = config.get("jwt.secret") as string;
    if (!key) throw new Error("JWT secret key not found");

    const jwtToken = jwt.sign(
      { _id: user._id.toString(), email: user.email },
      key,
      { expiresIn: "7d" }
    );

    // 🔹 Add session
    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Unknown IP";
    const ipString = Array.isArray(ip) ? ip[0] : String(ip);

    const newSession = {
      userAgent: req.headers["user-agent"] || "Unknown Device",
      ipAddress: ipString,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      token: jwtToken,
    };
    user.sessions.push(newSession);

    // 🔹 Update login history
    user.loginHistory.push({
      userAgent: req.headers["user-agent"] || "Unknown Device",
      ipAddress: ipString,
      loginMethod: "google",
      status: "success",
      loginAt: new Date(),
    });

    await user.save();

    // 🔹 Send response
    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        token: jwtToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          sessions: user.sessions,
          oauth: user.oauth,
        },
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
