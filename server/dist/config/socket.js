"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSockets = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Message_1 = __importDefault(require("../models/Message"));
const socket_1 = require("../constants/socket");
const config_1 = __importDefault(require("config"));
const configureSockets = (io) => {
    // Middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
        if (!token) {
            console.log("❌ No token provided");
            return next(new Error("Authentication error"));
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, config_1.default.get("jwt.secretKey"));
            socket.user = { id: payload.id };
            next();
        }
        catch (error) {
            console.log("❌ Invalid token");
            next(new Error("Authentication error"));
        }
    });
    io.on("connection", (Socket) => {
        console.log("✅ New client connected:", Socket.id);
        console.log("✅ User authenticated:", Socket.user?.id);
        // Join user's personal room
        if (Socket.user) {
            Socket.join(`user-${Socket.user.id}`);
        }
        // Join conversation room
        Socket.on(socket_1.socketEvents.CONVERSATION_JOIN, (conversationId) => {
            if (!Socket.user) {
                console.log("❌ User not authenticated");
                return;
            }
            Socket.join(`conversation-${conversationId}`);
            console.log(`✅ User ${Socket.user.id} joined conversation ${conversationId}`);
        });
        // Leave conversation room
        Socket.on(socket_1.socketEvents.CONVERSATION_LEAVE, (conversationId) => {
            if (!Socket.user) {
                console.log("❌ User not authenticated");
                return;
            }
            Socket.leave(`conversation-${conversationId}`);
            console.log(`✅ User ${Socket.user.id} left conversation ${conversationId}`);
        });
        // Send message
        Socket.on(socket_1.socketEvents.MESSAGE_SEND, async (data) => {
            if (!Socket.user) {
                console.log("❌ User not authenticated");
                return;
            }
            const { conversationId, content, type } = data;
            try {
                // Save message to database
                const message = new Message_1.default({
                    conversation: conversationId,
                    sender: Socket.user.id,
                    content,
                    type: type || "text",
                });
                await message.save();
                // Populate the message with sender details
                await message.populate('sender', 'name email avatar');
                // Emit message to conversation room
                Socket.to(`conversation-${conversationId}`).emit(socket_1.socketEvents.MESSAGE_RECEIVE, message);
                // Also emit to sender to confirm message was sent
                Socket.emit(socket_1.socketEvents.MESSAGE_RECEIVE, message);
            }
            catch (error) {
                console.error("❌ Error saving message:", error);
                Socket.emit("error", { message: "Failed to send message" });
            }
        });
        // Disconnect
        Socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${Socket.id}`);
        });
    });
};
exports.configureSockets = configureSockets;
