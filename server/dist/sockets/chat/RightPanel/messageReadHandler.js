"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageReadHandler = void 0;
const Conversation_1 = __importDefault(require("@/models/Conversation"));
const Message_1 = __importDefault(require("@/models/Message"));
const mongoose_1 = __importDefault(require("mongoose"));
const messageReadHandler = (io, socket, userSockets) => {
    socket.on("messageRead", async ({ messageId, userId }) => {
        try {
            const message = await Message_1.default.findById(messageId);
            if (!message)
                throw new Error("Message not found");
            if (!message.readBy?.includes(new mongoose_1.default.Types.ObjectId(userId))) {
                message.readBy = [
                    ...(message.readBy || []),
                    new mongoose_1.default.Types.ObjectId(userId),
                ];
            }
            message.status = "seen";
            await message.save();
            const conversation = await Conversation_1.default.findById(message.conversation).lean();
            if (conversation?.participants) {
                conversation.participants.forEach((participantId) => {
                    const sockets = userSockets.get(participantId.toString());
                    sockets?.forEach((sId) => {
                        io.to(sId).emit("messageRead", {
                            messageId: messageId,
                            userId: userId,
                            conversationId: conversation._id.toString(),
                        });
                    });
                });
            }
        }
        catch (err) {
            console.error("messageRead error:", err);
            socket.emit("messageReadError", "Failed to mark message as read");
        }
    });
};
exports.messageReadHandler = messageReadHandler;
