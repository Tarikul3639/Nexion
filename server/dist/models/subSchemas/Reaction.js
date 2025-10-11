"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ReactionSchema = new mongoose_1.Schema({
    emoji: { type: String, required: true },
    count: { type: Number, default: 0 },
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, { _id: false });
