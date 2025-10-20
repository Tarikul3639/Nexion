// src/services/mapConversations.ts

import Message from "@/models/Message/Message";
import { IUser } from "@/models/User";
import { getAvatarUrl } from "@/hooks/useAvatar";
import { ISearchResult, ILastMessage } from "../types"; // Assuming types/chat includes ILastMessage and ISearchResult
import { FlattenMaps, Types } from "mongoose";
import { IConversation } from "@/models/Conversation";

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

            // --- Count unread messages for the user ---
            const unreadCount = await Message.countDocuments({
                conversation: conv._id,
                readBy: { $ne: userId },
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
                isPinned: conv.isPinned ?? false,
                updatedAt: conv.updatedAt,
                unreadCount,
                lastMessage,
            };

            // 🔹 IMPORTANT: Handle direct chat (1-to-1) conversation logic
            if (conv.type === "direct") {
                const partner = conv.participants.find(
                    (p) => p._id.toString() !== userId
                ) as (IUser & { tracking: any; privacy: any }) | undefined;

                if (partner) {
                    // --- Override name and avatar with partner info ---
                    result.name = partner.name || "Nexion User";
                    result.avatar = partner.avatar || getAvatarUrl("user");

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
                    // 🔹 IMPORTANT: Handle deleted or missing user
                    result.name = "Nexion User";
                    result.avatar = getAvatarUrl("nexion-user");
                }
            }
            // 🔹 Handle group/classroom conversation logic
            else {
                // --- Use participant names as fallback group name ---
                if (!result.name) {
                    result.name = conv.participants
                        .filter((p) => p._id.toString() !== userId)
                        //INFO: If 'p' contains a 'name' field (meaning it has been populated), then we will use its name
                        .map((p) => "name" in p ? p.name : "Nexion User")
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