"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ISearchResult } from "@/types/message/types";
import { useConversationApi } from "./hooks/useFetchConversations"; 
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext"; //


interface ChatListUpdate { // সার্ভার থেকে আসা আপডেটের জন্য নতুন টাইপ
    conversationId: string;
    unreadCount: number;
    // lastMessage (optional) এবং অন্যান্য ফিল্ড থাকতে পারে, কিন্তু আমরা আপাতত unreadCount-এর জন্য ফোকাস করছি
}

interface ConversationContextType {
  conversations: ISearchResult[];
  isConversationsLoading: boolean;
  setConversations: React.Dispatch<React.SetStateAction<ISearchResult[]>>;
  conversationError: string | null;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context)
    throw new Error("useConversation must be used within a ConversationProvider");
  return context;
};

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const { socket } = useSocket();
  const { fetchInitialConversations, isConversationsLoading, conversationError } = useConversationApi();
  const [conversations, setConversations] = useState<ISearchResult[]>([]);

  useEffect(() => {
    if (!token) return;

    const loadConversations = async () => {
      console.log("🚀 Initial conversation fetch (via custom hook)...");
      const result = await fetchInitialConversations();
      console.log(result?.conversations);
      if (result?.conversations) setConversations(result.conversations);
    };

    loadConversations();
  }, [token, fetchInitialConversations]);



  // 2. ✅ Socket.IO ইভেন্ট হ্যান্ডলিং (unreadCount আপডেট)
    const handleConversationUpdate = useCallback((update: ChatListUpdate) => {
        console.log("Received conversation:update", update);

        setConversations(prev => {
            const index = prev.findIndex(c => c.id === update.conversationId);

            if (index !== -1) {
                // কনভারসেশনটি খুঁজে পাওয়া গেলে, শুধুমাত্র unreadCount আপডেট করা হবে
                const updatedList = [...prev];
                updatedList[index] = {
                    ...updatedList[index],
                    unreadCount: update.unreadCount, // 💡 আনরিড কাউন্ট 0 হবে
                    // 🔑 অপশনাল: মেসেজ পাওয়ার পর আপডেট ডেটাবেস অনুযায়ী অন্য ডেটা আপডেট
                };
                return updatedList;
            }
            // যদি কনভারসেশনটি না পাওয়া যায়, তবে এটি নতুন মেসেজ এবং সম্পূর্ণ কনভারসেশন ডেটা না আসা পর্যন্ত অপেক্ষা করবে।
            return prev; 
        });
    }, []);

  useEffect(() => {
        if (!socket) return;
        
        // 'conversation:update' ইভেন্ট লিসেনার যোগ করা
        socket.on("conversation:update", handleConversationUpdate);

        return () => {
            // কম্পোনেন্ট আনমাউন্ট হলে বা socket পরিবর্তন হলে লিসেনার মুছে ফেলা
            socket.off("conversation:update", handleConversationUpdate);
        };
    }, [socket, handleConversationUpdate]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        isConversationsLoading,
        setConversations,
        conversationError,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
