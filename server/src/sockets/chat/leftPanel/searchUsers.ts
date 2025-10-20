// import { Server } from "socket.io";
// import { AuthenticatedSocket } from "@/types/chat"; 
// import User from "@/models/User"; 
// import Conversation, { IConversation } from "@/models/Conversation"; 
// import Message, { IMessage } from "@/models/Message/Message";
// // IConversationResult and ILastMessage must be defined in your types file
// import { IConversationResult, ILastMessage } from "./types"; 

// import mongoose, { FlattenMaps, Types } from "mongoose";

// /**
//  * Handles user search requests over WebSocket.
//  * Merges existing conversations (including direct chats) and potential new users.
//  */
// export const searchUsersHandler = (io: Server, socket: AuthenticatedSocket) => {
//   socket.on(
//     "search_user_and_conversations",
//     async ({ search }: { search: string }) => {
//       console.log("Search value: ", search);
//       try {
//         if (!search || search.trim().length < 2) {
//           socket.emit("search_user_and_conversations_results", []);
//           return;
//         }

//         if (!socket.user) {
//           socket.emit("searchError", "Unauthorized");
//           return;
//         }

//         const currentUserId = socket.user._id; 
//         const currentUserIdStr = currentUserId.toString(); 

//         // --- 1. Search Conversations (Groups + Existing Direct) ---

//         // Get the IDs of all users whose name/username matches the search term
//         const matchedUsers = await User.find({
//           $or: [
//             { name: { $regex: search, $options: "i" } },
//             { username: { $regex: search, $options: "i" } },
//           ],
//           _id: { $ne: currentUserId },
//         })
//           .select("_id")
//           .lean();

//         const matchedUserIds = matchedUsers.map((u) => u._id);

//         const conversationQuery = {
//           participants: currentUserId,
//           $or: [
//             {
//               type: { $in: ["group", "classroom"] },
//               name: { $regex: search, $options: "i" },
//             },
//             { type: "direct", participants: { $in: matchedUserIds } },
//           ],
//         };

//         const conversationResults: FlattenMaps<IConversation>[] =
//           await Conversation.find(conversationQuery)
//             // Nested populate for live sender name (reduces performance but ensures data freshness for last message sender)
//             .populate({
//               path: "lastMessage",
//               // Select cached fields too, for fallback if senderId is null/deleted
//               select: "content type senderId senderName senderAvatar createdAt senderIdBackup",
//               populate: {
//                 path: "senderId", 
//                 select: "name avatar username", // Minimal user fields
//               },
//             })
//             // Populate participants with minimal fields, including necessary privacy/tracking data
//             .populate({
//               path: "participants",
//               select: "name username avatar tracking.status tracking.lastActiveAt privacy.showStatus privacy.showLastSeen",
//             })
//             .select(
//               "name type lastMessage participants updatedAt avatar isPinned"
//             )
//             .sort({ updatedAt: -1 })
//             .limit(20)
//             .lean();

//         // --- 2. Collect IDs of existing direct chat partners (Logic is fine) ---
//         const existingDirectPartners = new Set<string>();
//         const directConversations = conversationResults.filter(
//           (c) => c.type === "direct"
//         );

//         directConversations.forEach((conv) => {
//           // The partner is a populated object, not just an ID in .lean() results
//           const partner = (conv.participants as any[]).find(
//             (p: any) => p._id.toString() !== currentUserIdStr
//           );
//           if (partner) {
//             existingDirectPartners.add(partner._id.toString());
//           }
//         });

//         const excludedUserIds = new Set<string>([
//           currentUserIdStr,
//           ...existingDirectPartners,
//         ]);

//         // --- 3. Map Conversations, apply Privacy, and calculate Unread Count ---
//         const mappedConversations = await Promise.all(
//           conversationResults.map(
//             async (
//               conv: FlattenMaps<IConversation>
//             ): Promise<IConversationResult> => {
//               const unreadCount = await Message.countDocuments({
//                 conversation: conv._id,
//                 readBy: { $ne: currentUserId },
//               });

