"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
    const { user, token } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    
    useEffect(() => {
        // Clean up function to handle socket disconnection
        const cleanupSocket = (socket: Socket | null) => {
            if (socket && socket.connected) {
                socket.disconnect();
                console.log("Socket disconnected");
            }
        };

        // Only attempt connection if both user and token exist
        if (user && token) {
            console.log("Socket connecting with token...", token.substring(0, 10) + "...");
            
            try {
                // Create new socket connection
                const ws = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
                    auth: { token },
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                setSocket(ws);

                ws.on("connect", () => {
                    console.log("Socket connected successfully", ws.id);
                });

                ws.on("connect_error", (err) => {
                    console.error("Socket connection error:", err);
                });

                // Return cleanup function
                return () => {
                    cleanupSocket(ws);
                    setSocket(null);
                };
            } catch (error) {
                console.error("Error initializing socket:", error);
            }
        } else {
            // If no user or token, cleanup any existing socket
            cleanupSocket(socket);
            setSocket(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, user]); // Only depend on token and user to avoid unnecessary reconnection

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}
