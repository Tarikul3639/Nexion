"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePanel } from "@/context/PanelContext";
import { IChatList } from "@/types/message/x";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();

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
      setAllChats(chats);
      setLoading(false);
    });

    // Chat list update
    socket.on("chatListUpdate", (update) => {
      // Show notification (if allowed)
      if (
        "Notification" in window &&
        Notification.permission === "granted" &&
        update.lastMessage.sender._id !== user?.id
      ) {
        new Notification(update.lastMessage?.sender.username || "Nexion", {
          body: `Message: ${update.lastMessage?.content.text}` ||  "You received a new message",
          icon: update.lastMessage?.sender.avatar || "/Nexion.svg", // messenger style
        });
      }

      // Update chat state
      setAllChats((prev) =>
        prev.map((chat) =>
          chat.id === update.conversationId
            ? {
                ...chat,
                unreadCount:
                  update.unreadCount !== undefined
                    ? update.unreadCount
                    : chat.unreadCount,
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
  }, [socket, activeTab, user?.id]);

  // Add this useEffect to LeftPanelDataProvider
  useEffect(() => {
    if ("Notification" in window) {
      // Check if permission is denied and inform the user
      if (Notification.permission === "denied") {
        console.warn(
          "Notification permission is denied. Please enable it in your browser settings."
        );
      }

      // If permission is not 'granted', try to request it.
      // NOTE: Direct requests without a user gesture are often blocked or ignored by browsers.
      if (Notification.permission !== "granted") {
        // It's best practice to tie this to a user action,
        // but for initial setup, you can try this (it might not work on all browsers):
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted on load.");
          }
        });
      }
    }
  }, []);

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
