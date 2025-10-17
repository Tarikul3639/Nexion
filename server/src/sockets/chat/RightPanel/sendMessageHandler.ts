import { Server } from "socket.io";
import Conversation from "@/models/Conversation/Conversation";
import Message from "@/models/Message";
import { AuthenticatedSocket, MessageItem, DraftMessage } from "@/types/chat";
import mongoose from "mongoose";

export const sendMessageHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  socket.on(
    "sendMessage",
    async (data: {
      conversation?: string;
      sender: string;
      receiverId?: string;
      content: DraftMessage;
      replyTo?: string;
      tempId: string;
    }) => {
      try {
        let conversationId = data.conversation;
        let conv: any = null;

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

        const newMessage = await Message.create({
          conversation: conversationId,
          sender: data.sender,
          content: data.content,
          replyTo: data.replyTo,
          readBy: [data.sender],
          isEdited: false,
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: newMessage._id,
          updatedAt: new Date(),
        });

        const populated = await newMessage.populate(
          "sender",
          "name avatar role"
        );

        const baseMsgObj: MessageItem = {
          id: (newMessage._id as mongoose.Types.ObjectId).toString(),
          conversationId: conversationId,
          senderId: (populated.sender as any)._id.toString(),
          senderName: (populated.sender as any).name,
          senderAvatar: (populated.sender as any).avatar || "",
          content: populated.content as DraftMessage,
          updatedAt: populated.createdAt.toISOString(),
          status: "sent",
          role: (populated.sender as any).role,
          replyToId: populated.replyTo?.toString(),
          isEdited: populated.isEdited ?? false,
        };

        const senderMsgObj = {
          ...baseMsgObj,
          tempId: data.tempId,
        };

        const allMessages = await Message.find({ conversation: conversationId })
          .select("_id readBy")
          .lean();

        const conversation = await Conversation.findById(conversationId).lean();
        if (conversation?.participants) {
          for (const userId of conversation.participants) {
            const sockets = userSockets.get(userId.toString());
            const unreadCount = allMessages.filter(
              (msg) => !msg.readBy.map(String).includes(userId.toString())
            ).length;

            const chatListUpdate = {
              conversationId,
              unreadCount,
              lastMessage: {
                _id: baseMsgObj.id,
                content: baseMsgObj.content,
                createdAt: baseMsgObj.updatedAt,
                sender: {
                  _id: baseMsgObj.senderId,
                  name: baseMsgObj.senderName,
                  avatar: baseMsgObj.senderAvatar || "",
                },
              },
            };

            sockets?.forEach((sId) => {
              if (userId.toString() === data.sender) {
                io.to(sId).emit("newMessage", senderMsgObj);
                io.to(sId).emit("chatListUpdate", chatListUpdate);
              } else {
                io.to(sId).emit("newMessage", baseMsgObj);
                io.to(sId).emit("chatListUpdate", chatListUpdate);
              }
            });
          }
        }
      } catch (err) {
        console.error("sendMessage error:", err);
        socket.emit("sendMessageError", "Failed to send message");
      }
    }
  );
};