import { Request, Response } from 'express';
import { searchConversations } from './searchConversations';
import { mapConversations } from './mapConversations';


export const getInitialConversations = async (req: Request, res: Response) => {
    console.log("calling API for initial conversation");
    try {
            // IMPORTANT: Get User ID from the request object populated by middleware
            const userId = req.user?.id;
            
            if (!userId) {
                return res.status(401).json({ message: "Authentication required." });
            }

            // --- Pagination Logic ---
            const limit = parseInt(req.query.limit as string) || 20; // Default to 20
            const page = parseInt(req.query.page as string) || 1; 
            const skip = (page - 1) * limit; // Calculate offset

            // 🔹 1. Fetch raw conversations (Service remains the same, but now includes pagination)
            // ⚠️ We need to update searchConversations to accept limit and skip
            const rawConversations = await searchConversations(userId, limit, skip); 
            
            // 🔹 2. Transform and map data (Business Logic remains the same)
            const AllConversations = await mapConversations(rawConversations, userId);

            // 🔹 3. Send response to client
            return res.status(200).json(AllConversations);

        } catch (error) {
            console.error("REST API /api/conversations error:", error);
            return res.status(500).json({ message: "Failed to fetch conversations." });
        }
    }