import { Server } from "socket.io";
import { AuthenticatedSocket, IChatList } from "@/types/chat";
import User from "@/models/User";
import Conversation from "@/models/Conversation";

export const searchUsersHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("searchUsers", async ({ search }: { search?: string }) => {
    try {
      console.log("Searching users for:", search);

      if (!search || !search.trim()) {
        socket.emit("searchUsersResult", []);
        return;
      }

      if (!socket.user || !socket.user._id) {
        socket.emit("searchUsersResult", []);
        return;
      }
      const currentUserId = socket.user._id;

      const userResults = (
        await User.find({
          username: { $regex: search, $options: "i" },
        }).select("username avatar status")
      ).map((user) => ({
        id: user._id,
        name: user.username,
        avatar: user.avatar,
        isNew: true, // mark as new user by default
      }));

      // ---------------- search conversations to exclude existing direct chats ----------------
      const existingConversations = (
        await Conversation.find({
          participants: { $all: [currentUserId] },
        }).select("participants avatar name")
      ).map((conv) => ({
        id: conv._id,
        avatar: conv.avatar,
        name: conv.name,
        type: conv.type,
        participants: conv.participants,
        isNew: false,
      }));

      // ---------------- Final Response ----------------
      const chatList = [...userResults, ...existingConversations];
      socket.emit("searchUsersResult", chatList);
    } catch (error) {
      console.error("Error in searchUsers:", error);
      socket.emit("searchUsersResult", []); // fallback empty
    }
  });
};
