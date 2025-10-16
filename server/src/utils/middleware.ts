import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

// Middleware for error handling
export const errorHandler = (
  err: Error,
  _req: Request, // Underscore prefix indicates it's not used
  res: Response,
  next: NextFunction
) => {
  console.error("Error-:) ", err);

  // Check if headers already sent
  if (res.headersSent) {
    return next(err);
  }
  
  // Set default status code and message
  let statusCode = 500;
  let message = "Internal server error";
  
  // Custom error types handling
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Authentication Error";
  } else if (err.name === "ForbiddenError") {
    statusCode = 403;
    message = "Forbidden";
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { error: err.message, stack: err.stack }),
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
