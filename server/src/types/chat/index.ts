import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  user?: IUser;
}

// JWT payload interface
export interface ITokenPayload {
  _id: string;
  email?: string;
  username: string;
  iat?: number;
  exp?: number;
}

// User type
export interface IUser {
  _id: string;
  email?: string;
  username: string;
  avatar?: string;
  online?: boolean;
}

export interface IChatList {
  id: string;
  name: string;
  status?: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
  type?: "direct" | "group" | "classroom";
  avatar?: string;
  lastMessage?: {
    _id: string;
    content: { text?: string; attachments?: any[] };
    type: "text" | "image" | "video" | "file" | "audio";
    sender: { _id: string; username: string; avatar?: string };
    createdAt: string;
    isPinned?: boolean;
  };
  participants?: { _id: string; username: string; avatar?: string }[];
  updatedAt?: string;
  unreadCount?: number;
}



// ................................Conversations................................

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
  updatedAt: string;
  status: "sending" | "sent" | "delivered" | "seen";
  isMe: boolean;
  role?: "teacher" | "assistant" | "admin" | "student";
  replyToId?: string;
  isEdited?: boolean;
};