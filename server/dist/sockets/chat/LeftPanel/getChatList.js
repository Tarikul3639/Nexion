"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatListHandler = void 0;
const Conversation_1 = __importDefault(require("@/models/Conversation"));
const Message_1 = __importDefault(require("@/models/Message"));
const getChatListHandler = (io, socket) => {
    socket.on("getChatList", async () => {
        try {
            const userId = socket.user?._id;
            if (!userId)
                return;
            const conversations = await Conversation_1.default.find({ participants: userId })
                .populate({
                path: "lastMessage",
                select: "content type sender createdAt isPinned",
                populate: { path: "sender", select: "username avatar" },
            })
                .populate({
                path: "participants",
                select: "username avatar status lastSeen",
            })
                .sort({ updatedAt: -1 })
                .lean();
            const chatList = await Promise.all(conversations.map(async (conv) => {
                const unreadCount = await Message_1.default.countDocuments({
                    conversation: conv._id,
                    readBy: { $ne: userId },
                });
                // --- Generate name dynamically for direct chats ---
                let convName = conv.name;
                if (!convName) {
                    const participants = conv.participants;
                    const other = participants.find((p) => p._id.toString() !== userId);
                    convName = other?.username || "Unknown";
                }
                // --- Generate avatar(s) dynamically ---
                let avatars = [];
                if (conv.avatar) {
                    avatars = [conv.avatar];
                }
                else {
                    const participants = conv.participants;
                    avatars = participants
                        .filter((p) => p._id.toString() !== userId) // self excluded
                        .map((p) => p.avatar || "");
                }
                return {
                    id: conv._id,
                    name: convName,
                    type: conv.type,
                    avatar: avatars,
                    isPinned: conv.isPinned,
                    lastMessage: conv.lastMessage,
                    participants: conv.participants,
                    updatedAt: conv.updatedAt,
                    unreadCount,
                };
            }));
            socket.emit("chatList", chatList);
        }
        catch (error) {
            console.error(error);
            socket.emit("chatListError", "Failed to fetch chat list");
        }
    });
};
exports.getChatListHandler = getChatListHandler;
