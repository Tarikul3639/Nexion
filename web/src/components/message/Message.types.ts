export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isOwn: boolean;
  replyTo?: Message;
  isPinned?: boolean;
  isEdited?: boolean;
  attachments?: File[];
  role?: string;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
    reacted: boolean;
  }>;
}

export interface MessageProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messagesContainerRef?: React.RefObject<HTMLDivElement>;
  onReply?: (message: Message) => void;
  onPin?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: number) => void;
  onReaction?: (id: number, emoji: string) => void;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export interface MessageActionsProps {
  message: Message;
  onReply?: (message: Message) => void;
  onPin?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: number) => void;
}
