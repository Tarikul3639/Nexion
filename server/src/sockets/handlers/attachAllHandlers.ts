// server/src/sockets/handlers/attachAllHandlers.ts

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";

//Handlers Import
import { searchUsersAndConversations } from "../chat/LeftPanel/search/searchUsersAndConversations";
import { handleReadStatus } from "../chat/RightPanel/controller/readStatusHandler";
import { deliveryStatusHandler } from "../chat/RightPanel/controller/deliveryStatusHandler";
import { messageHandler } from "../chat/RightPanel";

/**
 * 🔗 Attaches ALL socket handlers (Chat, Notification, etc.) to the given socket.
 */
export const attachAllHandlers = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {

  // ------------------------------------
  // 🔹 1. Chat Handlers 
  // ------------------------------------
  searchUsersAndConversations(io, socket);
  messageHandler(io, socket, userSockets);
  handleReadStatus(io, socket, userSockets);
  deliveryStatusHandler(io, socket, userSockets);
};
