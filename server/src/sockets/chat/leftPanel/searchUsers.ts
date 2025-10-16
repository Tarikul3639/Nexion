import { Server } from "socket.io";
import { AuthenticatedSocket, IChatList } from "@/types/chat";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { IConversation } from "@/models/Conversation";
import { userInfo } from "os";

export const searchUsersHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("search", async ({ search }) => {
    try {
      if (!search || search.trim().length === 0) {
        socket.emit("searchResults", []);
        return;
      }

      if (!socket.user) {
        socket.emit("searchError", "Unauthorized");
        return;
      }

      const currentUserId = socket.user._id.toString();

      // ---- Search Conversations (groups + existing direct) ----
      const conversationResults = await Conversation.find({
        name: { $regex: search, $options: "i" },
        participants: currentUserId,
      })
        .populate({
          path: "lastMessage",
          select: "content type sender createdAt isPinned",
          populate: { path: "sender", select: "name username avatar" },
        })
        .populate("participants", "name username avatar status lastSeen")
        .sort({ updatedAt: -1 })
        .lean();

      const mappedConversations = await Promise.all(
        conversationResults.map(async (conv: IConversation) => {
          const unreadCount = await Message.countDocuments({
            conversation: conv._id,
            readBy: { $ne: currentUserId },
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

      // ---- Collect userIds from direct conversations to avoid duplicates ----
      const directConversations = conversationResults.filter(c => c.type === "direct");
      const directUserIds = new Set<string>();
      directConversations.forEach(conv => {
        conv.participants.forEach((p: any) => {
          directUserIds.add(p._id.toString());
        });
      });

      // ---- Search Users ----
      const userResults = await User.find({
        name: { $regex: search, $options: "i" },
        _id: { $nin: Array.from(directUserIds) }, // exclude existing direct users + self if needed
      }).select("name username avatar status");

      const mappedUsers = userResults.map(user => ({
        id: user._id.toString(),
        type: "user",
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        status: user.status,
      }));

      // ---- Merge Users + Conversations ----
      const results = [...mappedUsers, ...mappedConversations];

      socket.emit("searchResults", results);
    } catch (err) {
      console.error("Search error:", err);
      socket.emit("searchError", "Failed to search");
    }
  });
};
