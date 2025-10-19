// server/src/sockets/index.ts

import { Server } from "socket.io";
import { authenticateSocket } from "./middleware/authenticateSocket";
import { onConnection } from "./handlers/onConnection";
import { onDisconnect } from "./handlers/onDisconnect";
import { AuthenticatedSocket } from "@/types/chat";

export const setupSocket = (io: Server) => {
  const userSockets = new Map<string, Set<string>>();

  // 🛡️ Middleware
  io.use(authenticateSocket);

  // 🤝 Connection handler
  io.on("connection", (socket: AuthenticatedSocket) => {

    // Handle user connection
    onConnection(io, socket, userSockets);

    socket.on("disconnect", () => {
      onDisconnect(io, socket, userSockets);
    });
  });
};
