// src/controllers/getInitialConversations.ts (UPDATED FOR HAS_MORE)

import { Request, Response } from 'express';
import { searchConversations } from './searchConversations';
import { mapConversations } from './mapConversations';

export const getInitialConversations = async (req: Request, res: Response) => {
    // console.log("calling API for initial conversation");
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required." });
        }

        // --- Pagination Logic ---
        // 🔑 NOTE: Fetch one extra record to detect if there's a next page
        const limit = parseInt(req.query.limit as string) || 20; 
        const fetchLimit = limit + 1; // Fetch one extra
        const page = parseInt(req.query.page as string) || 1; 
        const skip = (page - 1) * limit; 

        // 🔹 1. Fetch raw conversations
        const rawConversations = await searchConversations(userId, fetchLimit, skip); 
        
        // 🔹 2. Determine if there are more pages
        const hasMore = rawConversations.length > limit;
        
        // 🔹 3. Slice the array back to the requested limit before mapping
        const conversationsToMap = rawConversations.slice(0, limit);
        
        // 🔹 4. Transform and map data
        const AllConversations = await mapConversations(conversationsToMap, userId);

        // 🔹 5. Send response to client with pagination info
        return res.status(200).json({
            conversations: AllConversations,
            hasMore: hasMore,
            nextPage: hasMore ? page + 1 : null,
            limit: limit,
        });

    } catch (error) {
        console.error("REST API /api/conversations error:", error);
        return res.status(500).json({ message: "Failed to fetch conversations." });
    }
}