"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const getChatList_1 = require("./chat/LeftPanel/getChatList");
const searchUsers_1 = require("./chat/LeftPanel/searchUsers");
const RightPanel_1 = require("./chat/RightPanel");
const User_1 = __importDefault(require("@/models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const setupSocket = (io) => {
    // Map to store userId -> set of socketIds
    const userSockets = new Map();
    // Middleware for authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token)
                return next(new Error("Authentication error: No token provided"));
            const key = config_1.default.get("jwt.secret");
            if (!key)
                throw new Error("JWT secret key not found");
            const decoded = jsonwebtoken_1.default.verify(token, key);
            const user = await User_1.default.findById(decoded._id).select("_id email username");
            if (!user)
                return next(new Error("Authentication error: User not found"));
            socket.user = {
                _id: user._id.toString(),
                email: user.email,
                username: user.username,
            };
            next();
        }
        catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.user._id.toString();
        // Add socket to map
        if (!userSockets.has(userId))
            userSockets.set(userId, new Set());
        userSockets.get(userId).add(socket.id);
        User_1.default.findByIdAndUpdate(userId, { status: "online" }).exec();
        io.emit("userStatusUpdate", { userId, status: "online" });
        console.log("✅ New socket connected:", socket.id, "User:", socket.user?.username);
        // Attach handlers
        (0, getChatList_1.getChatListHandler)(io, socket);
        (0, searchUsers_1.searchUsersHandler)(io, socket);
        (0, RightPanel_1.messageHandler)(io, socket, userSockets);
        socket.on("disconnect", () => {
            // Remove socket from map
            userSockets.get(userId)?.delete(socket.id);
            if (userSockets.get(userId)?.size === 0) {
                userSockets.delete(userId);
                User_1.default.findByIdAndUpdate(userId, { status: "offline", lastSeen: new Date() }).exec();
                io.emit("userStatusUpdate", { userId, status: "offline" });
            }
            console.log("❌ Socket disconnected:", socket.id, "User:", socket.user?.username);
        });
    });
};
exports.setupSocket = setupSocket;
