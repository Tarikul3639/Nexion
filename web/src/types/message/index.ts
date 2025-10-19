// Client-safe types: avoid importing server-only libs (like mongoose) in frontend
// Use plain string ids for compatibility with browser bundles.

// --- 1. Message/Sender Stub (Must match frontend's IMessage) ---

/**
 * Basic details of the message sender, as populated from the User model.
 * Use string ids on the client side for simplicity and to avoid bundling server libs.
 */
export interface IUser {
  _id: string;
  name: string;
  username?: string;
  avatar?: string;
  status?: string;
}

/**
 * Interface for message attachments (Backend structure for lastMessage preview).
 */
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

/**
 * Defines the minimum required message structure for a LAST MESSAGE PREVIEW.
 * This ensures compatibility with the frontend's IMessage structure in IChatList.
 */
export interface ILastMessage {
  _id: string;
  sender: IUser;
  content: {
    text?: string;
    attachments?: IAttachment[];
  };
  type: "text" | "image" | "video" | "file" | "audio" | string;
  createdAt: Date | string;
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
  status?: "online" | "offline" | "away" | "busy" | string;
  lastMessage: ILastMessage | null;
  unreadCount: number;
  updatedAt: Date | string;
  isPinned: boolean;
  isTyping?: boolean;
  isFriend?: boolean;
}

/**
 * User result (when returning 'people' suggestions).
 */
export interface IUserResult {
  id: string;
  displayType: "user";
  name: string;
  username: string;
  avatar?: string;
  status?: string;
  isFriend: boolean;
  type: "direct";
  isPinned: false;
  unreadCount: 0;
  // Make optional fields available so UI can render a "user" result using the same
  // components as conversations without TypeScript errors. These should be undefined
  // or empty for pure "user" search results.
  isTyping?: boolean;
  lastMessage?: ILastMessage | null;
  partnerId?: string;
}

/**
 * Final union type sent to client
 */
export type ISearchResult = IConversationResult | IUserResult;


// --- 3. Partner Details Interface for usePartnerDetails Hook ---
/**
 * Return shape for partner details used by ChatItem
 */
export interface IPartnerDetails extends IUser {
    isLoading: boolean;
}