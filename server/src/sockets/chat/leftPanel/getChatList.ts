import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import Conversation, { IConversation } from "@/models/Conversation";
import Message from "@/models/Message";

export const getChatListHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("getChatList", async () => {
    try {
      const userId = socket.user?._id;
      if (!userId) return;

      const conversations = await Conversation.find({ participants: userId })
        .populate({
          path: "lastMessage",
          select: "content type sender createdAt isPinned",
          populate: { path: "sender", select: "username avatar" },
        })
        .populate("participants", "username avatar status lastSeen")
        .sort({ updatedAt: -1 })
        .lean();

      const chatList = await Promise.all(
        conversations.map(async (conv: IConversation) => {
          const unreadCount = await Message.countDocuments({
            conversation: conv._id,
            readBy: { $ne: userId },
          });

          return {
            id: conv._id,
            name: conv.name,
            type: conv.type,
            avatar: conv.avatar,
            isPinned: conv.isPinned,
            lastMessage: conv.lastMessage,
            participants: conv.participants,
            updatedAt: conv.updatedAt,
            unreadCount,
          };
        })
      );

      socket.emit("chatList", chatList);
    } catch (error) {
      console.error(error);
      socket.emit("chatListError", "Failed to fetch chat list");
    }
  });
};
