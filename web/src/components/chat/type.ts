export interface Chat {
  id: number;
  name: string;
  type: "student" | "class" | "group";
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isTyping?: boolean;
  participants?: number;
}

export interface ChatListProps {
  pinnedChats?: Chat[];
  allChats?: Chat[];
  selectedChat?: Chat;
  onSelectChat: (chat: Chat) => void;
}

export interface ChatItemProps {
  chat: Chat;
  isActive?: boolean;
  onSelect: (chat: Chat) => void;
}