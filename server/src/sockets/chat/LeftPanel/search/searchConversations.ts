import User from "@/models/User";
import Conversation, { IConversation } from "@/models/Conversation";
import mongoose, { FlattenMaps, Types } from "mongoose";
/**
 * Searches for existing conversations (Groups and Direct Chats with matched partners).
 * Also identifies all current direct chat partners to exclude them later.
 */
interface SearchConversationResult {
    conversationResults: FlattenMaps<IConversation>[];
    existingDirectPartners: Set<string>;
}

export const searchConversations = async (currentUserId: string, search: string): Promise<SearchConversationResult> => {

    // (Matched Users logic remains the same)
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

    // 1. **FIRST QUERY: Get ALL Direct Chat Partners for Exclusion**
    // Find all 'direct' conversations where the current user is a participant.
    const allDirectConversations = await Conversation.find({
        type: "direct",
        'participants.user': currentUserId,
    })
    .select("participants")
    .lean();
    
    // IMPORTANT: Collect IDs of existing direct chat 'Partners' (ALL of them, not just matched)
    const existingDirectPartners = new Set<string>();
    allDirectConversations.forEach((conv) => {
        const partnerSetting = (conv.participants as any[]).find(
            (p: any) => p.user.toString() !== currentUserId
        );
        // p.user is an ObjectId here because it was not populated
        if (partnerSetting && partnerSetting.user) { 
            existingDirectPartners.add(partnerSetting.user.toString()); 
        }
    });

    // 2. **SECOND QUERY: Get SEARCH Conversation Results**
    // (This query is only for the results list, not the exclusion set)
    const conversationQuery = {
        'participants.user': currentUserId,
        $or: [
            // Group/Classroom search by name (already correct)
            {
                type: { $in: ["group", "classroom"] },
                name: { $regex: search, $options: "i" }
            },
            // Direct chat where the partner's ID is one of the matched users (already correct)
            { type: "direct", 'participants.user': { $in: matchedUserIds } },
        ],
    };

    const conversationResults: FlattenMaps<IConversation>[] = await Conversation.find(conversationQuery)
        // ... (Populate logic remains the same and is correct)
        .populate({
            path: "lastMessage",
            select: "content type senderId senderName senderAvatar createdAt",
            populate: {
                path: "senderId", 
                select: "name avatar username",
            },
        })
        .populate({
            path: "participants.user",
            select: "name username avatar tracking.status tracking.lastActiveAt privacy.showStatus privacy.showLastSeen",
        })
        .select("name type lastMessage participants updatedAt avatar isPinned")
        .sort({ updatedAt: -1 })
        .limit(20)
        .lean();

    return { conversationResults, existingDirectPartners };
};