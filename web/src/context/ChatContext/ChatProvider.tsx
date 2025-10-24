"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { IMessage, DraftMessage } from "@/types/message/indexs";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatAI } from "./hooks/useChatAI";
import { useChatDraft } from "./hooks/useChatDraft";
import { useChatUpload } from "./hooks/useChatUpload";
import { useNewMessage } from "./hooks/useNewMessage";
import { useMessageConfirm } from "./hooks/useMessageConfirm";

interface ChatContextType {
  allMessages: IMessage[];
  setAllMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  draftMessage: DraftMessage;
  setDraftMessage: React.Dispatch<React.SetStateAction<DraftMessage>>;
  replyToId: string | null;
  setReplyToId: React.Dispatch<React.SetStateAction<string | null>>;
  uploadProgress: Record<string, number>;
  setUploadProgress: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  aiSuggestions: string[];
  showAISuggestions: boolean;
  onAISuggestion: (s: string) => void;
  isRecordingActive: boolean;
  setIsRecordingActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Manage all chat messages.
  const { allMessages, setAllMessages } = useChatMessages();
  // Handle incoming new messages
  useNewMessage(setAllMessages);
  // Message confirmation management
  useMessageConfirm(setAllMessages);

  const { aiSuggestions, showAISuggestions, onAISuggestion } = useChatAI();
  const { draftMessage, setDraftMessage, replyToId, setReplyToId } = useChatDraft();
  const { uploadProgress, setUploadProgress } = useChatUpload();
  const [isRecordingActive, setIsRecordingActive] = useState(false);

  const value = useMemo(
    () => ({
      allMessages,
      setAllMessages,
      draftMessage,
      setDraftMessage,
      replyToId,
      setReplyToId,
      uploadProgress,
      setUploadProgress,
      aiSuggestions,
      showAISuggestions,
      onAISuggestion,
      isRecordingActive,
      setIsRecordingActive,
    }),
    [
      allMessages,
      draftMessage,
      replyToId,
      uploadProgress,
      aiSuggestions,
      showAISuggestions,
      onAISuggestion,
      isRecordingActive,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