//               const populatedLastMessage = conv.lastMessage as any;
//               
//               // 🔥 Last Message Mapping (Handles nested populate or falls back to cache)
//               const lastMessage: ILastMessage | null = populatedLastMessage
//                 ? {
//                     _id: populatedLastMessage._id.toString(),
//                     content: populatedLastMessage.content,
//                     type: populatedLastMessage.type,
//                     createdAt: populatedLastMessage.createdAt,
//                     sender: populatedLastMessage.senderId 
//                         ? {
//                             _id: populatedLastMessage.senderId._id.toString(),
//                             name: populatedLastMessage.senderId.name,
//                             avatar: populatedLastMessage.senderId.avatar,
//                         }
//                         : {
//                              // Fallback to cached data (Important for deleted users)
//                              _id: populatedLastMessage.senderIdBackup?.toString() || populatedLastMessage.senderId?.toString() || 'unknown',
//                              name: populatedLastMessage.senderName || 'Unknown User',
//                              avatar: populatedLastMessage.senderAvatar,
//                          },
//                   }
//                 : null;
//             
//             // Final result mapping
//             const result: IConversationResult & { partnerStatus?: string; partnerLastActiveAt?: Date | null } = {
//                 id: conv._id.toString(),
//                 name: conv.name,
//                 type: conv.type,
//                 avatar: conv.avatar,
//                 isPinned: conv.isPinned ?? false,
//                 updatedAt: conv.updatedAt,
//                 unreadCount: unreadCount,
//                 lastMessage: lastMessage,
//                 displayType: "conversation",
//             };

//             if (conv.type === "direct") {
//                 // Find partner (who is a populated User object now)
//                 const partner = (conv.participants as any[]).find(
//                     (p: any) => p._id.toString() !== currentUserIdStr
//                 );

//                 if (partner) {
//                     // Extract data
//                     const partnerStatus = partner.tracking?.status;
//                     const partnerShowStatus = partner.privacy?.showStatus;
//                     const partnerShowLastSeen = partner.privacy?.showLastSeen;
//                     const partnerLastActiveAt = partner.tracking?.lastActiveAt;

//                     // 1. Apply Status Privacy: If partner hides status, set it to 'hidden'
//                     const effectiveStatus = 
//                       (partnerShowStatus === false) ? 'hidden' : partnerStatus;

//                     // 2. Apply Last Seen Privacy: Show Last Active ONLY if: 
//                     //    a) User allows it (partnerShowLastSeen === true) AND 
//                     //    b) Partner is NOT currently online (to avoid showing both 'online' and a timestamp)
//                     let effectiveLastActiveAt = null;

//                     if (partnerShowLastSeen === true && effectiveStatus !== 'online') {
//                         effectiveLastActiveAt = partnerLastActiveAt;
//                     }

//                     result.partnerId = partner._id.toString();
//                     result.partnerStatus = effectiveStatus;
//                     result.partnerLastActiveAt = effectiveLastActiveAt; // Send Date or null
//                 }

//             } 
//             return result;
//             }
//           )
//         );

//         // --- 4. Search Users (Excluding Self and Existing Direct Partners) ---
//         const potentialNewUsers = await User.find({
//           $or: [
//             { name: { $regex: search, $options: "i" } },
//             { username: { $regex: search, $options: "i" } },
//           ],
//           _id: {
//             $nin: Array.from(excludedUserIds).map(
//               (id) => new mongoose.Types.ObjectId(id)
//             ),
//           },
//         })
//           // 🔥 Select minimal user fields + privacy/tracking
//           .select("name username avatar tracking.status privacy.showStatus") 
//           .limit(20)
//           .lean();

//         // --- 5. Map Users (as potential new contacts) ---
//         const mappedUsers = potentialNewUsers.map((user: any) => {
//           const isFriend = !!(
//             user.friends &&
//             user.friends.some(
//               (f: mongoose.Types.ObjectId) => f.toString() === currentUserIdStr
//             )
//           );

//           // 🔥 PRIVACY CHECK for new User (Only show status if allowed)
//           const effectiveStatus = 
//             (user.privacy?.showStatus === false) ? 'hidden' : user.tracking?.status;

//           return {
//             id: user._id.toString(),
//             displayType: "user",
//             name: user.name,
//             username: user.username,
//             avatar: user.avatar,
//             status: effectiveStatus,
//             isFriend: isFriend,
//             type: "direct", 
//             isPinned: false,
//             unreadCount: 0,
//             // LastActiveAt is not sent for new user search results as it's less critical here
//           };
//         });

//         // --- 6. Merge and Final Emitter (Conversations prioritized) ---
//         const results = [...mappedConversations, ...mappedUsers];

//         socket.emit("search_user_and_conversations_results", results);
//       } catch (err) {
//         console.error("Search error:", err);
//         socket.emit("searchError", "Failed to search");
//       }
//     }
//   );
// };