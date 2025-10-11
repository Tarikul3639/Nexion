"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const User_1 = __importDefault(require("@/models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
// Token verify route
const verifyToken = async (req, res) => {
    try {
        // 1️⃣ Get token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "No token provided" });
        }
        // 2️⃣ Verify JWT signature
        const key = config_1.default.get("jwt.secret");
        if (!key)
            throw new Error("JWT secret key not found");
        const decoded = jsonwebtoken_1.default.verify(token, key);
        // 3️⃣ Optional: check token expiry manually
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        // 4️⃣ Database check by _id + email + username
        const user = await User_1.default.findOne({
            _id: decoded._id,
            email: decoded.email,
        }).select("-password"); // sensitive data exclude
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        }
        // 5️⃣ Optional: token blacklist check
        // const blacklisted = await TokenBlacklist.findOne({ token });
        // if (blacklisted) return res.status(401).json({ success: false, message: "Token revoked" });
        // 6️⃣ Respond with sanitized user data
        res.status(200).json({
            success: true,
            message: "Token is valid",
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar || null,
                },
            },
        });
    }
    catch (error) {
        console.error("Token verification error:", error);
        // 7️⃣ Handle JWT errors specifically
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.verifyToken = verifyToken;
