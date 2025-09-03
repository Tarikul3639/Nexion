// types\message\message.messageList.ts

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
  id: string; // For frontend key usage
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
  isPinned?: boolean;
}