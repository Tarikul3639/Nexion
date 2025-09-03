// handlers/chatListHandler.ts
import { Server } from "socket.io";
import { AuthenticatedSocket, IChatList } from "./types";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";

export const chatListHandler = (io: Server, socket: AuthenticatedSocket) => {
  // ---------------- Get Chat List ----------------
  socket.on("getChatList", async () => {
    try {
      const userId = socket.user?._id;
      console.log("userId in getChatList:", userId);
      if (!userId) return;

      // All conversation where user is a participant
      const conversations = await Conversation.find({
        participants: userId,
      })
        .populate({
          path: "lastMessage",
          select: "content type sender createdAt isPinned",
          populate: { path: "sender", select: "username avatar" },
        })
        .populate("participants", "username avatar")
        .sort({ updatedAt: -1 })
        .lean();

      // Map conversations to include unread count
      const chatList = await Promise.all(
        conversations.map(async (conv: any) => {
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
      console.log("chatList:", chatList);
      socket.emit("chatList", chatList);
    } catch (error) {
      console.error(error);
      socket.emit("chatListError", "Failed to fetch chat list");
    }
  });

  // ---------------- Search Users for New Chat ----------------
  socket.on("searchChats", async (query: string) => {
    if (!query) {
      socket.emit("searchChatsResult", []);
      return;
    }

    const results = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username avatar online");

    socket.emit("searchChatsResult", results);
  });
};
