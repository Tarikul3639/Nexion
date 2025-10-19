// server/src/sockets/middleware/authenticateSocket.ts

import { AuthenticatedSocket, ITokenPayload, IUser } from "@/types/chat";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";

/**
 * 🛡️ Socket.io Authentication Middleware
 * Validates the JWT token sent in the socket handshake
 */
export const authenticateSocket = async (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const key = config.get("jwt.secret") as string;
    if (!key) throw new Error("JWT secret key not found");

    const decoded = jwt.verify(token, key) as ITokenPayload;

    const user = await User.findById(decoded._id).select(
      "_id email name username avatar"
    );

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // ✅ Store in socket.user (typed)
    socket.user = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    } as IUser;

    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
};
