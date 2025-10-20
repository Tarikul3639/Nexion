// searchConversations.ts

import Conversation, { IConversation } from "@/models/Conversation";
import { FlattenMaps, Types } from "mongoose";

/**
 * Fetches the user's conversations from the database with necessary population.
 * @param userId The ID of the authenticated user.
 * @returns A promise resolving to an array of raw, populated conversation objects.
 */
export const searchConversations = async (
    userId: Types.ObjectId | string
): Promise<FlattenMaps<IConversation>[]> => {
    
    const conversations: FlattenMaps<IConversation>[] = await Conversation.find({ participants: userId })
        // Populate last message details
        .populate({
            path: "lastMessage",
            select: "content type senderId senderName senderAvatar createdAt",
            // Nested population for the sender of the last message
            populate: { path: "senderId", select: "name username avatar" },
        })
        // Populate participants with tracking & privacy info for direct chat logic
        .populate({
            path: "participants",
            select: "name username avatar tracking.status tracking.lastActiveAt privacy.showStatus privacy.showLastSeen", 
        })
        .sort({ updatedAt: -1 })
        .limit(50)
        .lean();

    return conversations;
};