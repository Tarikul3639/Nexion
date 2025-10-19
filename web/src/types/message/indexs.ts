// DraftMessage type (unchanged)
export type DraftMessage = {
  text?: string;
  attachments?: {
    type: "image" | "video" | "file" | "audio/webm";
    file?: File; // local file (for preview before upload)
    url?: string; // uploaded URL
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
  readBy?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  }[];
  updatedAt: string;
  status: "uploading" | "sending" | "sent" | "delivered" | "seen";
  isMe: boolean;
  role?: "teacher" | "assistant" | "admin" | "student";
  replyToId?: string;
  isEdited?: boolean;
  tempId?: string; // For optimistic UI updates
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
    name: string;
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

// export interface IChatList {
//   _id?: string;
//   id: string;
//   name: string;
//   type: "direct" | "group" | "classroom" | "user";
//   avatar?: string;
//   status?: "online" | "offline" | "away" | "busy";
//   isTyping?: boolean;
//   lastMessage?: IMessage;
//   participants: {
//     _id: string;
//     name: string;
//     username: string;
//     avatar?: string;
//     status?: "online" | "offline" | "away" | "busy";
//     lastSeen?: string;
//   }[];
//   updatedAt: string;
//   unreadCount: number;
//   isPinned?: boolean;
//   lastActive?: string; 
// }

// export interface IChatListProps {
//   chat: IChatList;
//   isActive: boolean;
//   onSelect: (chat: IChatList) => void;
// }
