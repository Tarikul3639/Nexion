"use client";

import React, { createContext, useContext, useState } from "react";
import { InputMessage } from "@/types/chat";
import { MessageItem } from "@/types/message";
import { messages as initialMessages } from "@/data/messages"; // initial dummy messages

interface ChatContextType {
  showAISuggestions: boolean;
  setShowAISuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  aiSuggestions: string[];
  setAISuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  onAISuggestion: (suggestion: string) => void;
  isRecordingActive: boolean;
  setIsRecordingActive: React.Dispatch<React.SetStateAction<boolean>>;
  message: InputMessage;
  setMessage: React.Dispatch<React.SetStateAction<InputMessage>>;
  messages: MessageItem[]; // ✅ full chat messages
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>; // ✅ updater
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const suggestion = ["AI Suggestion 1", "AI Suggestion 2", "AI Suggestion 3"];

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>(suggestion);
  const [isRecordingActive, setIsRecordingActive] = useState(false);

  // Input box state
  const [message, setMessage] = useState<InputMessage>({
    text: "",
    attachments: [],
  });

  // ✅ Full messages state
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);

  // AI Suggestion selection
  const onAISuggestion = (suggestion: string) => {
    setMessage((prev) => ({
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
    message,
    setMessage,
    messages,     // ✅ add here
    setMessages,  // ✅ add here
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
