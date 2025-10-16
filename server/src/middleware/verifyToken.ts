// 📁 middleware/verifyToken.ts

import { Request, Response, NextFunction } from "express";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";

// Extend Express Request to include user data
export interface AuthenticatedRequest extends Request {
  user?: any;
}

// JWT payload interface
interface ITokenPayload {
  _id: string;
  username?: string;
  name?: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("verifying....");
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log("header: ", authHeader);
    const token = authHeader?.split(" ")[1]; // "Bearer <token>"

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Check if token is a valid JWT (has three parts separated by dots)
    if (!token.includes('.') || token.split('.').length !== 3) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token format" 
      });
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

    // Attach user info to request object
    req.user = {
      id: user._id.toString(),
      email: user.email
    };

    // Authenticate user console
    console.log("Authentication success! ", "ID:", user._id, "Email:", user.email);

    next(); // proceed to next middleware/route
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
