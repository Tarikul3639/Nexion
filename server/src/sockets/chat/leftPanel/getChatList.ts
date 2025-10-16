import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import Conversation, { IConversation } from "@/models/Conversation";
import Message from "@/models/Message";
import { IUser } from "@/models/User";
import { IMessage } from "@/models/Message";

// Extended type after population
type PopulatedConversation = Omit<
  IConversation,
  "participants" | "lastMessage"
> & {
  participants: IUser[];
  lastMessage?: IMessage;
};

export const getChatListHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("getChatList", async () => {
    try {
      const userId = socket.user?._id;
      if (!userId) return;

      const conversations = await Conversation.find({ participants: userId })
        .populate<{ lastMessage: IMessage }>({
          path: "lastMessage",
          select: "content type sender createdAt isPinned",
          populate: { path: "sender", select: "name username avatar" },
        })
        .populate<{ participants: IUser[] }>({
          path: "participants",
          select: "name username avatar status lastSeen",
        })
        .sort({ updatedAt: -1 })
        .lean();

      const chatList = await Promise.all(
        (conversations as PopulatedConversation[]).map(async (conv) => {
          const unreadCount = await Message.countDocuments({
            conversation: conv._id,
            readBy: { $ne: userId },
          });

          // --- Generate name dynamically for direct chats ---
          let convName = conv.name;
          if (!convName) {
            const participants = conv.participants;
            const other = participants.find((p) => p._id.toString() !== userId);
            convName = other?.name || "Unknown";
          }

          // --- Generate avatar(s) dynamically ---
          let avatars: string[] = [];
          if (conv.avatar) {
            avatars = [conv.avatar];
          } else {
            const participants = conv.participants;
            avatars = participants
              .filter((p) => p._id.toString() !== userId) // self excluded
              .map((p) => p.avatar || "");
          }

          return {
            id: conv._id,
            name: convName,
            type: conv.type,
            avatar: avatars,
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
