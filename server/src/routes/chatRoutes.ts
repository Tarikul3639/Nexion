import { Router } from 'express';   
import { verifyToken } from "@/middleware/verifyToken";
import { getInitialConversations } from '@/sockets/chat/LeftPanel/controller/getInitialConversations';
import { getMessages } from '@/controllers/chat/message';
const router = Router();

// Mount chat routes
router.get("/conversations", verifyToken, getInitialConversations);
router.get("/:conversationId/messages", verifyToken, getMessages);

export default router;
