'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { IConversationResult } from '../types';

interface UseInitialConversationsResult {
  data: IConversationResult[];
  loading: boolean;
}

export const useInitialConversations = (): UseInitialConversationsResult => {
  const { socket } = useSocket();
  const [data, setData] = useState<IConversationResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;

    const handleInitialConversations = (results: IConversationResult[]) => {
      setData(results);
      setLoading(false);
    };

    // Start loading
    setLoading(true);
    socket.emit('get_initial_conversations');
    socket.on('initial_conversations_results', handleInitialConversations);

    return () => {
      socket.off('initial_conversations_results', handleInitialConversations);
    };
  }, [socket]);

  return { data, loading };
};
