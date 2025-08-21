import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

// Middleware to authenticate JWT token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const secret = config.get("jwt.secret") || "fallback-secret";
    const decoded = jwt.verify(token, secret as string) as {
      userId: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Middleware for error handling
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};

// Middleware for request logging
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};
