import mongoose from "mongoose";

// --- 1. Message/Sender Stub (Must match frontend's IMessage) ---

/**
 * Basic details of the message sender, as populated from the User model.
 */
export interface IUserStub {
  _id: string; // ID as string
  name: string;
  username: string;
  avatar?: string;
}

/**
 * Interface for message attachments (Backend structure for lastMessage preview).
 */
export interface IAttachment {
  type: "text" | "image" | "video" | "file" | "audio";
  url: string;
  name?: string;
  size?: number;
  extension?: string;
  alt?: string;
  thumbnail?: string;
  duration?: number;
  waveform?: number[];
}

/**
 * Defines the minimum required message structure for a LAST MESSAGE PREVIEW.
 * This ensures compatibility with the frontend's IMessage structure in IChatList.
 */
export interface ILastMessage {
  _id: string; // The message ID
  sender: IUserStub;
  content: {
    text?: string;
    attachments?: IAttachment[];
  };
  type: "text" | "image" | "video" | "file" | "audio" | string;
  createdAt: Date; // Server side typically returns Date object before serialization
  // Note: Since this is a partial message, we only include selected fields.
}

// --- 2. Result Mapping (Must match frontend's IChatList) ---

/**
 * Defines the structure of a single search result item emitted back to the client.
 * This directly maps to the frontend's IChatList interface.
 */
export interface IConversationResult {
  id: string;
  displayType: "conversation" | "user";
  type: "direct" | "group" | "classroom";
  name?: string;
  username?: string;
  avatar?: string;
  partnerId?: string;
  status?: "online" | "offline" | "away" | "busy";
  lastMessage: ILastMessage | null; // Use the dedicated ILastMessage interface
  unreadCount: number;
  updatedAt: Date;
  isPinned: boolean;
  isTyping?: boolean;
  isFriend?: boolean;
}