// handlers/messageHandler.ts
import { Server } from "socket.io";
import Message from "@/models/Message";
import { AuthenticatedSocket } from "./types";

export const messageHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets?: Map<string, Set<string>>
) => {
  // ---------------- Get all messages ----------------
  socket.on("getMessages", async () => {
    try {
      const messages = await Message.find({})
        .populate("sender", "username avatar")
        .sort({ createdAt: 1 })
        .lean();

      // Convert _id to id for client
      const formattedMessages = messages.map((msg) => ({
        ...msg,
        id: msg._id.toString(),
      }));

      socket.emit("messages", formattedMessages); // only to current user
    } catch (err) {
      console.error(err);
      socket.emit("messagesError", "Failed to fetch messages");
    }
  });

  // ---------------- Send new message ----------------
  // ---------------- Send new message ----------------
socket.on("sendMessage", async (data: any) => {
  try {
    const newMessage = await Message.create(data);
    const populated = await newMessage.populate("sender", "username avatar");

    // Convert to plain object first
    const msgObj = populated.toObject() as any;

    const formattedMessage = {
      ...msgObj,
      id: msgObj._id.toString(), // now TypeScript knows it's string
    };

    // Emit only to conversation participants
    if (data.conversation && Array.isArray(data.participants)) {
      data.participants.forEach((userId: string) => {
        io.to(userId).emit("newMessage", formattedMessage); // assuming socket.join(userId) done
      });
    } else {
      io.emit("newMessage", formattedMessage); // fallback
    }
  } catch (err) {
    console.error(err);
    socket.emit("sendMessageError", "Failed to send message");
  }
});

};
