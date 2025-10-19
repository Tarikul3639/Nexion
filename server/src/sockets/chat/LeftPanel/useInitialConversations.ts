import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import Conversation, { IConversation } from "@/models/Conversation";
import Message, { IMessage } from "@/models/Message/Message";
import { IUser } from "@/models/User";
import { getAvatarUrl } from "@/hooks/useAvatar";
import { IConversationResult, ILastMessage } from "./types"; 

type PopulatedConversation = Omit<IConversation, "participants" | "lastMessage"> & {
  participants: IUser[];
  lastMessage?: IMessage;
};

export const getChatListHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("get_initial_conversations", async () => {
    try {
      const userId = socket.user?._id;
      if (!userId) {
        socket.emit("chatListError", "Unauthorized");
        return;
      }

      const userIdStr = userId.toString();

      // --- 1. Fetch all conversations where user is a participant ---
      const conversations = await Conversation.find({ participants: userId })
        .populate<{ lastMessage: IMessage }>({
          path: "lastMessage",
          select: "content type sender createdAt",
          populate: { path: "sender", select: "name username avatar" },
        })
        .populate<{ participants: IUser[] }>({
          path: "participants",
          select: "name username avatar status lastSeen",
        })
        .sort({ updatedAt: -1 })
        .lean() as PopulatedConversation[];

      // --- 2. Map results into frontend-friendly format ---
      const chatList: IConversationResult[] = await Promise.all(
        conversations.map(async (conv) => {
          const unreadCount = await Message.countDocuments({
            conversation: conv._id,
            readBy: { $ne: userId },
          });

          // --- Prepare last message ---
          const lastMessage: ILastMessage | any = conv.lastMessage
            ? {
                _id: conv.lastMessage._id,
                content: conv.lastMessage.content,
                type: conv.lastMessage.type,
                createdAt: conv.lastMessage.createdAt,
                sender: conv.lastMessage.sender,
              }
            : null;

          // --- Handle name & avatar ---
          let convName = conv.name;
          let avatars: string = "";
          let displayType: "conversation" | "user" = "conversation";
          let partnerId: string | undefined;

          if (conv.type === "direct") {
            const partner = conv.participants.find(
              (p) => p._id.toString() !== userIdStr
            );
            if (partner) {
              partnerId = partner._id.toString();
              convName = partner.name;
              avatars = partner.avatar || "";
            } else {
              convName = "Deleted User";
              avatars = getAvatarUrl('deleted-user');
            }
          } else {
            // Group or classroom chat
            if (!convName) {
              convName = conv.participants
                .filter((p) => p._id.toString() !== userIdStr)
                .map((p) => p.name)
                .join(", ");
            }
            avatars = getAvatarUrl(conv._id.toString());
          }

          // --- Structure result ---
          const result: IConversationResult = {
            id: conv._id.toString(),
            displayType,
            name: convName,
            type: conv.type,
            avatar: avatars,
            isPinned: conv.isPinned ?? false,
            updatedAt: conv.updatedAt,
            unreadCount,
            lastMessage,
          };

          if (partnerId) result.partnerId = partnerId;

          return result;
        })
      );

      // --- 3. Send to client ---
      socket.emit("initial_conversations_results", chatList);
    } catch (error) {
      console.error("getChatListHandler error:", error);
      socket.emit("chatListError", "Failed to fetch chat list");
    }
  });
};
