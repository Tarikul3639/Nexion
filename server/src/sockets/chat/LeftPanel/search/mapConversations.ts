import Message from "@/models/Message/Message";
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

                // 1. Get current user's settings (for lastViewed and isPinned)
                const currentUserSetting = (conv.participants as any[]).find(
                    (p: any) => p.user._id.toString() === currentUserId // Access nested 'user' ID
                );

                const lastViewed = currentUserSetting?.lastViewed || new Date(0);
                const isPinned = currentUserSetting?.isPinned ?? false;

                // 2. ✅ EFFICIENT UNREAD COUNT: Count messages created AFTER lastViewed
                const unreadCount = await Message.countDocuments({
                    conversationId: conv._id, // Use correct field name: conversationId
                    createdAt: { $gt: lastViewed }, // Key optimization!
                    senderId: { $ne: currentUserId } // Exclude messages sent by self
                });

                const populatedLastMessage = conv.lastMessage as any;
                
                // ... (Last Message Mapping - This block looks okay)
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
                                // Fallback to Cached Data
                                _id: 'Nexion_' + populatedLastMessage._id.toString(),
                                name: populatedLastMessage.senderName || 'Nexion User',
                                avatar: populatedLastMessage.senderAvatar || getAvatarUrl('nexion_user'),
                            },
                      }
                    : null;
                
                let convName = conv.name;
                let convAvatar = conv.avatar;
                
                const result: ISearchResult = {
                    id: conv._id.toString(),
                    name: convName,
                    type: conv.type,
                    avatar: convAvatar,
                    isPinned: isPinned, // Use isPinned from user settings
                    updatedAt: conv.updatedAt,
                    unreadCount: unreadCount,
                    lastMessage: lastMessage,
                    displayType: "conversation",
                };

                if (conv.type === "direct") {
                    // ✅ FIX: Find the partner *setting* object, then access the nested *user* object
                    const partnerSetting = (conv.participants as any[]).find(
                        (p: any) => p.user._id.toString() !== currentUserId
                    );

                    const partner = partnerSetting?.user; // This is the populated User object

                    if (partner) {
                        // ... (Rest of the direct chat logic for name, avatar, privacy, and status)
                        // All partner property accesses must be through the 'partner' object.
                        
                        if(!convName) {
                            result.name = partner.name || "Unknown User";
                        }
                        if(!convAvatar) {
                            result.avatar = partner.avatar || getAvatarUrl('unknown_user');
                        }

                        // NOTE: Privacy Logic Application
                        const partnerStatus = partner.tracking?.status;
                        const partnerShowStatus = partner.privacy?.showStatus;
                        const partnerShowLastSeen = partner.privacy?.showLastSeen;
                        const partnerLastActiveAt = partner.tracking?.lastActiveAt;

                        const effectiveStatus = 
                            (partnerShowStatus === false) ? 'hidden' : partnerStatus;

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