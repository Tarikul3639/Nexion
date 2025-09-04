// handlers/chatListHandler.ts
import { Server } from "socket.io";
import { AuthenticatedSocket, IChatList } from "./types";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";
import { IConversation } from "@/models/Conversation";

export const chatListHandler = (io: Server, socket: AuthenticatedSocket) => {
  // ---------------- Handle Fetching Chat List ----------------
  socket.on("getChatList", async () => {
    try {
      const userId = socket.user?._id;
      if (!userId) return;

      // Fetch all conversations where the current user is a participant
      const conversations = await Conversation.find({
        participants: userId,
      })
        // Populate last message with sender info
        .populate({
          path: "lastMessage",
          select: "content type sender createdAt isPinned",
          populate: { path: "sender", select: "username avatar" },
        })
        // Populate participants with basic user info
        .populate("participants", "username avatar status lastSeen")
        .sort({ updatedAt: -1 }) // Latest updated conversations first
        .lean();

      // Map each conversation to include unread message count and participants excluding self
      const chatList = await Promise.all(
        conversations.map(async (conv: IConversation) => {
          // Count unread messages for the current user
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

      // Emit the processed chat list to the client
      socket.emit("chatList", chatList);
    } catch (error) {
      console.error(error);
      socket.emit("chatListError", "Failed to fetch chat list");
    }
  });

  // ---------------- Handle Searching Users for New Chat ----------------
  socket.on("searchChats", async (query: string) => {
    if (!query) {
      socket.emit("searchChatsResult", []);
      return;
    }

    // Search users by username (case-insensitive) and return basic info
    const results = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username avatar online");

    socket.emit("searchChatsResult", results);
  });
};
