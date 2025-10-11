"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const User_1 = __importDefault(require("@/models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Register user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username, email, and password",
            });
        }
        // TODO: Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // TODO: Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // TODO: Create user in database
        await User_1.default.create({
            username,
            email,
            password: hashedPassword,
        });
        // For now, return success response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.register = register;
