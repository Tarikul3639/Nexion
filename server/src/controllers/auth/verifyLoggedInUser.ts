import { Request, Response } from "express";
import { ITokenPayload } from "@/types/auth";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";


// Token verify route
export const verifyLoggedInUser = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // 2️⃣ Verify JWT signature
    const key = config.get("jwt.secret") as string;
    if (!key) throw new Error("JWT secret key not found");

    const decoded = jwt.verify(token, key) as ITokenPayload;

    // 4️⃣ Database check: Match user AND check if the token exists in their active sessions
    const user = await User.findOne({
      _id: decoded._id,
      email: decoded.email,
      // 🔑 CRITICAL: Check the token against the sessions array
      "tracking.sessions.token": token,
    }).select("username name email avatar bio privacy tracking.status _id"); // Select required fields

    if (!user) {
      // 🛑 Error can be: User not found, OR Token not found in active sessions.
      // Both cases result in an unauthorized response.
      return res
        .status(401)
        .json({ success: false, message: "Invalid or revoked token/session" });
    }

    // 5️⃣ Optional: token blacklist check
    // const blacklisted = await TokenBlacklist.findOne({ token });
    // if (blacklisted) return res.status(401).json({ success: false, message: "Token revoked" });

    // 6️⃣ Respond with sanitized user data
    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          id: user._id,
          username: user.username || null,
          name: user.name || null,
          email: user.email,
          avatar: user.avatar || null,
          bio: user.bio || null,
          privacy: user.privacy || null,
          status: user.tracking.status,
        },
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);

    // 7️⃣ Handle JWT errors specifically
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
