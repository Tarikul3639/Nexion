import { Server } from "socket.io";
import { AuthenticatedSocket } from "./types";
import Conversation from "../models/Conversation";
import User from "../models/User";

export const chatListHandler = (io: Server, socket: AuthenticatedSocket) => {
  // Server
socket.on("getChatList", async () => {
  try {
    const conversations = await Conversation.find({
      participants: socket.user?._id,
    })
      .select("username type avatar unread lastMessage participants updatedAt") 
      .populate({
        path: "lastMessage",
        select: "content sender createdAt", 
        populate: { path: "sender", select: "username avatar" } // lastMessage sender info
      })
      .sort({ updatedAt: -1 });

    socket.emit("chatList", conversations);
  } catch (error) {
    console.error(error);
    socket.emit("chatListError", "Failed to fetch chat list");
  }
});

  // Client
  socket.emit("getChatList");

  // Listen for search queries
  socket.on("searchChats", async (query: string) => {
    // console.log("Searching chats for user:", socket.user?._id, "Query:", query);
    if (!query) {
      socket.emit("searchChatsResult", []);
      return;
    }

    const results = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .sort({ updatedAt: -1 })
      .select("username avatar online");

    // console.log("Search results:", results);
    socket.emit("searchChatsResult", results);
  });
}
