// chat.ts

// Chat status types
export type ChatStatus = "online" | "offline" | "lastActive";

// Message types
export type MessageType = "text" | "image" | "file" | "audio" | "video";

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

// Attachment types for messages
export type AttachmentType = "image" | "video" | "file" | "audio/webm";

// Local attachment interface for input messages
export interface LocalAttachment {
  file: File;
  type: AttachmentType;
  name: string;
  size: number;
}

// Props for ChatInput component
export interface InputMessage {
  text: string;
  attachments: LocalAttachment[];
  timestamp?: string;
}

export interface ChatInputProps {
  message: InputMessage;
  setMessage: React.Dispatch<React.SetStateAction<InputMessage>>;
}

