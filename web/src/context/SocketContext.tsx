"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

// Type of SocketContext
interface SocketContextType {
  socket: Socket | null;
}

// Context
const SocketContext = createContext<SocketContextType>({
  socket: null,
});

// Custom Hook
export const useSocket = (): SocketContextType => useContext(SocketContext);

// Provider props type
interface SocketProviderProps {
  children: React.ReactNode;
}

// ✅ Provider Component
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { user, token, logout } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const cleanupSocket = (sock: Socket | null) => {
      if (sock) {
        sock.disconnect();
        console.log("🔌 Socket disconnected");
      }
    };

    // 🧩 Connect only if user & token exist
    if (user && token) {
      console.log("🔐 Connecting socket with token...");
      const ws = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
        auth: { token },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // ✅ Save socket
      setSocket(ws);

      // 🔹 Socket connected
      ws.on("connect", () => {
        // Socket is connected but not yet authenticated
        // We don't set isConnected=true here because custom event handlers
        // aren't attached until after authentication
        console.log("🔌 Socket transport connected:", ws.id);
      });

      // 🔹 Connection verified from server
      ws.on("connection:verified", (data) => {
        // NOW the socket is fully authenticated and ready for app events
        console.log(data.user.name," connected with socket ID:", ws.id);
      });

      // 🔹 Token expired
      ws.on("connection:expired", (data) => {
        console.warn("⚠️ Token expired:", data.message);
        // Optional: auto logout or token refresh
        logout();
      });

      // 🔹 Invalid user / no token
      ws.on("connection:denied", (data) => {
        console.error("🚫 Connection denied:", data.message);
        logout();
      });

      ws.on("connection:user_not_found", (data) => {
        console.error("❌ User not found:", data.message);
        logout();
      });

      // 🔹 Handle generic connection error
      ws.on("connect_error", (err) => {
        console.error("⚠️ Socket connection error:", err.message);
      });

      // Cleanup on unmount or logout
      return () => {
        cleanupSocket(ws);
        setSocket(null);
      };
    } else {
      // 🧹 Cleanup if no user/token
      cleanupSocket(socket);
      setSocket(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
