import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import { sendMessageHandler } from "./sendMessageHandler";
import { deleteMessageHandler } from "./deleteMessageHandler";

export const messageHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  sendMessageHandler(io, socket, userSockets);
  deleteMessageHandler(socket);
};