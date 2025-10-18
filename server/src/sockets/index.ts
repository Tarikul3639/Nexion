// server/src/sockets/index.ts
import { Server } from "socket.io";
import { getChatListHandler } from "./chat/LeftPanel/useInitialConversations";
import { searchUsersHandler } from "./chat/LeftPanel/searchUsers";
import { fetchPartnerDetailsHandler } from "./chat/LeftPanel/hook/fetchPartnerDetailsHandler";
import { messageHandler } from "./chat/RightPanel";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import config from "config";
import { IUser, AuthenticatedSocket, ITokenPayload } from "@/types/chat";

export const setupSocket = (io: Server) => {
  // Map to store userId -> set of socketIds
  const userSockets = new Map<string, Set<string>>();

  // Middleware for authentication
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token)
        return next(new Error("Authentication error: No token provided"));

      const key = config.get("jwt.secret") as string;
      if (!key) throw new Error("JWT secret key not found");

      const decoded = jwt.verify(token, key) as ITokenPayload;

      const user = await User.findById(decoded._id).select(
        "_id email name username avatar"
      );
      if (!user) return next(new Error("Authentication error: User not found"));

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
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.user!._id.toString();

    // Add socket to map
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId)!.add(socket.id);
    User.findByIdAndUpdate(userId, { status: "online" }).exec();
    io.emit("userStatusUpdate", { userId, status: "online" });

    console.log(
      "✅ New socket connected:",
      socket.id,
      "User:",
      socket.user?.name
    );

    // Attach handlers
    getChatListHandler(io, socket);
    searchUsersHandler(io, socket);
    messageHandler(io, socket, userSockets);
    fetchPartnerDetailsHandler(io, socket);

    socket.on("disconnect", () => {
      // Remove socket from map
      userSockets.get(userId)?.delete(socket.id);
      if (userSockets.get(userId)?.size === 0) {
        userSockets.delete(userId);
        User.findByIdAndUpdate(userId, { status: "offline", lastSeen: new Date() }).exec();
        io.emit("userStatusUpdate", { userId, status: "offline" });
      }
      console.log(
        "❌ Socket disconnected:",
        socket.id,
        "User:",
        socket.user?.name
      );
    });
  });
};
