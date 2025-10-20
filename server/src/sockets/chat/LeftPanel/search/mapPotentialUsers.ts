import User from "@/models/User";
import { ISearchResult } from "../types";
import { Types } from "mongoose";

/**
 * Searches for potential new users (excluding self and existing partners)
 * and maps them, applying Privacy logic.
 */
export const mapPotentialUsers = async (currentUserIdStr: string, excludedUserIds: Set<string>, search: string): Promise<ISearchResult[]> => {
    
    // Convert Set<string> to Array<ObjectId> for MongoDB $nin query
    const excludedObjectIds = Array.from(excludedUserIds).map(
        (id) => new Types.ObjectId(id)
    );

    const potentialNewUsers = await User.find({
        $or: [
            { name: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
        ],
        _id: { $nin: excludedObjectIds },
    })
    // Select minimal user fields + privacy/tracking
    .select("name username avatar social.friends tracking.status privacy.showStatus") 
    .limit(20)
    .lean();

    // Map Users
    const mappedUsers = potentialNewUsers.map((user: any): ISearchResult => {
        // Determine relationship status (assuming friends array is under user.social.friends)
        const isFriend = !!(
            user.social?.friends &&
            user.social.friends.some(
                (f: Types.ObjectId) => f.toString() === currentUserIdStr
            )
        );

        // PRIVACY CHECK: Only show status if allowed
        const effectiveStatus = 
            (user.privacy?.showStatus === false) ? 'hidden' : user.tracking?.status;

        return {
            id: user._id.toString(),
            displayType: "user",
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            status: effectiveStatus,
            isFriend: isFriend,
            type: "direct", 
            isPinned: false,
            updatedAt: user.updatedAt,
            unreadCount: 0,
            lastMessage: null,
            // partnerId, partnerStatus, partnerLastActiveAt are not applicable for a 'user' result
        };
    });

    return mappedUsers;
};