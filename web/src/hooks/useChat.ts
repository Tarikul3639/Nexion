import { useState } from 'react';
import { ChatItem } from '@/types/chat';
import { Message } from '@/types/message.types';

export interface UseChatReturn {
  selectedChat: ChatItem | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  selectChat: (chat: ChatItem) => void;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  pinMessage: (messageId: number) => Promise<void>;
}

export const useChat = (): UseChatReturn => {
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectChat = (chat: ChatItem) => {
    setSelectedChat(chat);
    // Load messages for selected chat
    loadMessages(chat.id);
  };

  const loadMessages = async (chatId: string) => {
    setLoading(true);
    try {
      // API call to load messages
      // const response = await fetch(`/api/chats/${chatId}/messages`);
      // const data = await response.json();
      // setMessages(data);
      
      // For now, using mock data
      setMessages([]);
      console.log('Loading messages for chat:', chatId);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedChat) return;
    
    try {
      const newMessage: Message = {
        id: Date.now(),
        sender: 'You',
        content,
        timestamp: new Date().toISOString(),
        avatar: 'YU',
        isOwn: true,
        attachments,
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // API call to send message
      // await fetch(`/api/chats/${selectedChat.id}/messages`, {
      //   method: 'POST',
      //   body: JSON.stringify({ content, attachments }),
      // });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const deleteMessage = async (messageId: number) => {
    try {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      // API call to delete message
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('Failed to delete message');
    }
  };

  const pinMessage = async (messageId: number) => {
    try {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
        )
      );
      // API call to pin message
    } catch (error) {
      console.error('Error pinning message:', error);
      setError('Failed to pin message');
    }
  };

  return {
    selectedChat,
    messages,
    loading,
    error,
    selectChat,
    sendMessage,
    deleteMessage,
    pinMessage,
  };
};
