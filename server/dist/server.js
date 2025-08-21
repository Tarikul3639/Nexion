"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const https_1 = require("https");
const socket_io_1 = require("socket.io");
const index_1 = require("./sockets/index");
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const middleware_1 = require("./utils/middleware");
const config_1 = __importDefault(require("config"));
const fs_1 = __importDefault(require("fs"));
const APP = (0, express_1.default)();
const PORT = config_1.default.get("app.port");
const HOST = config_1.default.get("app.host");
const isProduction = process.env.NODE_ENV === "production";
let server;
let protocol = "http";
if (isProduction) {
    // Use HTTPS in production
    const SSL_OPTIONS = {
        key: fs_1.default.readFileSync("ssl/private-key.pem"),
        cert: fs_1.default.readFileSync("ssl/certificate.pem"),
    };
    server = (0, https_1.createServer)(SSL_OPTIONS, APP);
    protocol = "https";
}
else {
    // Use HTTP in development to avoid certificate issues
    server = (0, http_1.createServer)(APP);
    protocol = "http";
}
const io = new socket_io_1.Server(server, {
    cors: {
        origin: config_1.default.get("cors.origin"),
        credentials: true,
        methods: ["GET", "POST"],
    },
});
// Connect to MongoDB
(0, db_1.connectDB)();
// Attach socket handlers
(0, index_1.setupSocket)(io);
// Middleware
const cors_1 = __importDefault(require("cors"));
APP.use(express_1.default.json());
APP.use(express_1.default.urlencoded({ extended: true }));
APP.use(middleware_1.requestLogger); // Log all requests
APP.use((0, cors_1.default)({
    origin: config_1.default.get("cors.origin"),
    credentials: true
}));
// API Routes
APP.use("/api", routes_1.default);
APP.get("/", (req, res) => {
    res.json({
        message: "Welcome to ChatFly API",
        app: config_1.default.get("app.name"),
        version: config_1.default.get("app.version"),
        environment: process.env.NODE_ENV,
        protocol: protocol.toUpperCase(),
    });
});
server.listen(PORT, () => {
    console.log(`${config_1.default.get("app.name")} server running at ${protocol}://${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Protocol: ${protocol.toUpperCase()}`);
    if (!isProduction) {
        console.log("💡 Using HTTP for development. Set NODE_ENV=production for HTTPS.");
    }
});
