import mongoose from "mongoose";

/* --- Message / sender stubs --- */
export interface IUserStub {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  username?: string;
  avatar?: string;
}

export interface IAttachment {
  type: "text" | "image" | "video" | "file" | "audio" | string;
  url: string;
  name?: string;
  size?: number;
  extension?: string;
  thumbnail?: string;
  duration?: number;
  waveform?: number[];
}

export interface ILastMessage {
  _id: mongoose.Types.ObjectId | string;
  sender: IUserStub;
  content: {
    text?: string;
    attachments?: IAttachment[];
  };
  type: "text" | "image" | "video" | "file" | "audio" | string;
  createdAt: Date;
}

/* --- Search result types --- */

/**
 * Conversation result (for existing conversations)
 */
export interface ISearchResult {
  id: string | mongoose.Types.ObjectId;
  displayType: "conversation" | "user"; // client can treat separately
  type: "direct" | "group" | "classroom";

  // group/classroom fields
  name?: string;
  avatar?: string;

  /*
  IMPORTANT: 'Status', 'username', 'lastSeen', 'lastActiveAt' field for direct conversations and potential new user results.
  */
  status?: "online" | "offline" | "away" | "busy" | string
  username?: string;
  lastSeen?: string;
  lastActiveAt?: Date | null;

  // direct-specific
  partnerId?: string;                // other participant id (for direct)
  partnerName?: string;              // optional convenience
  partnerAvatar?: string;
  partnerStatus?: "online" | "offline" | "away" | "busy" | string;

  isFriend?: boolean;
  isBlocked?: boolean;               // I blocked them
  hasBlockedMe?: boolean;            // they blocked me

  lastMessage: ILastMessage | null;
  unreadCount: number;
  updatedAt: Date;
  isPinned: boolean;
  isTyping?: boolean;
}
