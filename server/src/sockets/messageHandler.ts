import { Server } from "socket.io";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { AuthenticatedSocket } from "./types";
import { DraftMessage, MessageItem } from "./types";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import config from "config";

// Cloudinary config
cloudinary.config(config.get("cloudinary"));

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
        isMe:
          socket.user?._id.toString() ===
          (msg.sender._id as mongoose.Types.ObjectId).toString(),
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
    console.log(
      "sendMessage data:",
      data.content.attachments.map((a: any) => a.type)
    );
    try {
      const newMessage = await Message.create(data);
      const populated = await newMessage.populate(
        "sender",
        "username avatar role"
      );

      const msgObj: MessageItem & { tempId?: string } = {
        id: (populated._id as mongoose.Types.ObjectId).toString(),
        senderId: (populated.sender as any)._id.toString(), // safe cast
        senderName: (populated.sender as any).username,
        senderAvatar: (populated.sender as any).avatar || "",
        content: populated.content as DraftMessage,
        updatedAt: populated.updatedAt.toISOString(),
        status: "sent",
        isMe: false,
        role: (populated.sender as any).role,
        replyToId: populated.replyTo?.toString(),
        isEdited: populated.isEdited ?? false,
        tempId: data.tempId,
      };

      // Emit to conversation participants
      const conversation = await Conversation.findById(
        data.conversation
      ).lean();
      if (conversation?.participants) {
        conversation.participants.forEach((userId: any) => {
          io.to(userId.toString()).emit("newMessage", msgObj);
        });
      }

      // Send status update to sender
      io.to(socket.id).emit("messageStatusUpdate", {
        id: msgObj.id, // real DB ID
        tempId: data.tempId, // match frontend temp message
        status: "sent",
      });
    } catch (err) {
      console.error(err);
      socket.emit("sendMessageError", "Failed to send message");
    }
  });
};
