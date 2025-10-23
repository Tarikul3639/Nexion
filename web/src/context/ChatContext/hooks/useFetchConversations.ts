// src/hooks/useConversationApi.ts

import { useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { ISearchResult } from "@/types/message/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FetchResult {
  conversations: ISearchResult[];
  hasMore: boolean;
}

export function useConversationApi() {
  const { token } = useAuth();
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);

  const fetchInitialConversations = useCallback(
    async (limit: number = 20, page: number = 1): Promise<FetchResult | null> => {
      if (!token) {
        setConversationError("No token found. Please log in.");
        return null;
      }

      setIsConversationsLoading(true);
      setConversationError(null);

      try {
        const response = await axios.get(`${API_BASE_URL}/api/chat/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit, page },
        });

        const data = response.data;
        console.log("Conversation API Response:", data);

        // 🔑 RE-IMPLEMENTED SUCCESS CHECK: Ensure the core data structure is present.
        if (!data || !Array.isArray(data.conversations)) {
            // Treat missing data as a logical failure, even if HTTP status was 200
            console.error("API response missing expected 'conversations' array.");
            setConversationError("Received malformed data from the server.");
            return null;
        }
        
          return {
            conversations: data.conversations || [],
            hasMore: data.hasMore || false,
          };

      } catch (err) {
        console.error("❌ Conversation Fetch Error:", err);
        setConversationError(
          `Failed to load conversations: ${
            axios.isAxiosError(err) ? err.message : "Unknown error"
          }`
        );
        return null;
      } finally {
        setIsConversationsLoading(false);
      }
    },
    [token]
  );

  return { fetchInitialConversations, isConversationsLoading, conversationError };
}
