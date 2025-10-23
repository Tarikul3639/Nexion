// src/services/mapConversations.ts

import Message from "@/models/Message/Message";
import { IUser } from "@/models/User";
import { getAvatarUrl } from "@/hooks/useAvatar";
import { ISearchResult, ILastMessage } from "../types"; // Assuming types/chat includes ILastMessage and ISearchResult
import { FlattenMaps, Types } from "mongoose";
import { IConversation, IParticipantSettings } from "@/models/Conversation";

// Helper type for populated participant (from searchConversations)
type PopulatedParticipant = IParticipantSettings & { user: IUser };

/**
 * Transforms raw conversation data into the frontend-friendly ISearchResult format.
 * Applies unread count logic, last message formatting, and privacy rules.
 */
export const mapConversations = async (
    conversations: FlattenMaps<IConversation>[],
    userId: string
): Promise<ISearchResult[]> => {


    // 🔹 2. Transform data into frontend-friendly format (ISearchResult)
    const AllConversations: ISearchResult[] = await Promise.all(
        conversations.map(async (conv) => {

            // Ensure participants is an array of populated user objects
            const participants = conv.participants as PopulatedParticipant[];

            // FIX 1: Get the current user's specific settings from the participants array
            const currentUserSettings = participants.find(
                (p) => p.user._id.toString() === userId // Use p.user._id if populated
            );

            // Safety check for user's settings
            const lastViewed = currentUserSettings?.lastViewed || new Date(0);
            const isPinned = currentUserSettings?.isPinned ?? false;

            // FIX 2: Efficient Unread Count (Count messages created AFTER lastViewed)
            // 2. ✅ EFFICIENT UNREAD COUNT: Count messages created AFTER lastViewed
            const unreadCount = await Message.countDocuments({
                conversationId: conv._id, // Use correct field name: conversationId
                createdAt: { $gt: lastViewed }, // Key optimization!
                senderId: { $ne: userId } // Exclude messages sent by self
            });

            const populatedLastMessage = conv.lastMessage as any;

            // --- Prepare last message with fallback for deleted users ---
            const lastMessage: ILastMessage | null = populatedLastMessage
                ? {
                    _id: populatedLastMessage._id.toString(),
                    content: populatedLastMessage.content,
                    type: populatedLastMessage.type,
                    createdAt: populatedLastMessage.createdAt,
                    sender: populatedLastMessage.senderId
                        ? {
                            // Live sender data (active user)
                            _id: populatedLastMessage.senderId._id.toString(),
                            name: populatedLastMessage.senderId.name,
                            avatar: populatedLastMessage.senderId.avatar,
                        }
                        : {
                            // Fallback sender data (deleted or missing)
                            _id: "Nexion_" + conv._id.toString(),
                            name: populatedLastMessage.senderName || "Nexion User",
                            avatar: populatedLastMessage.senderAvatar || getAvatarUrl("nexion_user"),
                        },
                }
                : null;

            // --- Initialize base result object ---
            let convName = conv.name;
            let convAvatar = conv.avatar || "";
            const displayType: "conversation" | "user" = "conversation";

            const result: ISearchResult | null = {
                id: conv._id.toString(),
                displayType,
                name: convName,
                type: conv.type,
                avatar: convAvatar,
                isPinned: isPinned,
                updatedAt: conv.updatedAt,
                unreadCount,
                lastMessage,
            };

            // 🔹 IMPORTANT: Handle direct chat (1-to-1) conversation logic
            if (conv.type === "direct") {
                // FIX 4: Find partner from the nested 'user' field
                const partnerSetting = participants.find(
                    (p) => p.user._id.toString() !== userId
                );

                const partner = partnerSetting?.user;

                if (partner) {
                    // --- Override name and avatar with partner info ---
                    result.name = partner.name || "Nexion User";
                    result.avatar = partner.avatar || getAvatarUrl("nexion_user");

                    // Extract privacy & tracking information
                    const partnerStatus = partner.tracking?.status;
                    const partnerLastActiveAt = partner.tracking?.lastActiveAt;
                    const partnerShowStatus = partner.privacy?.showStatus;
                    const partnerShowLastSeen = partner.privacy?.showLastSeen;

                    // --- Apply privacy rules ---
                    // Effective status (if user hides status → "hidden")
                    const effectiveStatus =
                        (partnerShowStatus === false) ? "hidden" : partnerStatus || "offline";

                    // Effective last active (show only if allowed and not online)
                    let effectiveLastActiveAt: Date | null = null;
                    if (partnerShowLastSeen === true && effectiveStatus !== "online") {
                        effectiveLastActiveAt = partnerLastActiveAt;
                    }

                    // Assign calculated values
                    result.partnerId = partner._id.toString();
                    result.status = effectiveStatus;
                    result.lastActiveAt = effectiveLastActiveAt;

                } else {
                    // IMPORTANT: Handle deleted or missing user
                    result.name = "Nexion User";
                    result.avatar = getAvatarUrl("nexion-user");
                }
            }
            // Handle group/classroom conversation logic
            else {
                // --- Use participant names as fallback group name ---
                if (!result.name) {
                    result.name = participants
                        .filter((p) => p.user._id.toString() !== userId)
                        // 🔑 FIX 5: Use the nested 'user' object's name
                        .map((p) => p.user.name || "Nexion User")
                        .join(", ");
                }

                // --- Assign default group/classroom avatar ---
                result.avatar = convAvatar || getAvatarUrl(conv._id.toString());
            }

            // Return formatted conversation object
            return result as ISearchResult;
        })
    );

    return AllConversations;
};