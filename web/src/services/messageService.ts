import { Message } from '@/types/message.types';
import { API_ENDPOINTS } from '@/utils/constants';

export interface MessageService {
  getMessages(chatId: number): Promise<Message[]>;
  sendMessage(chatId: number, content: string, attachments?: File[]): Promise<Message>;
  deleteMessage(messageId: number): Promise<void>;
  editMessage(messageId: number, newContent: string): Promise<Message>;
  pinMessage(messageId: number): Promise<Message>;
  replyToMessage(messageId: number, replyContent: string): Promise<Message>;
}

class MessageServiceImpl implements MessageService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  async getMessages(chatId: number): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.MESSAGES}?chatId=${chatId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(chatId: number, content: string, attachments?: File[]): Promise<Message> {
    try {
      const formData = new FormData();
      formData.append('chatId', chatId.toString());
      formData.append('content', content);
      
      if (attachments) {
        attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }

      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.MESSAGES}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.MESSAGES}/${messageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  async editMessage(messageId: number, newContent: string): Promise<Message> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.MESSAGES}/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent }),
      });
      if (!response.ok) {
        throw new Error('Failed to edit message');
      }
      return response.json();
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  async pinMessage(messageId: number): Promise<Message> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.MESSAGES}/${messageId}/pin`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to pin message');
      }
      return response.json();
    } catch (error) {
      console.error('Error pinning message:', error);
      throw error;
    }
  }

  async replyToMessage(messageId: number, replyContent: string): Promise<Message> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.MESSAGES}/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      });
      if (!response.ok) {
        throw new Error('Failed to reply to message');
      }
      return response.json();
    } catch (error) {
      console.error('Error replying to message:', error);
      throw error;
    }
  }
}

export const messageService = new MessageServiceImpl();
