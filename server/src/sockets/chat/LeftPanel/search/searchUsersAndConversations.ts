import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import { searchConversations } from "./searchConversations";
import { mapConversations } from "./mapConversations";
import { mapPotentialUsers } from "./mapPotentialUsers";
import { ISearchResult } from "../types";

/**
 * Handles user search requests over WebSocket.
 * Merges existing conversations (including direct chats) and potential new users.
 */
export const searchUsersAndConversations = (io: Server, socket: AuthenticatedSocket) => {
    socket.on(
        "search_user_and_conversations",
        async ({ search }: { search: string }) => {
            try {
                if (!search || search.trim().length < 2) {
                    socket.emit("search_user_and_conversations_results", []);
                    return;
                }
                if (!socket.user) {
                    socket.emit("searchError", "Unauthorized");
                    return;
                }

                const currentUserId = socket.user._id;

                // Step 1 & 2: Search Conversations and collect existing partners
                const { conversationResults, existingDirectPartners } = await searchConversations(currentUserId, search);

                // Collects the IDs of all users who are currently in a direct (1-to-1) conversation with the current user.
                const excludedUserIds = new Set<string>([
                    // 1. Exclude the current user (you shouldn't see yourself in the user search results)
                    currentUserId,
                    // 2. Exclude all users who are already direct chat partners 
                    // (since their conversation is already included in the search results)
                    ...existingDirectPartners,
                ]);

                // Step 3: Map Conversations (includes Privacy Logic and Unread Count)
                const mappedConversations = await mapConversations(conversationResults, currentUserId);

                // Step 4 & 5: Search and Map Potential New Users (includes Privacy Logic)
                const mappedUsers = await mapPotentialUsers(currentUserId, excludedUserIds, search);

                // Step 6: Merge and Final Emitter
                const results: ISearchResult[] = [...mappedConversations, ...mappedUsers];

                socket.emit("search_user_and_conversations_results", results);
            } catch (err) {
                console.error("Search error:", err);
                socket.emit("searchError", "Failed to search");
            }
        }
    );
};