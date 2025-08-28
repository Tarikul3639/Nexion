"use client";
import React, { createContext, useContext, useState } from "react";
import { TabKey, TAB_KEYS } from "@/components/sidebar/navigationItems";

interface PanelContextProps {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
  selectedChat: string | null;
  setSelectedChat: (id: string | null) => void;
}

const PanelContext = createContext<PanelContextProps | undefined>(undefined);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.CHATS);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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
