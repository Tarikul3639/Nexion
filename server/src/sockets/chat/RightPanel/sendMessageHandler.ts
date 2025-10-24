// src/sockets/handlers/sendMessageHandler.ts (FINAL UPDATED)

import { Server } from "socket.io";
import Conversation, { IConversation } from "@/models/Conversation";
import Message from "@/models/Message/Message";
import { AuthenticatedSocket, MessageItem, DraftMessage } from "@/types/chat";
import mongoose from "mongoose";

// 💡 New interface reflecting data passed from client
interface ISendMessageData {
  conversation?: string;
  sender: string;
  partner?: string;
  content: DraftMessage;
  type: MessageItem["type"]; // New: Message type (text, image, etc.)
  senderName: string; // New: Sender name cache
  senderAvatar?: string; // New: Sender avatar cache
  replyTo?: string;
  tempId: string;
}

export const sendMessageHandler = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  socket.on("message:send", async (data: ISendMessageData) => {
    // console.log("Received message: ", data);

    try {
      let conversationId = data.conversation;
      // Use IConversation type for better safety
      let conv:
        | (mongoose.Document<unknown, {}, IConversation> & IConversation)
        | null = null;

      const senderId = socket.user?._id.toString();
      const partnerId = data.partner;

      // --- Security Check ---
      if (senderId !== data.sender) {
        throw new Error("Sender ID does not match authenticated user");
      }

      // 1. Handle new direct conversation creation
      if (!conversationId && partnerId) {
        conv = await Conversation.findOne({
          type: "direct",
          "participants.user": { $all: [senderId, partnerId] }, // Search using the nested field 'participants.user'
        });

        if (!conv) {
          // Create conversation with the new array of objects structure
          conv = await Conversation.create({
            type: "direct",
            participants: [
              { user: senderId, lastViewed: new Date() }, // Initialize lastViewed for sender
              { user: partnerId },
            ],
          });
        }
        conversationId = (conv._id as mongoose.Types.ObjectId).toString();
      }

      // Fetch the conversation if ID exists but the object is missing (e.g., group chat)
      if (conversationId && !conv) {
        conv = await Conversation.findById(conversationId);
      }

      if (!conversationId || !conv) {
        throw new Error("Conversation not found or receiver missing");
      }
      
      // 2. Update the sender's lastViewed time right before sending
      // This ensures the sender's unread count is 0 for this message, without race conditions
      await Conversation.updateOne(
        { _id: conversationId, "participants.user": senderId },
        { $set: { "participants.$.lastViewed": new Date() } }
      );

      // 3. Create the new Message document
      const newMessage = await Message.create({
        conversationId: conversationId,
        senderId: senderId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        content: data.content,
        type: data.type,
        replyToId: data.replyTo,
        readBy: [new mongoose.Types.ObjectId(senderId)],
        isEdited: false,
        deliveryStatus: "sent",
      });

      // 4. Update Conversation's lastMessage
      const updatedConv = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: newMessage._id,
          updatedAt: new Date(),
        },
        { new: true } // Return the updated conversation
      );

      if (!updatedConv) {
        throw new Error("Failed to update conversation.");
      }

      // 5. Prepare message for broadcast
      const baseMsgObj: MessageItem = {
        id: (newMessage._id as mongoose.Types.ObjectId).toString(),
        conversationId: conversationId,
        senderId: newMessage.senderId?.toString() || "",
        senderName: newMessage.senderName || "",
        senderAvatar: newMessage.senderAvatar || "",
        content: newMessage.content as DraftMessage,
        type: newMessage.type,
        updatedAt: newMessage.createdAt.toISOString(),
        status: "sent",
        replyToId: newMessage.replyToId?.toString(),
        isEdited: newMessage.isEdited ?? false,
      };

      // 6. Broadcast the message and chat list update
      // FIX: Map to get the actual user IDs from the nested structure
      const participants = updatedConv.participants.map((p) =>
        p.user.toString()
      );

      for (const userId of participants) {
        const sockets = userSockets.get(userId.toString());

        // FIX: Efficient Unread Count Calculation using 'lastViewed'
        const participantSettings = updatedConv.participants.find(
          (p) => p.user.toString() === userId
        );
        const lastViewedTime = participantSettings?.lastViewed || new Date(0);

        // Count messages created AFTER the user's lastViewed time
        const unreadCount = await Message.countDocuments({
          conversationId: conversationId,
          createdAt: { $gt: lastViewedTime },
          // Exclude messages sent by the user themselves only if the count should be 0 for sender
          senderId: { $ne: new mongoose.Types.ObjectId(userId) },
        });

        const chatListUpdate = {
          conversationId,
          unreadCount,
          updatedAt: baseMsgObj.updatedAt,
          lastMessage: {
            id: baseMsgObj.id,
            content: baseMsgObj.content,
            createdAt: baseMsgObj.updatedAt,
            sender: {
              id: baseMsgObj.senderId,
              name: baseMsgObj.senderName,
              avatar: baseMsgObj.senderAvatar || "",
            },
          },
        };

        sockets?.forEach((sId) => {
          if (userId.toString() === data.sender) {
            // Sender: Confirm message and update list
            io.to(sId).emit("message:confirm", {
              ...baseMsgObj,
              tempId: data.tempId,
            });
            io.to(sId).emit("conversation:update", chatListUpdate);
          } else {
            // Receiver: New message and update list
            io.to(sId).emit("message:new", baseMsgObj);
            io.to(sId).emit("conversation:update", chatListUpdate);
          }
        });
      }
    } catch (err) {
      console.error("sendMessage error:", err);
      // Send error back to the sender
      socket.emit("sendMessageError", {
        tempId: data.tempId,
        message: "Failed to send message",
      });
    }
  });
};