// server/src/sockets/handlers/onConnection.ts

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import User from "@/models/User";

// Import all handlers
import { attachAllHandlers } from "./attachAllHandlers";

/**
 * 🤝 Socket Connection Handler
 * When a user connects, this handles what happens
 */
export const onConnection = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  const userId = socket.user!._id.toString();
  const now = new Date();

  // 🔹 Map user socket to user ID
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId)!.add(socket.id);

  // 🔹 Update user status in DB
  User.findByIdAndUpdate(userId, {
    "tracking.status": "online",
    "tracking.lastActiveAt": now,
  }).exec();

  io.emit("userStatusUpdate", { userId, status: "online" });

  console.log(`✅ User Connected: ${socket.id}, ID: ${userId}, Name: ${socket.user?.name}`);

  // 🔹 Attach all handlers (Chat, Notifications, etc.)
  attachAllHandlers(io, socket, userSockets);
};
