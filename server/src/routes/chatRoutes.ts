import { Router } from 'express';   
import { verifyToken } from "@/middleware/verifyToken";
import { getInitialConversations } from '@/sockets/chat/LeftPanel/controller/getInitialConversations';
const router = Router();

// Mount chat routes
router.get("/conversations", verifyToken, getInitialConversations);
export default router;
