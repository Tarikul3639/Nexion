"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePanel } from "@/context/PanelContext";
import { ISearchResult } from "@/types/message/types";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

// 💡 NEW: Define a stub for user data required for the front-end lookup
interface IUserProfileStub {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "offline" | "away" | "busy";
}

interface LeftPanelDataContextType {
  allChats: ISearchResult[];
  allClassrooms: Classroom[];
  allBots: Bot[];
  allUsers: IUserProfileStub[]; // 💡 ADDED: State to store user stubs for lookups
  setAllChats: React.Dispatch<React.SetStateAction<ISearchResult[]>>;
  setAllClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
  setAllBots: React.Dispatch<React.SetStateAction<Bot[]>>;
  setAllUsers: React.Dispatch<React.SetStateAction<IUserProfileStub[]>>; // 💡 ADDED Setter
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

  const [allChats, setAllChats] = useState<ISearchResult[]>([]);
  const [allClassrooms, setAllClassrooms] = useState<Classroom[]>([]);
  const [allBots, setAllBots] = useState<Bot[]>([]);
  const [allUsers, setAllUsers] = useState<IUserProfileStub[]>([]); // 💡 NEW STATE
  const [loading, setLoading] = useState<boolean>(true);

  // 💡 LATER: You'd want a separate useEffect to load all required user stubs (e.g., friends/contacts)
  useEffect(() => {
    if (!socket || !user) return;
    
    // --- Initial User Stubs Load (PLACEHOLDER) ---
    // In a real app, you would emit a socket event here to get the list of all friends/contacts
    // and store them in allUsers state for quick lookup in ChatItem.
    // socket.emit("getRequiredUserStubs"); 
    // socket.on("requiredUserStubs", (users: IUserProfileStub[]) => {
    //   setAllUsers(users);
    // });
    
    // For now, let's proceed with the chat/search logic.

    setLoading(true);

    // // --- Chats ---
    // socket.emit("getChatList");

    // socket.on("chatList", (chats: ISearchResult[]) => {
    //   setAllChats(chats);
    //   setLoading(false);
      
    //   // 💡 LOGIC INTEGRATION: Extract all unique user IDs from direct chats
    //   // and load their profiles into allUsers (if not already there).
    //   // For this solution, we assume necessary user stubs are available in allUsers.
    // });
    
    socket.on("chatListUpdate", (update) => {
      // Notification logic (kept as is)
      if (
        "Notification" in window &&
        Notification.permission === "granted" &&
        update.lastMessage.sender._id !== user?.id
      ) {
        new Notification(update.lastMessage?.sender.username || "Nexion", {
          body: `Message: ${update.lastMessage?.content.text}` || "You received a new message",
          icon: update.lastMessage?.sender.avatar || "/Nexion.svg",
        });
      }

      // Update chat state
      setAllChats((prev) => {
        const chatExists = prev.some(chat => chat.id === update.conversationId);
        
        // If it's a new conversation, add it to the top.
        if (!chatExists) {
            // 💡 You'll need to fetch the full IChatList item for the new conversation
            // For now, this is a simplified update logic:
            // return [{ id: update.conversationId, ...update, displayType: 'conversation', type: 'direct' }, ...prev];
        }

        // Existing chat update logic
        return prev.map((chat) =>
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
        );
      });
    });

    socket.on("userStatusUpdate", ({ userId, status }) => {
      // 💡 Update allUsers state first, then map over chats/search results if needed
      setAllUsers(prev => prev.map(u => u.id === userId ? {...u, status} : u));
      
      // The logic below is for old chat structure where participants were fully populated
      // Since we rely on allUsers for status lookup now, this block might be redundant:
      /*
      setAllChats((prev) =>
        prev.map((chat) => ({
          ...chat,
          participants: chat.participants.map((p) =>
            p._id === userId ? { ...p, status } : p
          ),
        }))
      );
      */
    });

    // Classrooms/Bots logic (kept as is)
    socket.on("initialClassrooms", (classrooms: Classroom[]) => {
      setAllClassrooms(classrooms);
    });

    socket.on("updateClassrooms", (classrooms: Classroom[]) => {
      setAllClassrooms(classrooms);
    });

    socket.on("initialBots", (bots: Bot[]) => {
      setAllBots(bots);
    });

    socket.on("updateBots", (bots: Bot[]) => {
      setAllBots(bots);
    });

    return () => {
      // Clean up socket listeners
      socket.off("chatListUpdate");
      socket.off("userStatusUpdate");
      socket.off("searchResults");
      socket.off("initialClassrooms");
      socket.off("updateClassrooms");
      socket.off("initialBots");
      socket.off("updateBots");
    };
  }, [socket, activeTab, user]);

  // Request Notification permission on mount (kept as is)
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <LeftPanelDataContext.Provider
      value={{
        allChats,
        allClassrooms,
        allBots,
        allUsers, // 💡 ADDED to context value
        setAllChats,
        setAllClassrooms,
        setAllBots,
        setAllUsers, // 💡 ADDED to context value,
        loading,
      }}
    >
      {children}
    </LeftPanelDataContext.Provider>
  );
};