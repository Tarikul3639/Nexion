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
  _id: string;
  name: string;
  type: "direct" | "group" | "classroom";
  avatar?: string;
  lastMessage?: {
    _id: string;
    content: { text?: string; attachments?: any[] };
    type: "text" | "image" | "video" | "file" | "audio";
    sender: { _id: string; username: string; avatar?: string };
    createdAt: string;
    isPinned?: boolean;
  };
  participants: { _id: string; username: string; avatar?: string }[];
  updatedAt: string;
  unreadCount: number;
}
