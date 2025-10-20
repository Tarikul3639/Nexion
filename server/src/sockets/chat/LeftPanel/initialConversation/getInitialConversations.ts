// src/sockets/handlers/getInitialConversations.ts (Root Handler)

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat"; 
import { searchConversations } from "./searchConversations"; // New Service 1
import { mapConversations } from "./mapConversations";       // New Service 2

/**
 * Socket.IO handler for fetching the initial chat list (recent conversations)
 */
export const getInitialConversations = (io: Server, socket: AuthenticatedSocket) => {
    socket.on("get_initial_conversations", async () => {
        try {
            //  IMPORTANT: Check for user authentication before proceeding
            const userId = socket.user?._id; 
            if (!userId) {
                socket.emit("chatListError", "Unauthorized");
                return;
            }

            // 🔹 1. Fetch raw conversations (Data Access)
            const rawConversations = await searchConversations(userId as string);
            
            // 🔹 2. Transform and map data (Business Logic)
            const AllConversations = await mapConversations(rawConversations, userId as string);

            // 🔹 3. Emit chat list to client
            socket.emit("initial_conversations_results", AllConversations);
        } catch (error) {
            console.error("getChatListHandler error:", error);
            socket.emit("chatListError", "Failed to fetch chat list");
        }
    });
};