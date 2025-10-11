"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesHandler = void 0;
const Message_1 = __importDefault(require("@/models/Message"));
const getMessagesHandler = (socket) => {
    socket.on("getMessages", async ({ chatId }) => {
        try {
            const messages = await Message_1.default.find({ conversation: chatId })
                .populate("sender", "username avatar role")
                .populate("readBy", "username avatar")
                .sort({ createdAt: 1 })
                .lean();
            const formatted = messages.map((msg) => ({
                id: msg._id.toString(),
                conversationId: msg.conversation.toString(),
                senderId: msg.sender._id.toString(),
                senderName: msg.sender.username,
                senderAvatar: msg.sender.avatar || "",
                content: msg.content,
                readBy: msg.readBy.map((user) => ({
                    id: user._id.toString(),
                    username: user.username,
                    avatar: user.avatar || "",
                })),
                updatedAt: msg.updatedAt.toISOString(),
                status: msg.status || "sent",
                role: msg.sender.role,
                replyToId: msg.replyTo?.toString(),
                isEdited: msg.isEdited ?? false,
            }));
            socket.emit("messages", formatted);
        }
        catch (err) {
            console.error("getMessages error:", err);
            socket.emit("messagesError", "Failed to fetch messages");
        }
    });
};
exports.getMessagesHandler = getMessagesHandler;
