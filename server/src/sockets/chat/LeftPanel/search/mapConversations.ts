import Message,{ IMessage} from "@/models/Message/Message";
import { IConversation } from "@/models/Conversation";
import { ISearchResult, ILastMessage } from "../types";
import { FlattenMaps } from "mongoose";
import { getAvatarUrl } from "@/hooks/useAvatar";

/**
 * Maps raw conversation results to frontend-ready format, applying Privacy logic and calculating Unread Count.
 */
export const mapConversations = async (conversationResults: FlattenMaps<IConversation>[], currentUserId: string): Promise<ISearchResult[]> => {

    return Promise.all(
        conversationResults.map(
            async (conv: FlattenMaps<IConversation>): Promise<ISearchResult> => {
                // Count document where self id not exists in readBy array
                const unreadCount = await Message.countDocuments({
                    conversation: conv._id,
                    readBy: { $ne: currentUserId },
                });

                const populatedLastMessage = conv.lastMessage as any;
                
                // Last Message Mapping (Handles nested populate or falls back to cache)
                const lastMessage: ILastMessage | null = populatedLastMessage
                    ? {
                        _id: populatedLastMessage._id.toString(),
                        content: populatedLastMessage.content,
                        type: populatedLastMessage.type,
                        createdAt: populatedLastMessage.createdAt,
                        sender: populatedLastMessage.senderId 
                            ? {
                                _id: populatedLastMessage.senderId._id.toString(),
                                name: populatedLastMessage.senderId.name,
                                avatar: populatedLastMessage.senderId.avatar,
                            }
                            : {
                                // 2. Fallback to Cached Data (for Soft-Deleted/Missing Users)
                                // We use a safe placeholder ID ('deleted' or 'unknown') instead of senderIdBackup
                                // to prevent client access to the deleted user's actual ID.
                                 _id: 'Nexion_' + populatedLastMessage._id.toString(), // Use a unique placeholder ID
                                name: populatedLastMessage.senderName || 'Nexion User',
                                avatar: populatedLastMessage.senderAvatar || getAvatarUrl('nexion_user'),
                            },
                      }
                    : null;
                
                // Final result mapping (using intersection type for the extra partner fields)
                const result: ISearchResult | null = {
                    id: conv._id.toString(),
                    name: conv.name,
                    type: conv.type,
                    avatar: conv.avatar,
                    isPinned: conv.isPinned ?? false,
                    updatedAt: conv.updatedAt,
                    unreadCount: unreadCount,
                    lastMessage: lastMessage,
                    displayType: "conversation",
                };

                if (conv.type === "direct") {
                    const partner = (conv.participants as any[]).find(
                        (p: any) => p._id.toString() !== currentUserId
                    );

                    if (partner) {
                        // Status 'online' | 'offline' | 'away' | 'busy' | string
                        const partnerStatus = partner.tracking?.status;
                        // Privacy Settings status 'true' or 'false'
                        const partnerShowStatus = partner.privacy?.showStatus;
                        // Privacy Settings Last Seen 'true' or 'false'
                        const partnerShowLastSeen = partner.privacy?.showLastSeen;
                        // Last Active Timestamp
                        const partnerLastActiveAt = partner.tracking?.lastActiveAt;

                        // 1. Apply Status Privacy: 'hidden' if status is not to be shown
                        const effectiveStatus = 
                            (partnerShowStatus === false) ? 'hidden' : partnerStatus;

                        // 2. Apply Last Seen Privacy: Show Last Active ONLY if allowed AND not currently online
                        let effectiveLastActiveAt = null;

                        if (partnerShowLastSeen === true && effectiveStatus !== 'online') {
                            effectiveLastActiveAt = partnerLastActiveAt;
                        }

                        result.partnerId = partner._id.toString();
                        result.status = effectiveStatus;
                        result.lastActiveAt = effectiveLastActiveAt; 
                    }

                } 
                return result;
            }
        )
    );
};