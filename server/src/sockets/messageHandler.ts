import { Server } from "socket.io";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { AuthenticatedSocket } from "./types";
import { DraftMessage, MessageItem } from "./types";
import mongoose from "mongoose";

export const messageHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  // ---------------- Get all messages ----------------
  socket.on("getMessages", async ({ chatId }: { chatId: string }) => {
    try {
      const messages = await Message.find({ conversation: chatId })
        .populate("sender", "username avatar role")
        .sort({ createdAt: 1 })
        .lean();

      const formatted: MessageItem[] = messages.map((msg: any) => ({
        id: (msg._id as mongoose.Types.ObjectId).toString(),
        senderId: msg.sender._id.toString(),
        senderName: msg.sender.username,
        senderAvatar: msg.sender.avatar || "",
        content: msg.content as DraftMessage,
        updatedAt: msg.updatedAt.toISOString(),
        status: "sent",
        isMe: socket.user?._id.toString() === msg.sender._id.toString(),
        role: msg.sender.role,
        replyToId: msg.replyTo?.toString(),
        isEdited: msg.isEdited ?? false,
      }));

      socket.emit("messages", formatted);
    } catch (err) {
      console.error("getMessages error:", err);
      socket.emit("messagesError", "Failed to fetch messages");
    }
  });

  // ---------------- Unified Send Message ----------------
  socket.on("sendMessage", async (data: {
    conversation?: string;   // existing conversation ID (optional)
    sender: string;
    receiverId?: string;     // for direct chat (optional)
    content: DraftMessage;
    replyTo?: string;
    tempId: string;
  }) => {
    try {
      let conversationId = data.conversation;

      // If no conversation provided (new direct chat)
      if (!conversationId && data.receiverId) {
        let conv = await Conversation.findOne({
          type: "direct",
          participants: { $all: [data.sender, data.receiverId] },
        });

        if (!conv) {
          conv = await Conversation.create({
            type: "direct",
            participants: [data.sender, data.receiverId],
          });
        }

        conversationId = (conv._id as mongoose.Types.ObjectId).toString();
      }

      if (!conversationId) {
        throw new Error("Conversation not found or receiver missing");
      }

      // Save message
      const newMessage = await Message.create({
        conversation: conversationId,
        sender: data.sender,
        content: data.content,
        replyTo: data.replyTo,
        isEdited: false,
      });

      const populated = await newMessage.populate("sender", "username avatar role");

      const msgObj: MessageItem & { tempId?: string } = {
        id: (newMessage._id as mongoose.Types.ObjectId).toString(),
        senderId: (populated.sender as any)._id.toString(),
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

      // Notify all participants
      const conv = await Conversation.findById(conversationId).lean();
      if (conv?.participants) {
        conv.participants.forEach((userId: any) => {
          const sockets = userSockets.get(userId.toString());
          sockets?.forEach((sId) => {
            io.to(sId).emit("newMessage", msgObj);
          });
        });
      }

    } catch (err) {
      console.error("sendMessage error:", err);
      socket.emit("sendMessageError", "Failed to send message");
    }
  });
};
