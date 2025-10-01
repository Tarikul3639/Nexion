// handlers/messageHandler.ts
import { Server } from "socket.io";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { AuthenticatedSocket, DraftMessage, MessageItem } from "@/types/chat";
import mongoose from "mongoose";

export const messageHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  // ---------------- Get all messages ----------------
  socket.on("getMessages", async ({ chatId }: { chatId: string }) => {
    try {
      const messages = await Message.find({ conversation: chatId })
        .populate("sender", "username avatar role")
        .sort({ createdAt: 1 })
        .lean();

      const formatted: MessageItem[] = messages.map((msg: any) => ({
        id: (msg._id as mongoose.Types.ObjectId).toString(),
        senderId: msg.sender._id.toString(),
        senderName: msg.sender.username,
        senderAvatar: msg.sender.avatar || "",
        content: msg.content as DraftMessage,
        updatedAt: msg.updatedAt.toISOString(),
        status: msg.status || "sent",
        isMe: socket.user?._id.toString() === msg.sender._id.toString(),
        role: msg.sender.role,
        replyToId: msg.replyTo?.toString(),
        isEdited: msg.isEdited ?? false,
      }));

      socket.emit("messages", formatted);
    } catch (err) {
      console.error("getMessages error:", err);
      socket.emit("messagesError", "Failed to fetch messages");
    }
  });

  // ---------------- Unified Send Message ----------------
  socket.on(
    "sendMessage",
    async (data: {
      conversation?: string; // existing conversation ID (optional)
      sender: string;
      receiverId?: string; // for direct chat (optional)
      content: DraftMessage;
      replyTo?: string;
      tempId: string;
    }) => {
      try {
        let conversationId = data.conversation;
        let conv: any = null;

        // If no conversation provided (new direct chat)
        if (!conversationId && data.receiverId) {
          conv = await Conversation.findOne({
            type: "direct",
            participants: { $all: [data.sender, data.receiverId] },
          });

          if (!conv) {
            conv = await Conversation.create({
              type: "direct",
              participants: [data.sender, data.receiverId],
            });
          }

          conversationId = (conv._id as mongoose.Types.ObjectId).toString();
        }

        if (!conversationId) {
          throw new Error("Conversation not found or receiver missing");
        }

        // Save message
        const newMessage = await Message.create({
          conversation: conversationId,
          sender: data.sender,
          content: data.content,
          replyTo: data.replyTo,
          isEdited: false,
        });

        // Update lastMessage in conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: newMessage._id,
          updatedAt: new Date(),
        });

        const populated = await newMessage.populate(
          "sender",
          "username avatar role"
        );

        const msgObj: MessageItem & { tempId?: string } = {
          id: (newMessage._id as mongoose.Types.ObjectId).toString(),
          senderId: (populated.sender as any)._id.toString(),
          senderName: (populated.sender as any).username,
          senderAvatar: (populated.sender as any).avatar || "",
          content: populated.content as DraftMessage,
          updatedAt: populated.updatedAt.toISOString(),
          status: "sent",
          isMe: false,
          role: (populated.sender as any).role,
          replyToId: populated.replyTo?.toString(),
          isEdited: populated.isEdited ?? false,
          tempId: data.tempId,
        };

        // Notify all participants
        const conversation = await Conversation.findById(conversationId).lean();
        if (conversation?.participants) {
          conversation.participants.forEach((userId: any) => {
            const sockets = userSockets.get(userId.toString());
            sockets?.forEach((sId) => {
              io.to(sId).emit("newMessage", msgObj);
            });
          });
        }
      } catch (err) {
        console.error("sendMessage error:", err);
        socket.emit("sendMessageError", "Failed to send message");
      }
    }
  );

  // ---------------- Delete Message ----------------
  socket.on("deleteMessage", async ({ messageId }: { messageId: string }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) throw new Error("Message not found");

      await Message.deleteOne({ _id: messageId });
      socket.emit("messageDeleted", { messageId });
    } catch (err) {
      console.error("deleteMessage error:", err);
      socket.emit("deleteMessageError", "Failed to delete message");
    }
  });

  // ---------------- Read Message ----------------
  socket.on(
    "messageRead",
    async ({ messageId, userId }: { messageId: string; userId: string }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) throw new Error("Message not found");

        // Add userId to readBy if not already present
        if (!message.readBy?.includes(new mongoose.Types.ObjectId(userId))) {
          message.readBy = [...(message.readBy || []), new mongoose.Types.ObjectId(userId)];
        }

        // update status -> seen
        message.status = "seen";
        await message.save();

        // notify sender + participants
        const conversation = await Conversation.findById(message.conversation).lean();
        if (conversation?.participants) {
          conversation.participants.forEach((participantId: any) => {
            const sockets = userSockets.get(participantId.toString());
            sockets?.forEach((sId) => {
              io.to(sId).emit("messageRead", {
                messageId: messageId,
                userId: userId,
                conversationId: conversation._id.toString(),
              });
            });
          });
        }
      } catch (err) {
        console.error("messageRead error:", err);
        socket.emit("messageReadError", "Failed to mark message as read");
      }
    }
  );
};
