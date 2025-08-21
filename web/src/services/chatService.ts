import { Chat } from '@/types/chat.types';
import { API_ENDPOINTS } from '@/utils/constants';

export interface ChatService {
  getChats(): Promise<Chat[]>;
  getChatById(id: number): Promise<Chat>;
  createChat(chat: Omit<Chat, 'id'>): Promise<Chat>;
  updateChat(id: number, updates: Partial<Chat>): Promise<Chat>;
  deleteChat(id: number): Promise<void>;
  joinChat(chatId: number, userId: number): Promise<void>;
  leaveChat(chatId: number, userId: number): Promise<void>;
}

class ChatServiceImpl implements ChatService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  async getChats(): Promise<Chat[]> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.CHATS}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  async getChatById(id: number): Promise<Chat> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.CHATS}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching chat:', error);
      throw error;
    }
  }

  async createChat(chat: Omit<Chat, 'id'>): Promise<Chat> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.CHATS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chat),
      });
      if (!response.ok) {
        throw new Error('Failed to create chat');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  async updateChat(id: number, updates: Partial<Chat>): Promise<Chat> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.CHATS}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update chat');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating chat:', error);
      throw error;
    }
  }

  async deleteChat(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.CHATS}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  async joinChat(chatId: number, userId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.CHATS}/${chatId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to join chat');
      }
    } catch (error) {
      console.error('Error joining chat:', error);
      throw error;
    }
  }

  async leaveChat(chatId: number, userId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.CHATS}/${chatId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to leave chat');
      }
    } catch (error) {
      console.error('Error leaving chat:', error);
      throw error;
    }
  }
}

export const chatService = new ChatServiceImpl();
