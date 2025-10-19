// server/src/sockets/handlers/attachAllHandlers.ts

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";

import { getChatListHandler } from "../chat/LeftPanel/useInitialConversations";
import { searchUsersHandler } from "../chat/LeftPanel/searchUsers";
import { fetchPartnerDetailsHandler } from "../chat/LeftPanel/hook/fetchPartnerDetailsHandler";
import { chatPartnerInfoHandler } from "../chat/RightPanel/useChatPartnerInfo";
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
  getChatListHandler(io, socket);
  searchUsersHandler(io, socket);
  messageHandler(io, socket, userSockets);
  fetchPartnerDetailsHandler(io, socket);
  chatPartnerInfoHandler(io, socket);
};
