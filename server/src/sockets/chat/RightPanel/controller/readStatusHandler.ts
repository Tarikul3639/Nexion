// src/sockets/handlers/readStatusHandler.ts

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import Conversation from "@/models/Conversation";

/**
 * Socket.IO handler for managing read status in conversations.
 * Listens for 'conversation:read' events and updates the database accordingly.
 *
 * @param io - The main Socket.IO server instance.
 * @param socket - The currently connected authenticated socket.
 * @param userSockets - A map that tracks user IDs and their active socket IDs.
 */
export const handleReadStatus = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  /**
   * EVENT NAME: 'conversation:read'
   * This event is triggered when a user views a conversation (marks it as read).
   */
  socket.on(
    "conversation:read",
    async ({ conversationId }: { conversationId: string }) => {
      try {
        // Validate user authentication and input
        if (!socket.user || !conversationId) return;

        const currentUserId = socket.user._id;
        const now = new Date();

        console.log(
          "Read status update -> ID:",
          currentUserId,
          "| Name:",
          socket.user.name
        );

        /**
         * STEP 1: Update Database
         * Update the user's 'lastViewed' timestamp for the specific conversation.
         * Ensures only the participant's own record is modified.
         */
        await Conversation.updateOne(
          {
            _id: conversationId,
            "participants.user": currentUserId, // Ensures user is a participant
          },
          {
            // Use array filter to update only the matching participant entry
            $set: {
              "participants.$.lastViewed": now,
            },
          }
        );

        /**
         * STEP 2: Optional Broadcast
         * Notify other participants in the conversation that this user has read the chat.
         * Useful for showing "Seen by..." or "Read at..." in real-time.
         */
        socket.to(conversationId).emit("conversation:marked_read", {
          conversationId,
          readerId: currentUserId,
          readAt: now.toISOString(),
        });
      } catch (error) {
        console.error("Error updating lastViewed:", error);
      }
    }
  );
};
