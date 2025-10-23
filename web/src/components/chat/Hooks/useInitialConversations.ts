// useInitialConversations.ts (SIMPLIFIED HOOK)

'use client';

// Note: Now it imports from useConversation
import { useConversation } from '@/context/ChatContext/ConversationProvider'; 
import { ISearchResult } from '@/types/message/types';

interface UseInitialConversationsResult {   
  data: ISearchResult[];
  loading: boolean;
}

export const useInitialConversations = (): UseInitialConversationsResult => {
  // Fetch data directly from the global context
  const { conversations, isConversationsLoading } = useConversation(); 
  
  return { 
    data: conversations, 
    loading: isConversationsLoading 
  };
};