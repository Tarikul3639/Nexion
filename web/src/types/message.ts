//web\src\types\message.ts

// Base interface for common fields
export interface BaseMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "seen";
  isMe: boolean;
  isPinned?: boolean;
  isEdited?: boolean;
  replyTo?: string;
  role?: "user" | "admin" | "assistant" | "teacher";
}

// Content-specific message types
export interface TextMessage extends BaseMessage {
  type: "text";
  content: {
    text: string;
  };
}

export interface ImageMessage extends BaseMessage {
  type: "image";
  content: {
    images: {
      url: string;
      alt?: string;
      width?: number;
      height?: number;
    }[];
  };
}

export interface FileMessage extends BaseMessage {
  type: "file";
  content: {
    files: {
      url: string;
      name: string;
      size?: number;
      extension?: string;
    }[];
  };
}

export interface AudioMessage extends BaseMessage {
  type: "audio";
  content: {
    audio: {
      url: string;
      duration?: number;
      waveform?: number[];
    };
  };
}


export interface VideoMessage extends BaseMessage {
  type: "video";
  content: {
    url: string;
    thumbnail?: string;
    duration?: number;
  };
}

// Union type for all messages
export type MessageItem =
  | TextMessage
  | ImageMessage
  | FileMessage
  | AudioMessage
  | VideoMessage;
