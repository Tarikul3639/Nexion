"use client";
import React, { createContext, useContext, useState } from "react";
import { TabKey, TAB_KEYS } from "@/components/sidebar/navigationItems";
import { Chat } from "@/types/chat.list";

interface PanelContextProps {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
}

const PanelContext = createContext<PanelContextProps | undefined>(undefined);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.CHATS);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <PanelContext.Provider
      value={{ activeTab, setActiveTab, selectedChat, setSelectedChat }}
    >
      {children}
    </PanelContext.Provider>
  );
}

export function usePanel() {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("usePanel must be used inside PanelProvider");
  return ctx;
}
