import { Server } from "socket.io";
import { AuthenticatedSocket, IChatList } from "@/types/chat";
import User from "@/models/User";
import Conversation from "@/models/Conversation";

export const searchUsersHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("searchUsers", async ({ search }: { search?: string }) => {
    console.log("Searching users for:", search);

    if (!search || search.trim().length === 0) {
      socket.emit("searchUsersResult", []);
      return;
    }

    const userResults = await User.find({
      username: { $regex: search, $options: "i" },
    }).select("username avatar status");

    const groupResults = await Conversation.find({
      name: { $regex: search, $options: "i" },
    }).select("name avatar");

    const userChats: IChatList[] = userResults.map((user) => ({
      id: user._id.toString(),
      name: user.username,
      avatar: user.avatar,
      status: user.status,
      type: "direct",
    }));

    const groupChats: IChatList[] = groupResults.map((group) => ({
      id: group._id.toString(),
      name: group.name,
      avatar: group.avatar,
      type: "group",
    }));

    const chatList = [...userChats, ...groupChats];
    socket.emit("searchUsersResult", chatList);
  });
};
