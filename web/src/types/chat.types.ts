import { User } from './user.types';
import { Message } from './message.types';

export interface Chat {
  conversationId: string;
  _id: string;
  id?: number;
  username: string;
  type?: string;
  avatar?: string;
  status?: string;
  members?: number;
  lastMessage?: Message;
  unreadCount?: number;
  participants?: User[];
}

export interface ChatHeaderProps {
  selectedChat: ChatFriend;
}

export interface ChatListProps {
  chats: Chat[];
  selectedChatId?: number;
  onChatSelect: (chat: Chat) => void;
}

export interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error?: string;
}

export interface ChatFriend {
  _id: string;
  username: string;
  avatar: string;
  status: string;
  type?: string;
  lastMessage?: Message;
  participants?: User[];
}