"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const setupSocket = (io) => {
    // Middleware for authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }
            // Secret key
            const key = config_1.default.get("jwt.secret");
            if (!key)
                throw new Error("JWT secret key not found");
            // Verify the token
            const decoded = jsonwebtoken_1.default.verify(token, key);
            // Database check
            const user = await User_1.default.findById(decoded._id).select("_id email username");
            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }
            // Attach user to socket
            socket.user = user;
            next();
        }
        catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });
    io.on("connection", (socket) => {
        console.log("✅ New socket connected:", socket.id, "👤 User:", socket.user?.username);
        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected:", socket.id, "👤 User:", socket.user?.username);
        });
    });
};
exports.setupSocket = setupSocket;
