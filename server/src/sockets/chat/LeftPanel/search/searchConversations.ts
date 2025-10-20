import User from "@/models/User";
import Conversation, { IConversation } from "@/models/Conversation";
import mongoose, { FlattenMaps, Types } from "mongoose";

interface SearchConversationResult {
    conversationResults: FlattenMaps<IConversation>[];
    existingDirectPartners: Set<string>;
}

/**
 * Searches for existing conversations (Groups and Direct Chats with matched partners).
 * Also identifies all current direct chat partners to exclude them later.
 */
export const searchConversations = async (currentUserId: string, search: string): Promise<SearchConversationResult> => {

    // Get the IDs of all users whose name/username matches the search term
    const matchedUsers = await User.find({
        $or: [
            { name: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
        ],
        _id: { $ne: currentUserId },
    })
    .select("_id")
    .lean();

    const matchedUserIds = matchedUsers.map((u) => u._id);

    const conversationQuery = {
        participants: currentUserId,
        $or: [
            // 1. Group/Classroom search by name
            {
                type: { $in: ["group", "classroom"] },
                name: { $regex: search, $options: "i" }
            },
            // 2. Direct chat where the partner's ID is one of the matched users
            { type: "direct", participants: { $in: matchedUserIds } },
        ],
    };

    const conversationResults: FlattenMaps<IConversation>[] = await Conversation.find(conversationQuery)
        // Nested populate for live sender name
        .populate({
            path: "lastMessage",
            select: "content type senderId senderName senderAvatar createdAt",
            populate: {
                path: "senderId", 
                select: "name avatar username",
            },
        })
        // Populate participants with privacy/tracking data
        .populate({
            path: "participants",
            select: "name username avatar tracking.status tracking.lastActiveAt privacy.showStatus privacy.showLastSeen",
        })
        .select("name type lastMessage participants updatedAt avatar isPinned")
        .sort({ updatedAt: -1 })
        .limit(20)
        .lean();

    // IMPORTANT: Collect IDs of existing direct chat 'Partners'
    const existingDirectPartners = new Set<string>();
    conversationResults
        .filter((c) => c.type === "direct")
        .forEach((conv) => {
            const partner = (conv.participants as any[]).find(
                (p: any) => p._id.toString() !== currentUserId
            );
            if (partner) {
                existingDirectPartners.add(partner._id.toString()); // Store as string for easy comparison
            }
        });

    return { conversationResults, existingDirectPartners };
};