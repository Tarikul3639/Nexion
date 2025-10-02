"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePanel } from "@/context/PanelContext";
import { IChatList } from "@/types/message/message.messageList";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";
import { useSocket } from "@/context/SocketContext";

interface LeftPanelDataContextType {
  allChats: IChatList[];
  allClassrooms: Classroom[];
  allBots: Bot[];
  setAllChats: React.Dispatch<React.SetStateAction<IChatList[]>>;
  setAllClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
  setAllBots: React.Dispatch<React.SetStateAction<Bot[]>>;
  searchActive: boolean;
  setSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
  searchResults: IChatList[];
  setSearchResults: React.Dispatch<React.SetStateAction<IChatList[]>>;
  loading: boolean;
}

const LeftPanelDataContext = createContext<
  LeftPanelDataContextType | undefined
>(undefined);

export const useLeftPanelData = () => {
  const context = useContext(LeftPanelDataContext);
  if (!context)
    throw new Error(
      "useLeftPanelData must be used within LeftPanelDataProvider"
    );
  return context;
};

export const LeftPanelDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { activeTab } = usePanel();
  const { socket } = useSocket();

  const [allChats, setAllChats] = useState<IChatList[]>([]);
  const [allClassrooms, setAllClassrooms] = useState<Classroom[]>([]);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<IChatList[]>([]);
  const [allBots, setAllBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!socket) return;

    // Loading true until first data arrives
    setLoading(true);

    // --- Chats ---
    socket.emit("getChatList");

    socket.on("chatList", (chats: IChatList[]) => {
      console.log("ChatList: ", chats);
      setAllChats(chats);
      setLoading(false);
    });

    // Chat list update
    socket.on("chatListUpdate", (update) => {
      console.log("Chat list update:", update.conversationId, update.lastMessage);
      setAllChats((prev) =>
        prev.map((chat) =>
          chat.id === update.conversationId
            ? {
                ...chat,
                lastMessage: update.lastMessage,
                updatedAt: update.updatedAt,
              }
            : chat
        )
      );
    });

    socket.on("userStatusUpdate", ({ userId, status }) => {
      setAllChats((prev) =>
        prev.map((chat) => ({
          ...chat,
          participants: chat.participants.map((p) =>
            p._id === userId ? { ...p, status } : p
          ),
        }))
      );
    });

    socket.on("searchResults", (results: IChatList[]) => {
      setSearchResults(results);
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
      socket.off("searchUsersResult");
      socket.off("newMessage");
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
        searchActive,
        setSearchActive,
        searchResults,
        setSearchResults,
        loading,
      }}
    >
      {children}
    </LeftPanelDataContext.Provider>
  );
};
