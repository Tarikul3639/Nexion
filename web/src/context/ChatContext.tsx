"use client";

import React, { createContext, useContext, useState } from "react";
import { MessageItem } from "@/types/message";
import { messages as initialMessages } from "@/data/messages";
import { DraftMessage } from "@/types/message";

interface ChatContextType {
  showAISuggestions: boolean;
  setShowAISuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  aiSuggestions: string[];
  setAISuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  onAISuggestion: (suggestion: string) => void;
  isRecordingActive: boolean;
  setIsRecordingActive: React.Dispatch<React.SetStateAction<boolean>>;
  draftMessage: DraftMessage | null;
  setDraftMessage: React.Dispatch<React.SetStateAction<DraftMessage | null>>;
  allMessages: MessageItem[];
  setAllMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  replyToId: string | null;
  setReplyToId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const suggestion = ["AI Suggestion 1", "AI Suggestion 2", "AI Suggestion 3"];

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>(suggestion);
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<MessageItem[]>(initialMessages);
  const [draftMessage, setDraftMessage] = useState<DraftMessage | null>({
  text: "",
  attachments: [],
});

  // AI Suggestion selection
  const onAISuggestion = (suggestion: string) => {
    setDraftMessage((prev) => ({
      ...prev,
      text: suggestion,
    }));
    setShowAISuggestions(false);
  };

  const Value: ChatContextType = {
    showAISuggestions,
    setShowAISuggestions,
    aiSuggestions,
    setAISuggestions,
    onAISuggestion,
    isRecordingActive,
    setIsRecordingActive,
    draftMessage,
    setDraftMessage,
    allMessages,
    setAllMessages,
    replyToId,
    setReplyToId,
  };

  return <ChatContext.Provider value={Value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
