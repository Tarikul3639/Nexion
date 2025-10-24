// src/sockets/handlers/deliveryStatusHandler.ts (New File)
import { Server } from "socket.io";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message/Message";
import { AuthenticatedSocket } from "@/types/chat";
import mongoose from "mongoose";

// Interface for the data coming from the client (the receiver's device)
interface IDeliverMessageData {
    messageId: string;
    conversationId: string;
}

// 💡 Helper function to find all participant IDs in a conversation
const getConversationParticipants = async (convId: string): Promise<string[]> => {
    const conv = await Conversation.findById(convId).select('participants.user');
    return conv ? conv.participants.map(p => p.user.toString()) : [];
};

export const deliveryStatusHandler = (
    io: Server,
    socket: AuthenticatedSocket,
    userSockets: Map<string, Set<string>> // Map of user ID to active socket IDs
) => {
    // 🔑 I. Event Listener: Recipient confirms receiving the message
    socket.on("message:deliver", async (data: IDeliverMessageData) => {
        const receiverId = socket.user?._id.toString();

        // console.log("Message deliver: ",receiverId);

        if (!receiverId) return; // Must be authenticated

        try {
            // 1. Database Update: Set the message's status to 'delivered'
            const updatedMessage = await Message.findByIdAndUpdate(
                data.messageId,
                // Ensure 'delivered' is a valid status in your Mongoose schema
                { deliveryStatus: "delivered" }, 
                { new: true, select: 'senderId' } // Only select necessary fields
            );

            if (!updatedMessage) {
                console.warn(`Message ID ${data.messageId} not found for delivery update.`);
                return;
            }

            // 2. Broadcast Preparation: Get all users in the conversation
            const participants = await getConversationParticipants(data.conversationId);
            
            // 3. Broadcast Event: Send 'message:delivered' to all participants
            const broadcastPayload = { 
                id: data.messageId, 
                deliveryStatus: "delivered" 
            };

            for (const userId of participants) {
                // We broadcast to everyone, including the sender, so they can update their UI.
                const sockets = userSockets.get(userId);
                sockets?.forEach((sId) => {
                    io.to(sId).emit("message:delivered", broadcastPayload);
                });
            }

        } catch (error) {
            console.error(`Delivery status update failed for msg ${data.messageId}:`, error);
            // Optionally, emit an error back to the sender/receiver
        }
    });
};