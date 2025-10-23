// hooks/useChatApi.ts (Production Level Custom Hook)

import { useState, useCallback } from 'react';
import axios from 'axios';
import { usePanel } from "@/context/PanelContext";
import { useAuth } from '@/context/AuthContext';
import { IMessage } from "@/types/message/indexs";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FetchResult {
    messages: IMessage[];
    hasMore: boolean;
}

export function getMessages() {
    // 🔑 FIX: Hooks are correctly used inside a custom hook
    const { selectedConversation } = usePanel();
    const { token } = useAuth();
    const [initialMessageIsLoading, setIsMessagesLoading] = useState(false);
    const [initialMessageError, setInitialMessageError] = useState<string | null>(null);

    // useCallback ensures the function reference remains stable
    const fetchInitialMessages = useCallback(async (
        limit: number = 50, 
        skip: number = 0
    ): Promise<FetchResult | null> => {
        if (!selectedConversation?.id) {
            setInitialMessageError("No conversation selected.");
            return null;
        }

        setIsMessagesLoading(true);
        setInitialMessageError(null);
        
        try {
            // 🔑 FIX: Using axios.get (correct REST method) and passing parameters via 'params'
            const response = await axios.get(
                `${API_BASE_URL}/api/chat/${selectedConversation.id}/messages`, 
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit, skip },
                }
            );

            const data = response.data;
            console.log("Message: ",data);
            if (data.success) {
                // Assuming backend returns { success: true, messages: IMessage[], hasMore: boolean }
                return {
                    messages: data.messages as IMessage[],
                    hasMore: data.hasMore || false,
                };
            }
            return null;

        } catch (err) {
            console.error("API Fetch Error:", err);
            // Provide a better error message
            setInitialMessageError(`Failed to load messages: ${axios.isAxiosError(err) ? err.message : 'Unknown error'}`);
            return null;
        } finally {
            setIsMessagesLoading(false);
        }
    }, [selectedConversation?.id]); // Depend on conversation ID

    return { fetchInitialMessages, initialMessageIsLoading, initialMessageError  };
}