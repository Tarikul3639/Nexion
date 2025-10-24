// // src/sockets/handlers/readStatusHandler.ts
// import { Server } from "socket.io";
// import Conversation from "@/models/Conversation";
// import Message from "@/models/Message/Message";
// import { AuthenticatedSocket } from "@/types/chat";
// import mongoose from "mongoose";

// export const readStatusHandler = (
//     io: Server,
//     socket: AuthenticatedSocket,
//     userSockets: Map<string, Set<string>>
// ) => {
//     socket.on("conversation:read", async (data: { conversationId: string }) => {
//         const userId = socket.user?._id.toString(); // The user who read the message
//         const convId = data.conversationId;

//         if (!userId) return;

//         try {
//             // 1. Update the user's lastViewed time in the Conversation document (Marks all as read for chat list)
//             const updatedConv = await Conversation.updateOne(
//                 { _id: convId, "participants.user": userId },
//                 { $set: { "participants.$.lastViewed": new Date() } }
//             );

//             // 2. Mark all UNREAD messages as read by this user
//             await Message.updateMany(
//                 { 
//                     conversationId: convId, 
//                     // Add the user to the readBy array only if they are not already present
//                     readBy: { $ne: new mongoose.Types.ObjectId(userId) } 
//                 },
//                 { $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } }
//             );

//             // 3. Find the last message to broadcast its ID (This message will show the seen tick)
//             const lastMessage = await Message.findOne({ conversationId: convId })
//                 .sort({ createdAt: -1 }) // Get the latest message
//                 .select('_id senderId');

//             if (lastMessage) {
//                 const senderId = lastMessage.senderId?.toString();
                
//                 // 4. Broadcast 'message:read' ONLY to the sender's active devices
//                 const sockets = userSockets.get(senderId);

//                 if (sockets) {
//                     const readPayload = { 
//                         conversationId: convId,
//                         messageId: lastMessage._id.toString(), // The ID of the last message that is now seen
//                         readerId: userId
//                     };
                    
//                     sockets.forEach((sId) => {
//                         // ✅ io.to(sId): Sender's UI will update the 'seen' status on their message.
//                         io.to(sId).emit("message:read", readPayload);
//                     });
//                 }
//             }
            
//             // 5. Broadcast conversation update to everyone (to clear unread count)
//             io.to(convId).emit("conversation:read", { conversationId: convId }); 

//         } catch (error) {
//             console.error("Read status update failed:", error);
//         }
//     });
// };