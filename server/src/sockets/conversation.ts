// server/src/sockets/conversation.ts
import { Server } from "socket.io";
import { AuthenticatedSocket } from "./types";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/User";

export const conversationHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  socket.on("getConversation", async ({ currentUserId, friendId }) => {
    try {
      let conversation = await Conversation.findById(friendId)
        .populate("participants", "username avatar status")
        .populate({ path: "lastMessage", populate: { path: "sender", select: "username avatar" } });

      if (conversation) {
        const messages = await Message.find({ conversation: conversation._id })
          .select("content sender createdAt type replyTo reactions isPinned")
          .sort({ createdAt: 1 })
          .limit(50)
          .populate("sender", "username avatar");
        socket.emit("conversationFound", { conversation, messages });
        return;
      }

      // Direct chat
      conversation = await Conversation.findOne({
        type: "direct",
        participants: { $all: [currentUserId, friendId] },
      }).populate("participants", "username avatar status");

      if (conversation) {
        const messages = await Message.find({ conversation: conversation._id })
          .sort({ createdAt: 1 })
          .limit(50)
          .populate("sender", "username avatar");
        socket.emit("conversationFound", { conversation, messages });
      } else {
        const friendInfo = await User.findById(friendId).select("username avatar status");
        socket.emit("conversationNotFound", friendInfo);
      }
    } catch (err) {
      console.error("Error in getConversation:", err);
      socket.emit("chatListError", "Failed to get conversation");
    }
  });

  socket.on("sendMessage", async ({ senderId, receiverId, text, attachments, replyTo }) => {
    try {
      console.log("sendMessage called with:", { senderId, receiverId, text, attachments, replyTo });   
      let conversation = await Conversation.findById(receiverId);

      if (!conversation) {
        conversation = await Conversation.findOne({
          type: "direct",
          participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
          conversation = await Conversation.create({
            type: "direct",
            participants: [senderId, receiverId],
            username: `${senderId}-${receiverId}`,
          });
        }
      }

      const messageData = {
        conversation: conversation._id,
        sender: senderId, 
        content: {
          text: text,
          attachments: attachments
        },
        replyTo,
        isEdited: false,
      };

      const message = await Message.create(messageData);

      // Populate sender info
      const populatedMessage = await Message.findById(message._id).populate("sender", "username avatar");

      // Emit message to all participants using userSockets
      conversation.participants.forEach((p: any) => {
        const userId = p._id.toString();
        const sockets = userSockets.get(userId);
        sockets?.forEach(socketId => {
          io.to(socketId).emit("newMessage", {
            message: populatedMessage,
          });
        });
      });
    } catch (err) {
      console.error("Send message error:", err);
      socket.emit("errorMessage", "Failed to send message");
    }
  });
};
