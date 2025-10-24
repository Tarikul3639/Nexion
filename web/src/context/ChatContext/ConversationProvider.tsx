"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ISearchResult } from "@/types/message/types";
import { useConversationApi } from "./hooks/useFetchConversations"; 
import { useAuth } from "@/context/AuthContext";
import { useChatListUpdate } from "./hooks/useChatListUpdate";
import { useUserStatusUpdate } from "./hooks/useUserStatusUpdate";

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
  const { fetchInitialConversations, isConversationsLoading, conversationError } = useConversationApi();
  const [conversations, setConversations] = useState<ISearchResult[]>([]);

  useEffect(() => {
    if (!token) return;

    const loadConversations = async () => {
      // console.log("🚀 Initial conversation fetch (via custom hook)...");
      const result = await fetchInitialConversations();
      console.log(result?.conversations);
      if (result?.conversations) setConversations(result.conversations);
    };

    loadConversations();
  }, [token, fetchInitialConversations]);

  //Use the custom hook to handle real-time conversation updates
  useChatListUpdate(setConversations);
  
  // Use the custom hook to handle real-time user status updates
  useUserStatusUpdate(setConversations);

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
