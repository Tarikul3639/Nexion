import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message";
import { User } from "../types";
import { socketEvents } from "../constants/socket";
import config from "config";

interface chatSocket extends Socket {
  user?: { id: string };
}

export const configureSockets = (io: Server) => {
  // Middleware for authentication
  io.use((socket: chatSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
    
    if (!token) {
      console.log("❌ No token provided");
      return next(new Error("Authentication error"));
    }

    try {
      const payload = jwt.verify(token, config.get("jwt.secretKey")) as {
        id: string;
      };
      socket.user = { id: payload.id };
      next();
    } catch (error) {
      console.log("❌ Invalid token");
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (Socket: chatSocket) => {
    console.log("✅ New client connected:", Socket.id);
    console.log("✅ User authenticated:", Socket.user?.id);

    // Join user's personal room
    if (Socket.user) {
      Socket.join(`user-${Socket.user.id}`);
    }

    // Join conversation room
    Socket.on(socketEvents.CONVERSATION_JOIN, (conversationId: string) => {
      if (!Socket.user) {
        console.log("❌ User not authenticated");
        return;
      }
      Socket.join(`conversation-${conversationId}`);
      console.log(`✅ User ${Socket.user.id} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    Socket.on(socketEvents.CONVERSATION_LEAVE, (conversationId: string) => {
      if (!Socket.user) {
        console.log("❌ User not authenticated");
        return;
      }
      Socket.leave(`conversation-${conversationId}`);
      console.log(`✅ User ${Socket.user.id} left conversation ${conversationId}`);
    });

    // Send message
    Socket.on(socketEvents.MESSAGE_SEND, async (data) => {
      if (!Socket.user) {
        console.log("❌ User not authenticated");
        return;
      }

      const { conversationId, content, type } = data;

      try {
        // Save message to database
        const message = new Message({
          conversation: conversationId,
          sender: Socket.user.id,
          content,
          type: type || "text",
        });
        await message.save();

        // Populate the message with sender details
        await message.populate('sender', 'name email avatar');

        // Emit message to conversation room
        Socket.to(`conversation-${conversationId}`).emit(
          socketEvents.MESSAGE_RECEIVE,
          message
        );

        // Also emit to sender to confirm message was sent
        Socket.emit(socketEvents.MESSAGE_RECEIVE, message);
      } catch (error) {
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
