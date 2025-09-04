import { Server } from "socket.io";
import Message from "@/models/Message";
import { AuthenticatedSocket } from "./types";
import { DraftMessage, MessageItem } from "./types";
import mongoose from "mongoose";

export const messageHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets?: Map<string, Set<string>>
) => {
  // ---------------- Get all messages ----------------
  socket.on("getMessages", async (data: { chatId: string }) => {
    try {
      const messages = await Message.find({ conversation: data.chatId })
        .populate("sender", "username avatar role")
        .sort({ createdAt: 1 })
        .lean();

      const formattedMessages: MessageItem[] = messages.map((msg: any) => ({
        id: (msg._id as mongoose.Types.ObjectId).toString(),
        senderId: (msg.sender._id as mongoose.Types.ObjectId).toString(),
        senderName: msg.sender.username,
        senderAvatar: msg.sender.avatar || "",
        content: msg.content as DraftMessage,
        updatedAt: msg.updatedAt.toISOString(),
        status: "sent",
        isMe: socket.user?._id.toString() === (msg.sender._id as mongoose.Types.ObjectId).toString(),
        role: msg.sender.role,
        replyToId: msg.replyTo?.toString(),
        isEdited: msg.isEdited ?? false,
      }));

      socket.emit("messages", formattedMessages);
    } catch (err) {
      console.error(err);
      socket.emit("messagesError", "Failed to fetch messages");
    }
  });

  // ---------------- Send new message ----------------
  socket.on("sendMessage", async (data: any) => {
    console.log("Sending message:", data);
    try {
      const newMessage = await Message.create(data);
      const populated = await newMessage.populate("sender", "username avatar role");

      const sender = populated.sender as any; // TypeScript safe cast

      const msgObj: MessageItem = {
        id: (populated._id as mongoose.Types.ObjectId).toString(),
        senderId: (sender._id as mongoose.Types.ObjectId).toString(),
        senderName: sender.username,
        senderAvatar: sender.avatar || "",
        content: populated.content as DraftMessage,
        updatedAt: populated.updatedAt.toISOString(),
        status: "sent",
        isMe: socket.user?._id.toString() === (sender._id as mongoose.Types.ObjectId).toString(),
        role: sender.role,
        replyToId: populated.replyTo?.toString(),
        isEdited: populated.isEdited ?? false,
      };

      // Emit to conversation participants
      if (data.conversation && Array.isArray(data.participants)) {
        data.participants.forEach((userId: string) => {
          io.to(userId).emit("newMessage", msgObj);
        });
      } else {
        io.emit("newMessage", msgObj);
      }
    } catch (err) {
      console.error(err);
      socket.emit("sendMessageError", "Failed to send message");
    }
  });
};
