"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePanel } from "@/context/PanelContext";
import { ChatItem } from "@/types/chat";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";
import { useSocket } from "@/context/SocketContext";

interface LeftPanelDataContextType {
  allChats: ChatItem[];
  allClassrooms: Classroom[];
  allBots: Bot[];
  setAllChats: React.Dispatch<React.SetStateAction<ChatItem[]>>;
  setAllClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
  setAllBots: React.Dispatch<React.SetStateAction<Bot[]>>;
  loading: boolean;
}

const LeftPanelDataContext = createContext<LeftPanelDataContextType | undefined>(undefined);

export const useLeftPanelData = () => {
  const context = useContext(LeftPanelDataContext);
  if (!context) throw new Error("useLeftPanelData must be used within LeftPanelDataProvider");
  return context;
};

export const LeftPanelDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { activeTab } = usePanel();
  const { socket } = useSocket();

  const [allChats, setAllChats] = useState<ChatItem[]>([]);
  const [allClassrooms, setAllClassrooms] = useState<Classroom[]>([]);
  const [allBots, setAllBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!socket) return;

    // Loading true until first data arrives
    setLoading(true);

    // --- Chats ---
    socket.emit("getChatList");

    socket.on("chatList", (chats: ChatItem[]) => {
    console.log("Received chat list:", chats);
      setAllChats(chats);
      setLoading(false);
    });

    socket.on("newChat", (chat: ChatItem) => {
      setAllChats(prev => [chat, ...prev]);
    });

    socket.on("newChat", (chat: ChatItem) => {
      setAllChats(prev => [chat, ...prev]);
    });

    // Classrooms
    socket.on("initialClassrooms", (classrooms: Classroom[]) => {
      setAllClassrooms(classrooms);
    });

    socket.on("updateClassrooms", (classrooms: Classroom[]) => {
      setAllClassrooms(classrooms);
    });

    // Bots
    socket.on("initialBots", (bots: Bot[]) => {
      setAllBots(bots);
    });

    socket.on("updateBots", (bots: Bot[]) => {
      setAllBots(bots);
    });

    return () => {
      socket.off("initialChats");
      socket.off("newChat");
      socket.off("initialClassrooms");
      socket.off("updateClassrooms");
      socket.off("initialBots");
      socket.off("updateBots");
    };
  }, [socket, activeTab]);

  return (
    <LeftPanelDataContext.Provider
      value={{
        allChats,
        allClassrooms,
        allBots,
        setAllChats,
        setAllClassrooms,
        setAllBots,
        loading,
      }}
    >
      {children}
    </LeftPanelDataContext.Provider>
  );
};
