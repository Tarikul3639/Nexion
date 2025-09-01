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
  isEdited?: boolean;
};
