// src/hooks/useChatPartnerInfo.ts

import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext'; 

interface IChatPartner {
    id: string;
    name: string;
    avatar: string;
    status: string;
}

interface PartnerHookResult {
    conversationUserInfo: IChatPartner | null;
    isLoading: boolean;
    error: string | null;
}

interface IConversation {
    id: string;
    type: "conversation" | "user";
}

export const useChatPartnerInfo = (selectedConversation: IConversation | null): PartnerHookResult => {
    const { socket } = useSocket();
    const [conversationUserInfo, setConversationUserInfo] = useState<IChatPartner | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. If no selectedConversation or socket, reset states and return
        if (!selectedConversation || !socket) {
            setConversationUserInfo(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        // 2. If valid conversationId and socket, start loading
        setIsLoading(true);
        setError(null);

        // 3. Handler functions for socket events
        const handlePartnerInfo = (info: IChatPartner) => {
            setConversationUserInfo(info);
            setIsLoading(false);
        };

        const handleError = (message: string) => {
            setError(message);
            setConversationUserInfo(null);
            setIsLoading(false);
        };
        
        // 4. Requesting partner info from server
        // Event name: 'fetch_conversation_partner_info'
        socket.emit('fetch_conversation_partner_info', { selectedConversation });

        // 5. Socket listen: Waiting for results from server
        // Result event
        socket.on('conversation_partner_info_result', handlePartnerInfo);
        // Error event
        socket.on('conversation_partner_info_error', handleError);

        // 6. Cleanup: Remove event listeners on unmount or ID change
        return () => {
            socket.off('conversation_partner_info_result', handlePartnerInfo);
            socket.off('conversation_partner_info_error', handleError);
        };

    // Dependency array: Re-run the hook whenever selectedConversation changes
    }, [selectedConversation]);

    return { conversationUserInfo, isLoading, error };
};