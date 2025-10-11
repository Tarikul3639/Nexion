"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessageHandler = void 0;
const Message_1 = __importDefault(require("@/models/Message"));
const deleteMessageHandler = (socket) => {
    socket.on("deleteMessage", async ({ messageId }) => {
        try {
            const msg = await Message_1.default.findById(messageId);
            if (!msg)
                throw new Error("Message not found");
            await Message_1.default.deleteOne({ _id: messageId });
            socket.emit("messageDeleted", { messageId });
        }
        catch (err) {
            console.error("deleteMessage error:", err);
            socket.emit("deleteMessageError", "Failed to delete message");
        }
    });
};
exports.deleteMessageHandler = deleteMessageHandler;
