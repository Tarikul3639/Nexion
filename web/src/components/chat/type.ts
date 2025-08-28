export type Chat = {
  id: string;
  name: string;
  avatar: string;
  type: "student" | "class" | "group";
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isTyping?: boolean;
};

export type ChatItemProps = {
  chat: Chat;
  isActive?: boolean;
  onSelect: (chat: Chat) => void;
};

export type ChatListProps = {
  pinnedChats?: Chat[];
  allChats?: Chat[];
  selectedChat?: Chat;
  onSelectChat: (chat: Chat) => void;
};
