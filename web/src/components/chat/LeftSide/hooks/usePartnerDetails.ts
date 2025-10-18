'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { ISearchResult, IPartnerDetails } from '../types';

export const usePartnerDetails = (chat: ISearchResult): IPartnerDetails | null => {
    const { socket } = useSocket();
    const [partner, setPartner] = useState<IPartnerDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if ( !socket ) return;

        if (chat.type !== "direct" || !chat.partnerId) {
            setPartner(null);
            return;
        }

        const partnerId = chat.partnerId;
        setIsLoading(true);
        
        // 1. Request partner details from the backend
        socket.emit("fetchPartnerDetails", { partnerId });

        // 2. Receive response from the backend
        const handleDetailsFetched = (data: IPartnerDetails) => {
            console.log("Partner details fetched: ", data);
            if (data.id === partnerId) {
                setPartner(data); // Update state with fetched partner details
                setIsLoading(false);
            }
        };

        socket.on("partnerDetailsFetched", handleDetailsFetched);

        return () => {
            socket.off("partnerDetailsFetched", handleDetailsFetched);
        };
    }, [chat.partnerId, chat.type, socket]);

    // Group chat/New User- use chat data directly
    // If not a direct chat, return null so callers use chat.* directly
    if (chat.type !== "direct") {
        return null;
    }

    // For direct chats return either fetched partner details or a loading stub
    return partner || { isLoading: isLoading };
}