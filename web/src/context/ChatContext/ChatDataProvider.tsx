// src/context/ChatDataProvider.tsx

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Assuming path
import { ISearchResult } from "@/types/message/types"; // Assuming path for ISearchResult

interface ConversationContextType {
    conversations: ISearchResult[];
    isConversationsLoading: boolean;
    // Real-time updates for the list (optional, but good practice)
    setConversations: React.Dispatch<React.SetStateAction<ISearchResult[]>>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversationData = () => {
    const context = useContext(ConversationContext);
    if (!context) throw new Error("useConversationData must be used within a ChatDataProvider");
    return context;
};

export const ChatDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();
    const [conversations, setConversations] = useState<ISearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Skip if no token
        if (!token) {
            setLoading(false);
            return;
        }

        // 2. Caching Logic: If data is already present, skip fetching
        if (conversations.length > 0 && !loading) {
            return;
        }

        const fetchInitialConversations = async () => {
            console.log("🚀 Initial conversation fetch (Global Context)...");
            setLoading(true);

            try {
                const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/conversations`;

                const response = await axios.get<ISearchResult[]>(endpoint, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: { limit: 20, page: 1 }
                });
                
                setConversations(response.data);
                console.log("Initial Conversation: ",response.data);
                
            } catch (error) {
                console.error("❌ Failed to fetch conversations in ChatDataProvider:", (error as any).message);
                setConversations([]); 
            } finally {
                setLoading(false);
            }
        };
        
        fetchInitialConversations();

    }, [token]); // Only refetch when token changes (login/logout)

    return (
        <ConversationContext.Provider
            value={{
                conversations,
                isConversationsLoading: loading,
                setConversations,
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};