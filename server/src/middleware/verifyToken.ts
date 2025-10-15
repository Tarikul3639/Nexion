import { Request, Response } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";

// JWT payload interface
interface ITokenPayload {
  _id: string;
  username: string;
  name?: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Token verify route
export const verifyToken = async (req: Request, res: Response) => {
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

    // 3️⃣ Optional: check token expiry manually
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    // 4️⃣ Database check by _id + email + username
    const user = await User.findOne({
      _id: decoded._id,
      email: decoded.email,
    }).select("-password"); // sensitive data exclude

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
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
          username: user.username,
          email: user.email,
          avatar: user.avatar || null,
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
