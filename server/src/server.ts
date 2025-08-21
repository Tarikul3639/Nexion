import express, { Request, Response } from "express";
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import { Server } from "socket.io";
import { setupSocket } from "./sockets/index";
import { connectDB } from "./config/db";
import routes from "./routes";
import { requestLogger } from "./utils/middleware";
import config from "config";
import fs from "fs";

const APP = express();
const PORT = config.get("app.port");
const HOST = config.get("app.host");
const isProduction = process.env.NODE_ENV === "production";

let server;
let protocol = "http";

if (isProduction) {
  // Use HTTPS in production
  const SSL_OPTIONS = {
    key: fs.readFileSync("ssl/private-key.pem"),
    cert: fs.readFileSync("ssl/certificate.pem"),
  };
  server = createHttpsServer(SSL_OPTIONS, APP);
  protocol = "https";
} else {
  // Use HTTP in development to avoid certificate issues
  server = createHttpServer(APP);
  protocol = "http";
}

const io = new Server(server, {
  cors: {
    origin: config.get("cors.origin"),
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Attach socket handlers
setupSocket(io);

// Middleware

import cors from "cors";
APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));
APP.use(requestLogger); // Log all requests
APP.use(cors({
  origin: config.get("cors.origin"),
  credentials: true
}));

// API Routes
APP.use("/api", routes);

APP.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to ChatFly API",
    app: config.get("app.name"),
    version: config.get("app.version"),
    environment: process.env.NODE_ENV,
    protocol: protocol.toUpperCase(),
  });
});

server.listen(PORT, () => {
  console.log(
    `${config.get("app.name")} server running at ${protocol}://${HOST}:${PORT}`
  );
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Protocol: ${protocol.toUpperCase()}`);
  if (!isProduction) {
    console.log("💡 Using HTTP for development. Set NODE_ENV=production for HTTPS.");
  }
});
