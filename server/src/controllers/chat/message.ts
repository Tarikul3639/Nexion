// controllers/chat/message.ts (Revised for GET request, params, pagination, and authorization)

import { Request, Response } from "express";
import Message, { IMessage } from "@/models/Message";
import Conversation, { IConversation } from "@/models/Conversation";

// Interface for query parameters (for type safety)
interface GetMessagesQuery {
    limit?: string;
    skip?: string;
}

/**
 * @route GET /api/v1/chats/:conversationId/messages
 * @description Fetches paginated list of messages for a conversation.
 * @access Private (Requires verifyToken)
 */
export const getMessages = async (req: Request<any, any, any, GetMessagesQuery>, res: Response) => {
    // 1. Extract parameters from URL and Query
    const { conversationId } = req.params;
    console.log("Message request from ID: ", conversationId);
    const limit = parseInt(req.query.limit || '50', 10);
    const skip = parseInt(req.query.skip || '0', 10);
    // NOTE: Assuming req.user is populated by verifyToken middleware
    // const userId = req.user.id; 

    try {
        // --- 2. Authorization Check (Crucial for security) ---
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation) {
            // return res.status(404).json({ success: false, message: 'Conversation not found.' });
            return null;
        }
        
        // 🚨 IMPORTANT: In a real app, verify the user is a participant here.
        // Example: 
        /* if (!conversation.participants.includes(userId)) {
             return res.status(403).json({ success: false, message: 'Unauthorized access to conversation.' });
        }
        */

        // --- 3. Fetch Paginated Messages ---
        const messages: IMessage[] = await Message.find({ conversationId })
            .sort({ createdAt: -1 }) // Sort by newest message first (descending)
            .skip(skip)
            .limit(limit)
            // .populate('senderId', 'username avatar'); // Optional: Populate sender details

        // 4. Reverse the order for the frontend (oldest at top for initial load, newest at bottom)
        const orderedMessages = messages.reverse();

        // 5. Check if more messages exist for pagination
        const totalMessages = await Message.countDocuments({ conversationId });
        const hasMore = totalMessages > (skip + limit);
        
        res.status(200).json({ 
            success: true, 
            messages: orderedMessages,
            hasMore,
            total: totalMessages
        });
        
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};