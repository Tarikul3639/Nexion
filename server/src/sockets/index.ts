// server/src/sockets/index.ts
import { Server } from "socket.io";
import { chatListHandler } from "./chatList";
import { conversationHandler } from "./conversation";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";
import { IUser, AuthenticatedSocket, ITokenPayload } from "./types";

export const setupSocket = (io: Server) => {
  // Map to store userId -> set of socketIds
  const userSockets = new Map<string, Set<string>>();

  // Middleware for authentication
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error: No token provided"));

      const key = config.get("jwt.secret") as string;
      if (!key) throw new Error("JWT secret key not found");

      const decoded = jwt.verify(token, key) as ITokenPayload;

      const user = await User.findById(decoded._id).select("_id email username");
      if (!user) return next(new Error("Authentication error: User not found"));

      socket.user = user as IUser;

      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.user!._id.toString();

    // Add socket to map
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId)!.add(socket.id);

    console.log("✅ New socket connected:", socket.id, "User:", socket.user?.username);

    // Attach handlers
    chatListHandler(io, socket);
    conversationHandler(io, socket, userSockets);

    socket.on("disconnect", () => {
      // Remove socket from map
      userSockets.get(userId)?.delete(socket.id);
      if (userSockets.get(userId)?.size === 0) userSockets.delete(userId);

      console.log("❌ Socket disconnected:", socket.id, "User:", socket.user?.username);
    });
  });
};
