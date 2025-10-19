import { Server } from "socket.io";
import mongoose from "mongoose";
import { AuthenticatedSocket } from "@/types/chat"; // Assuming AuthenticatedSocket is correctly defined
import User from "@/models/User"; // Assuming User is the default export
import Conversation, { IConversation } from "@/models/Conversation"; // Assuming Conversation is the default export
import Message, { IMessage } from "@/models/Message/Message";
import { IConversationResult, ILastMessage } from "./types";

/**
 * Handles user search requests over WebSocket.
 * Merges existing conversations (including direct chats) and potential new users.
 */
export const searchUsersHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("search_user_and_conversations", async ({ search }: { search: string }) => {
    console.log("Search value: ", search);
    try {
      if (!search || search.trim().length < 2) {
        socket.emit("search_user_and_conversations_results", []);
        return;
      }

      if (!socket.user) {
        socket.emit("searchError", "Unauthorized");
        return;
      }

      const currentUserId = socket.user._id; // Assuming user ID is stored here
      const currentUserIdStr = currentUserId.toString(); // ID as string

      // --- 1. Search Conversations (Groups + Existing Direct) ---
      // 💡 Optimization: Only search direct chats where participant's name/username match the search term.
      // MongoDB Aggregation is the ideal solution here, but for simplicity, we first search by name in group and then all users.
      
      // Get the IDs of all users whose name/username matches the search term
      const matchedUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ],
        _id: { $ne: currentUserId },
      }).select("_id").lean();

      const matchedUserIds = matchedUsers.map(u => u._id);
      
      const conversationQuery = {
          participants: currentUserId,
          $or: [
              // 1. Group/Classroom search by name
              { type: { $in: ["group", "classroom"] }, name: { $regex: search, $options: "i" } },
              // 2. Direct chat where the partner's ID is one of the matched users
              { type: "direct", participants: { $in: matchedUserIds } }
          ]
      };

      const conversationResults: IConversation[] = await Conversation.find(conversationQuery)
        .populate({
          path: "lastMessage",
          select: "content type sender createdAt",
          populate: { path: "sender", select: "name username avatar" },
        })
        .select("name type lastMessage participants updatedAt avatar isPinned")
        .sort({ updatedAt: -1 })
        .limit(20)
        .lean() as IConversation[];

      // --- 2. Collect IDs of existing direct chat partners ---
      const existingDirectPartners = new Set<string>();
      const directConversations = conversationResults.filter(c => c.type === "direct");

      directConversations.forEach((conv) => {
        // Find the other participant's ID
        const partner = conv.participants.find((p: mongoose.Types.ObjectId) => p.toString() !== currentUserIdStr);
        if (partner) {
          existingDirectPartners.add(partner.toString());
        }
      });
      
      // Combine all matched users and existing partners to exclude from the final user search
      const excludedUserIds = new Set<string>([currentUserIdStr, ...existingDirectPartners]);
      
      // --- 3. Map Conversations and calculate Unread Count ---
      const mappedConversations = await Promise.all(
        conversationResults.map(async (conv: IConversation): Promise<IConversationResult> => {
          const unreadCount = await Message.countDocuments({
            conversation: conv._id,
            readBy: { $ne: currentUserId },
          });
          
          // 💡 Better structure for Last Message
          const lastMessage: ILastMessage | any =
          conv.lastMessage
            ? {
                _id: conv.lastMessage._id,
                content: (conv.lastMessage as unknown as IMessage).content,
                type: (conv.lastMessage as unknown as IMessage).type,
                createdAt: (conv.lastMessage as unknown as IMessage).createdAt,
                sender: (conv.lastMessage as unknown as IMessage).sender,
              }
            : null;
            console.log("lastMessage:", lastMessage);
                
          //Final result mapping
          const result: IConversationResult = {
            id: conv._id.toString(),
            name: conv.name,
            type: conv.type,
            avatar: conv.avatar,
            isPinned: conv.isPinned ?? false,
            updatedAt: conv.updatedAt,
            unreadCount: unreadCount,
            lastMessage: lastMessage,
            displayType: "conversation", // Default, may be overridden below
          };
          
          if (conv.type === "direct") {
            const partnerId = conv.participants.find((p: mongoose.Types.ObjectId) => p.toString() !== currentUserIdStr)?.toString(); // Find partner ID

            // 💡 Reroute the name/avatar logic to the partner's details on frontend
            result.displayType = "conversation"; // 💡 New field to differentiate from 'user' type
            result.partnerId = partnerId; 
            // result.name remains undefined for direct chat, frontend will fetch partner name
          } else {
             result.displayType = "conversation";
          }
          return result;
        })
      );

      // --- 4. Search Users (Excluding Self and Existing Direct Partners) ---
      const potentialNewUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ],
        _id: {
          $nin: Array.from(excludedUserIds).map(id => new mongoose.Types.ObjectId(id)),
        },
      })
        .select("name username avatar status friends blockedUsers")
        .limit(20)
        .lean();

      // --- 5. Map Users (as potential new contacts) ---
      const mappedUsers = potentialNewUsers.map(user => {
        // Determine relationship status (e.g., if already a friend)
        const isFriend = !!(user.friends && user.friends.some((f: mongoose.Types.ObjectId) => f.toString() === currentUserIdStr));

        return {
          id: user._id.toString(),
          displayType: "user", // 💡 New field for UI logic
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          status: user.status,
          isFriend: isFriend,
          // 💡 Default fields for user results
          type: "direct", // Potential conversation type
          isPinned: false,
          unreadCount: 0,
        };
      });

      // --- 6. Merge and Final Emitter (Conversations prioritized) ---
      const results = [...mappedConversations, ...mappedUsers];

      socket.emit("search_user_and_conversations_results", results);  
    } catch (err) {
      console.error("Search error:", err);
      socket.emit("searchError", "Failed to search");
    }
  });
};