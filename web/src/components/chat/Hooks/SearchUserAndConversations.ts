'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { ISearchResult } from '@/types/message/types';

export const useSearchUserAndConversations = (searchValue: string): ISearchResult[] | null => {
    const { socket } = useSocket();
    const [searchResults, setSearchResults] = useState<ISearchResult[] | null>(null);

    useEffect(() => {
        if (!searchValue || !socket) {
            setSearchResults(null);
            return;
        }

        const handleSearchResults = (results: ISearchResult[]) => {
            console.log("Search results: ",results);
            setSearchResults(results);
        };

        socket.emit('search_user_and_conversations', { search: searchValue.trim() });
        socket.on('search_user_and_conversations_results', handleSearchResults);

        return () => {
            socket.off('search_user_and_conversations_results', handleSearchResults);
        };
    }, [searchValue, socket]);

    return searchResults;
}