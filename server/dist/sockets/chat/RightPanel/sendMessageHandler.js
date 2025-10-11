"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageHandler = void 0;
const Conversation_1 = __importDefault(require("@/models/Conversation"));
const Message_1 = __importDefault(require("@/models/Message"));
const sendMessageHandler = (io, socket, userSockets) => {
    socket.on("sendMessage", async (data) => {
        try {
            let conversationId = data.conversation;
            let conv = null;
            if (!conversationId && data.receiverId) {
                conv = await Conversation_1.default.findOne({
                    type: "direct",
                    participants: { $all: [data.sender, data.receiverId] },
                });
                if (!conv) {
                    conv = await Conversation_1.default.create({
                        type: "direct",
                        participants: [data.sender, data.receiverId],
                    });
                }
                conversationId = conv._id.toString();
            }
            if (!conversationId) {
                throw new Error("Conversation not found or receiver missing");
            }
            const newMessage = await Message_1.default.create({
                conversation: conversationId,
                sender: data.sender,
                content: data.content,
                replyTo: data.replyTo,
                readBy: [data.sender],
                isEdited: false,
            });
            await Conversation_1.default.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage._id,
                updatedAt: new Date(),
            });
            const populated = await newMessage.populate("sender", "username avatar role");
            const baseMsgObj = {
                id: newMessage._id.toString(),
                conversationId: conversationId,
                senderId: populated.sender._id.toString(),
                senderName: populated.sender.username,
                senderAvatar: populated.sender.avatar || "",
                content: populated.content,
                updatedAt: populated.createdAt.toISOString(),
                status: "sent",
                role: populated.sender.role,
                replyToId: populated.replyTo?.toString(),
                isEdited: populated.isEdited ?? false,
            };
            const senderMsgObj = {
                ...baseMsgObj,
                tempId: data.tempId,
            };
            const allMessages = await Message_1.default.find({ conversation: conversationId })
                .select("_id readBy")
                .lean();
            const conversation = await Conversation_1.default.findById(conversationId).lean();
            if (conversation?.participants) {
                for (const userId of conversation.participants) {
                    const sockets = userSockets.get(userId.toString());
                    const unreadCount = allMessages.filter((msg) => !msg.readBy.map(String).includes(userId.toString())).length;
                    const chatListUpdate = {
                        conversationId,
                        unreadCount,
                        lastMessage: {
                            _id: baseMsgObj.id,
                            content: baseMsgObj.content,
                            createdAt: baseMsgObj.updatedAt,
                            sender: {
                                _id: baseMsgObj.senderId,
                                username: baseMsgObj.senderName,
                                avatar: baseMsgObj.senderAvatar || "",
                            },
                        },
                    };
                    sockets?.forEach((sId) => {
                        if (userId.toString() === data.sender) {
                            io.to(sId).emit("newMessage", senderMsgObj);
                            io.to(sId).emit("chatListUpdate", chatListUpdate);
                        }
                        else {
                            io.to(sId).emit("newMessage", baseMsgObj);
                            io.to(sId).emit("chatListUpdate", chatListUpdate);
                        }
                    });
                }
            }
        }
        catch (err) {
            console.error("sendMessage error:", err);
            socket.emit("sendMessageError", "Failed to send message");
        }
    });
};
exports.sendMessageHandler = sendMessageHandler;
