// src/services/searchConversations.ts (UPDATED FOR PAGINATION)

import Conversation, { IConversation } from "@/models/Conversation";
import { FlattenMaps, Types } from "mongoose";

/**
 * Fetches the user's conversations from the database with necessary population.
 * @param userId The ID of the authenticated user.
 * @param limit The maximum number of documents to return.
 * @param skip The number of documents to skip (offset).
 * @returns A promise resolving to an array of raw, populated conversation objects.
 */
export const searchConversations = async (
    userId: Types.ObjectId | string,
    limit: number, // <--- NEW
    skip: number  // <--- NEW
): Promise<FlattenMaps<IConversation>[]> => {
    
    const conversations: FlattenMaps<IConversation>[] = await Conversation.find({ "participants.user": userId })
        // ... (rest of the .populate() calls remain the same)
        .populate({
            path: "lastMessage",
            select: "content type senderId senderName senderAvatar createdAt",
            populate: { path: "senderId", select: "name username avatar" },
        })
        .populate({
            path: "participants.user",
            select: "name username avatar tracking.status tracking.lastActiveAt privacy.showStatus privacy.showLastSeen", 
        })
        .sort({ updatedAt: -1 })
        .skip(skip) // <--- Offset
        .limit(limit) // <--- Limit per page
        
        .lean();

    return conversations;
};