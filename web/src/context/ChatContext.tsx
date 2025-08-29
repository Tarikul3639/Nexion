"use client";

import React, { createContext, useContext, useState } from "react";

interface ChatContextType {
  showAISuggestions: boolean;
  setShowAISuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  aiSuggestions: string[];
  setAISuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  onAISuggestion: (suggestion: string) => void;
  isRecordingActive: boolean;
  setIsRecordingActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const suggestion = [
    "AI Suggestion 1",
    "AI Suggestion 2",
    "AI Suggestion 3"
]

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>(suggestion);
  const [isRecordingActive, setIsRecordingActive] = useState(false);

  const onAISuggestion = (suggestion: string) => {
    console.log("AI suggestion applied:", suggestion);
    setShowAISuggestions(false); 
  };

  const Value: ChatContextType = {
    showAISuggestions,
    setShowAISuggestions,
    aiSuggestions,
    setAISuggestions,
    onAISuggestion,
    isRecordingActive,
    setIsRecordingActive
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
