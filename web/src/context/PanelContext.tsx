"use client";
import React, { createContext, useContext, useState } from "react";
import { TabKey, TAB_KEYS } from "@/components/sidebar/navigationItems";
import { IChatList, IProfile } from "@/types/message/message.messageList";
import { Bot } from "@/types/bot";
import { Classroom } from "@/types/classroom";

interface PanelContextProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  selectedChat: IChatList | Classroom | Bot | null;
  setSelectedChat: (chat: IChatList | Classroom | Bot | null) => void;
  selectedProfile: IProfile | null;
  setSelectedProfile: (profile: IProfile | null) => void;
}

const PanelContext = createContext<PanelContextProps | undefined>(undefined);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.CHATS);
  const [selectedChat, setSelectedChat] = useState<IChatList | Classroom | Bot | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<IProfile | null>(null);
  
  return (
    <PanelContext.Provider
      value={{ activeTab, setActiveTab, selectedChat, setSelectedChat, selectedProfile, setSelectedProfile }}
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
