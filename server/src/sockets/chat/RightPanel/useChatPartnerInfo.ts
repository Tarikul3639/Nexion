// server/src/sockets/chat/chatTargetInfoHandler.ts 

import { Server, Socket } from 'socket.io';
// Assuming your Mongoose models
import User from '@/models/User';
import Conversation from '@/models/Conversation';
import { AuthenticatedSocket } from '@/types/chat';
import { getAvatarUrl } from '@/hooks/useAvatar';
import e from 'express';

// Interface for the data sent back to the client (Chat Target Info)
interface IChatTargetInfo {
    id: string; // The User ID of the chat partner/target
    name: string;
    avatar?: string;
    status: string; // e.g., 'online', 'offline'
}

// Interface for the data received from the client
interface IConversationTarget {
    id: string; // This can be a User ID or a Conversation ID
    type: "conversation" | "user"; // Indicates what the 'id' represents
}

// The main handler function
export const chatPartnerInfoHandler = (io: Server, socket: AuthenticatedSocket) => {
    // Assuming 'socket.userId' is set by an authentication middleware
    const currentUserId = socket.user?._id.toString();

    // Debug log
    // console.log("User ID from Socket: ", currentUserId);

    // Listening for the request to fetch partner info
    socket.on('fetch_conversation_partner_info', async ({ selectedConversation }: { selectedConversation: IConversationTarget | null }) => {

        // Debug log
        console.log('Received request for conversation partner info:', selectedConversation);

        // Event names for results and errors
        const RESULT_EVENT = 'conversation_partner_info_result';
        const ERROR_EVENT = 'conversation_partner_info_error';
        
        try {
            // 1. Input Validation: Check if target data or current user ID is missing
            if (!selectedConversation || !currentUserId) {
                // Return null immediately if no target is selected
                socket.emit(RESULT_EVENT, null);
                return;
            }

            const { id, type } = selectedConversation;
            let targetUserInfo: IChatTargetInfo | null = null;

            // --- Helper to create a deleted user object ---
            const createDeletedPartnerInfo = (deletedPartnerId: string): IChatTargetInfo => ({
                id: deletedPartnerId,
                name: "Deleted User", 
                avatar: getAvatarUrl('deleted-user'),
                status: 'deleted',
            })
            
            // 2. Logic Flow: Query the database based on the received 'type'

            if (type === 'user') {
                // 2A. 'user' type: Fetching info for a new user (target ID is User ID)
                
                // Find the user, selecting only necessary fields
                const user = await User.findById(id, 'name avatar status').lean(); 
                
                if (user) {
                    targetUserInfo = {
                        id: user._id.toString(),
                        name: user.name,
                        avatar: user.avatar,
                        status: user.status || 'offline',
                    };
                }else {
                    // 🔥 If User.findById returns null (due to soft delete filter or not found)
                    targetUserInfo = createDeletedPartnerInfo(id);
                }
                
            } else if (type === 'conversation') {
                // 2B. 'conversation' type (Existing Chat)
                
                const conversation = await Conversation.findById(id).lean();

                if (conversation) {
                    if (conversation.type === 'direct') {
                        // 2B.i. Direct Chat Logic (One Partner)
                        const partnerId = conversation.participants.find(
                            (p: any) => p.toString() !== currentUserId
                        );
                        
                        if (partnerId) {    
                            const partner = await User.findById(partnerId, 'name avatar status').lean(); 
                            
                            if (partner) {
                                // Partner found and active
                                targetUserInfo = {
                                    id: partner._id.toString(),
                                    name: partner.name,
                                    avatar: partner.avatar,
                                    status: partner.status || 'offline',
                                };
                            } else {
                                // 🔥 Partner not found (Soft Deleted)
                                targetUserInfo = createDeletedPartnerInfo(partnerId.toString());
                            }
                        }else {
                            // Edge case: No partner found in direct chat
                            // 🔥 Partner not found (Soft Deleted)
                            targetUserInfo = createDeletedPartnerInfo(id.toString());
                        }
                    } else {
                        // 2B.ii. Group/Classroom Chat Logic
                        // Target info should be the conversation itself
                        targetUserInfo = {
                            id: conversation._id.toString(),
                            name: conversation.name || 'Group Chat',
                            avatar: conversation.avatar,
                            status: 'group', // Custom status for group chats
                        };
                    }
                }
            }

            // 3. Send Results to Client
            if (targetUserInfo) {
                // Send the successfully fetched target info
                socket.emit(RESULT_EVENT, targetUserInfo);
            } else {
                // Send null if no user/conversation was found
                socket.emit(RESULT_EVENT, null);
            }

        } catch (error) {
            console.error("Error fetching chat target info:", error);
            // 4. Send an error message to the client if an unexpected error occurred
            socket.emit(ERROR_EVENT, 'An unexpected server error occurred.');
        }
    });
};