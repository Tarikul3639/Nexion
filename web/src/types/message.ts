// Types for Message related components

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: "text" | "image" | "file" | "audio" | "video";
  content: string;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "seen";
  isMe: boolean; 
  isPinned?: boolean;
  isEdited?: boolean;
  replyTo?: string;
  role?: "user" | "admin" | "assistant" | "teacher";
}
