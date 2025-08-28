// chat.ts

// Chat status types
export type ChatStatus = "online" | "offline" | "lastActive";

// Message types
export type MessageType = "text" | "image" | "video" | "file";

// Base message interface
export interface BaseMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "teacher";
  type: MessageType;
  timestamp: string;
}

// Specific message types using discriminated union
export interface TextMessage extends BaseMessage {
  type: "text";
  content: string;
}

export interface FileMessage extends BaseMessage {
  type: "file";
  content: {
    filename: string;
    url: string;
    size?: string;
  };
}

export interface ImageMessage extends BaseMessage {
  type: "image";
  content: {
    url: string;
    alt?: string;
  };
}

export interface VideoMessage extends BaseMessage {
  type: "video";
  content: {
    url: string;
    duration?: string;
  };
}

// Union of all message types
export type Message = TextMessage | FileMessage | ImageMessage | VideoMessage;

// Chat item interface
export interface ChatItem {
  id: string;
  name: string;
  type: "single" | "group" | "class";
  avatar: string;
  participants?: number; // Only for group/class
  unreadCount: number;
  isTyping: boolean;
  status: ChatStatus;
  lastActive?: string; // For lastActive status or offline
  lastMessage: Message;
  isPinned?: boolean; // For pinned chats
}

// Props for ChatList component
export interface ChatListProps {
  allChats: ChatItem[];
  selectedChat?: ChatItem | null;
  onSelectChat: (chat: ChatItem | null) => void;
}

// Props for individual ChatItem component
export interface ChatItemProps {
  chat: ChatItem;
  isActive: boolean;
  onSelect: (chat: ChatItem | null) => void;
  selectedChat?: ChatItem | null;   // Optional if needed
  setSelectedChat?: (chat: ChatItem | null) => void; // Optional setter
}
