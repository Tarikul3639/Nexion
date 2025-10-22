// server/src/sockets/middleware/authenticateSocket.ts

import { AuthenticatedSocket, ITokenPayload, IUser } from "@/types/chat";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";

/**
 * Socket.io Authentication Middleware
 * Validates the JWT token sent in the socket handshake
 * Emits events based on connection status
 */
export const authenticateSocket = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  try {
    // 1. Token check
    const token = socket.handshake.auth.token;
    if (!token) {
      socket.emit("connection:denied", {
        success: false,
        reason: "no_token",
        message: "No token provided",
      });
      return next(new Error("Connection denied: No token provided"));
    }

    // 2. Get JWT secret
    const key = config.get("jwt.secret") as string;
    if (!key) throw new Error("JWT secret key not found");

    // 3. Verify token
    const decoded = jwt.verify(token, key) as ITokenPayload;

    // 4. Find user
    const user = await User.findById(decoded._id).select(
      "_id email name username avatar"
    );

    if (!user) {
      socket.emit("connection:user_not_found", {
        success: false,
        reason: "user_not_found",
        message: "User not found",
      });
      return next(new Error("Connection denied: User not found"));
    }

    // 5. Attach user to socket
    socket.user = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    } as IUser;

    // 6. Emit success
    socket.emit("connection:verified", {
      success: true,
      user: socket.user,
      message: "Connection verified successfully",
    });

    next();
  } catch (err: any) {
    // 7. Handle token errors
    const isExpired = err.name === "TokenExpiredError";

    socket.emit("connection:expired", {
      success: false,
      reason: isExpired ? "expired" : "invalid_token",
      message: isExpired
        ? "Your session has expired. Please log in again."
        : "Invalid token provided.",
    });

    return next(new Error(`Connection error: ${err.message}`));
  }
};
