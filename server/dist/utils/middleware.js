"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.errorHandler = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token required",
            });
        }
        const secret = config_1.default.get("jwt.secret") || "fallback-secret";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
exports.authenticateToken = authenticateToken;
// Middleware for error handling
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
};
exports.errorHandler = errorHandler;
// Middleware for request logging
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
};
exports.requestLogger = requestLogger;
