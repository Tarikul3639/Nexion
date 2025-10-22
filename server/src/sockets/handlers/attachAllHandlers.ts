// server/src/sockets/handlers/attachAllHandlers.ts

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";

//Handlers Import
// import { getInitialConversations } from "../chat/LeftPanel/initialConversation/getInitialConversations";
import { searchUsersAndConversations } from "../chat/LeftPanel/search/searchUsersAndConversations";
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
  // getInitialConversations(io, socket);
  searchUsersAndConversations(io, socket);
  messageHandler(io, socket, userSockets);
};
