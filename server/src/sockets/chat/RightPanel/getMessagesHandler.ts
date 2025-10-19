import { AuthenticatedSocket, MessageItem, DraftMessage } from "@/types/chat";
import Message from "@/models/Message/Message";
import mongoose from "mongoose";

export const getMessagesHandler = (socket: AuthenticatedSocket) => {
  socket.on("getMessages", async ({ chatId }: { chatId: string }) => {
    try {
      const messages = await Message.find({ conversation: chatId })
        .populate("sender", "name username avatar role")
        .populate("readBy", "name username avatar")
        .sort({ createdAt: 1 })
        .lean();

      const formatted: MessageItem[] = messages.map((msg: any) => ({
        id: (msg._id as mongoose.Types.ObjectId).toString(),
        conversationId: msg.conversation.toString(),
        senderId: msg.sender._id.toString(),
        senderName: msg.sender.name,
        senderAvatar: msg.sender.avatar || "",
        content: msg.content as DraftMessage,
        readBy: msg.readBy.map((user: any) => ({
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          avatar: user.avatar || "",
        })),
        updatedAt: msg.updatedAt.toISOString(),
        status: msg.status || "sent",
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
};