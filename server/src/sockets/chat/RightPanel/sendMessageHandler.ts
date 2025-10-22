// src/sockets/handlers/sendMessageHandler.ts (UPDATED)

import { Server } from "socket.io";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message/Message";
import { AuthenticatedSocket, MessageItem, DraftMessage } from "@/types/chat";
import mongoose from "mongoose";

// 💡 New interface reflecting data passed from client
interface ISendMessageData {
  conversation?: string;
  sender: string;
  partner?: string;
  content: DraftMessage;
  type: MessageItem['type']; // 💡 New: Message type (text, image, etc.)
  senderName: string; // 💡 New: Sender name cache
  senderAvatar?: string; // 💡 New: Sender avatar cache
  replyTo?: string;
  tempId: string;
}

export const sendMessageHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  socket.on("sendMessage", async (data: ISendMessageData) => {
    console.log("Received message: ", data);
    try {
      let conversationId = data.conversation;
      let conv: any = null;

      const senderId = socket.user?._id.toString();
      const partnerId = data.partner;

      if (senderId !== data.sender) {
        throw new Error("Sender ID does not match authenticated user");
      }

      // 1. Handle new direct conversation creation
      if (!conversationId && partnerId) {
        conv = await Conversation.findOne({
          type: "direct",
          participants: { $all: [senderId, partnerId] },
        });

        if (!conv) {
          conv = await Conversation.create({
            type: "direct",
            participants: [senderId, partnerId],
            // Optionally: Set the name/avatar for the *conversation* itself if needed
          });
        }
        conversationId = (conv._id as mongoose.Types.ObjectId).toString();
      }

      if (!conversationId) {
        throw new Error("Conversation not found or receiver missing");
      }

      // 2. Create the new Message document (💡 Updated to include new fields)
      const newMessage = await Message.create({
        conversationId: conversationId, // Use conversationId as per Message model
        senderId: senderId, // Use senderId as per Message model
        // 🔑 Use the cached values sent from client (Client uses AuthContext for this)
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        content: data.content,
        type: data.type, // 💡 New: Set message type
        replyToId: data.replyTo, // Use replyToId as per Message model
        readBy: [new mongoose.Types.ObjectId(senderId)], // ReadBy should use ObjectId
        isEdited: false,
        deliveryStatus: "sent", // Set initial delivery status
      });

      // 3. Update Conversation's lastMessage
      const updatedConv = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: newMessage._id,
          updatedAt: new Date(),
        },
        { new: true } // Return the updated conversation
      );

      // 4. Prepare message for broadcast (No need to populate, sender info is cached)
      // We can directly use the data from the newly created document
      const baseMsgObj: MessageItem = {
        id: (newMessage._id as mongoose.Types.ObjectId).toString(),
        conversationId: conversationId,
        senderId: newMessage.senderId?.toString() || "",
        senderName: newMessage.senderName || "",
        senderAvatar: newMessage.senderAvatar || "",
        content: newMessage.content as DraftMessage,
        type: newMessage.type, // 💡 New
        updatedAt: newMessage.createdAt.toISOString(),
        status: "sent", // Server confirmation status
        // NOTE: role is not on the Message model, so it can be omitted or added if required
        replyToId: newMessage.replyToId?.toString(),
        isEdited: newMessage.isEdited ?? false,
      };

      // 5. Get participants and calculate unread count for ChatList Update
      const participants = updatedConv?.participants.map(p => p.toString()) || [];

      // NOTE: This unread count calculation is inefficient for every message. 
      // For production, consider incrementing a counter or using a separate model/query.
      const allMessages = await Message.find({ conversationId: conversationId }) // Use conversationId
        .select("_id readBy")
        .lean();

      // 6. Broadcast the message and chat list update
      for (const userId of participants) {
        const sockets = userSockets.get(userId.toString());
          
        const unreadCount = allMessages.filter(
          (msg) => !msg.readBy.map(String).includes(userId.toString())
        ).length;

        const chatListUpdate = {
          conversationId,
          unreadCount,
          lastMessage: {
            id: baseMsgObj.id, // Use 'id' instead of '_id' for client
            content: baseMsgObj.content,
            createdAt: baseMsgObj.updatedAt,
            sender: {
              id: baseMsgObj.senderId, // Use 'id'
              name: baseMsgObj.senderName,
              avatar: baseMsgObj.senderAvatar || "",
            },
          },
        };

        sockets?.forEach((sId) => {
          if (userId.toString() === data.sender) {
            // Sender: Confirm message and update list
            io.to(sId).emit("newMessage", { ...baseMsgObj, tempId: data.tempId }); // Confirm and replace optimistic
            io.to(sId).emit("chatListUpdate", chatListUpdate);
          } else {
            // Receiver: New message and update list
            io.to(sId).emit("newMessage", baseMsgObj);
            io.to(sId).emit("chatListUpdate", chatListUpdate);
          }
        });
      }

    } catch (err) {
      console.error("sendMessage error:", err);
      // Send error back to the sender
      socket.emit("sendMessageError", { 
        tempId: data.tempId, 
        message: "Failed to send message" 
      });
    }
  });
};