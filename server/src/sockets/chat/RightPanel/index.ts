import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import { getMessagesHandler } from "./getMessagesHandler";
import { sendMessageHandler } from "./sendMessageHandler";
import { deleteMessageHandler } from "./deleteMessageHandler";
import { messageReadHandler } from "./messageReadHandler";

export const messageHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  getMessagesHandler(socket);
  sendMessageHandler(io, socket, userSockets);
  deleteMessageHandler(socket);
  messageReadHandler(io, socket, userSockets);
};