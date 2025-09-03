// DraftMessage type (unchanged)
export type DraftMessage = {
  text?: string;
  attachments?: {
    type: "image" | "video" | "file" | "audio/webm";
    url: string;
    name?: string;
    size?: number;
    extension?: string;
    alt?: string;
    thumbnail?: string;
    duration?: number;
    waveform?: number[];
  }[];
};

// MessageItem will use DraftMessage as content
export type MessageItem = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: DraftMessage;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "seen";
  isMe: boolean;
  role?: "teacher" | "assistant" | "admin" | "student";
  replyToId?: string;
  isEdited?: boolean;
};

// ...............MessageList...........................
export interface IAttachment {
  type: "image" | "video" | "file" | "audio";
  url: string;
  name?: string;
  size?: number;
  extension?: string;
  alt?: string;
  thumbnail?: string;
  duration?: number;
  waveform?: number[];
}

export interface IMessage {
  _id: string;
  sender: {
    _id: string;
    username: string;
    avatar?: string;
  };
  content: {
    text?: string;
    attachments?: IAttachment[];
  };
  type: "text" | "image" | "video" | "file" | "audio";
  createdAt: string;
  isPinned?: boolean;
}

export interface IChatList {
  _id: string;
  name: string;
  type: "direct" | "group" | "classroom";
  avatar?: string;
  isTyping?: boolean;
  lastMessage?: IMessage;
  participants: {
    _id: string;
    username: string;
    avatar?: string;
  }[];
  updatedAt: string;
  unreadCount: number;
}

export interface IChatListProps {
  chat: IChatList;
  isActive: boolean;
  onSelect: (chat: IChatList) => void;
}