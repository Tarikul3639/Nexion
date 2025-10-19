// server/src/sockets/handlers/onDisconnect.ts

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import User from "@/models/User";

/**
 * ❌ Socket Disconnect Handler
 * If user disconnects, then status update and cleanup are performed
 */
export const onDisconnect = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  const userId = socket.user!._id.toString();

  // 🔹 Remove socket from map
  userSockets.get(userId)?.delete(socket.id);

  if (userSockets.get(userId)?.size === 0) {
    userSockets.delete(userId);
    User.findByIdAndUpdate(userId, {
      "tracking.status": "offline",
      "tracking.lastSeen": new Date(),
      "tracking.lastActiveAt": new Date(),
    }).exec();
    io.emit("userStatusUpdate", { userId, status: "offline" });
  }

  console.log(`❌ Disconnected: ${socket.id} (${socket.user?.name})`);
};
