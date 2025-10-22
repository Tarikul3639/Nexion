// useInitialConversations.ts (SIMPLIFIED HOOK)

'use client';

// Note: Now it imports from useConversationData
import { useConversationData } from '@/context/ChatContext/ChatDataProvider'; 
import { ISearchResult } from '@/types/message/types';

interface UseInitialConversationsResult {   
  data: ISearchResult[];
  loading: boolean;
}

export const useInitialConversations = (): UseInitialConversationsResult => {
  // Fetch data directly from the global context
  const { conversations, isConversationsLoading } = useConversationData(); 
  
  return { 
    data: conversations, 
    loading: isConversationsLoading 
  };
};