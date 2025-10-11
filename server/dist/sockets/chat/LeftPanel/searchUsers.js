"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersHandler = void 0;
const User_1 = __importDefault(require("@/models/User"));
const Conversation_1 = __importDefault(require("@/models/Conversation"));
const Message_1 = __importDefault(require("@/models/Message"));
const searchUsersHandler = (io, socket) => {
    socket.on("search", async ({ search }) => {
        try {
            if (!search || search.trim().length === 0) {
                socket.emit("searchResults", []);
                return;
            }
            if (!socket.user) {
                socket.emit("searchError", "Unauthorized");
                return;
            }
            const currentUserId = socket.user._id.toString();
            // ---- Search Conversations (groups + existing direct) ----
            const conversationResults = await Conversation_1.default.find({
                name: { $regex: search, $options: "i" },
                participants: currentUserId,
            })
                .populate({
                path: "lastMessage",
                select: "content type sender createdAt isPinned",
                populate: { path: "sender", select: "username avatar" },
            })
                .populate("participants", "username avatar status lastSeen")
                .sort({ updatedAt: -1 })
                .lean();
            const mappedConversations = await Promise.all(conversationResults.map(async (conv) => {
                const unreadCount = await Message_1.default.countDocuments({
                    conversation: conv._id,
                    readBy: { $ne: currentUserId },
                });
                return {
                    id: conv._id,
                    name: conv.name,
                    type: conv.type,
                    avatar: conv.avatar,
                    isPinned: conv.isPinned,
                    lastMessage: conv.lastMessage,
                    participants: conv.participants,
                    updatedAt: conv.updatedAt,
                    unreadCount,
                };
            }));
            // ---- Collect userIds from direct conversations to avoid duplicates ----
            const directConversations = conversationResults.filter(c => c.type === "direct");
            const directUserIds = new Set();
            directConversations.forEach(conv => {
                conv.participants.forEach((p) => {
                    directUserIds.add(p._id.toString());
                });
            });
            // ---- Search Users ----
            const userResults = await User_1.default.find({
                username: { $regex: search, $options: "i" },
                _id: { $nin: Array.from(directUserIds) }, // exclude existing direct users + self if needed
            }).select("username avatar status");
            const mappedUsers = userResults.map(user => ({
                id: user._id.toString(),
                type: "user",
                name: user.username,
                avatar: user.avatar,
                status: user.status,
            }));
            // ---- Merge Users + Conversations ----
            const results = [...mappedUsers, ...mappedConversations];
            socket.emit("searchResults", results);
        }
        catch (err) {
            console.error("Search error:", err);
            socket.emit("searchError", "Failed to search");
        }
    });
};
exports.searchUsersHandler = searchUsersHandler;
