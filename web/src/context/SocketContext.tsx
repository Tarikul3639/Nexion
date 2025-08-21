"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

// Type of SocketContext
interface SocketContextType {
  socket: Socket | null;
}

// Context
const SocketContext = createContext<SocketContextType>({ socket: null });
// Custom Hook
export const useSocket = (): SocketContextType => useContext(SocketContext);

// Provider props type
interface SocketProviderProps {
    children: React.ReactNode;
}
// Provider Component
export const SocketProvider = ({ children }: SocketProviderProps) => {
    const { user, isAuthenticated, token } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        if (user && token) {
            const ws = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
                auth: { token },
            });
            console.log("Socket connecting...");

            setSocket(ws);

            ws.on("connect", () => {
                console.log("Socket connected", ws.id);
            });

            ws.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
            });

            return () => {
                if (ws.connected) ws.disconnect();
                setSocket(null);
                console.log("Socket disconnected");
            };
        }
    }, [isAuthenticated, token, user, router]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}
