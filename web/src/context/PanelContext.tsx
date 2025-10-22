"use client";

import React, { createContext, useContext, useState } from "react";
import { TabKey, TAB_KEYS } from "@/components/sidebar/navigationItems";
import { ProfileSection } from "@/components/profile/types";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";
import type { ISelectedChatHeader } from "@/types/message/types";

interface PanelContextProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  // State for active chat by its ID
  selectedConversation: ISelectedChatHeader | null;
  setSelectedConversation: (chat: ISelectedChatHeader | null) => void;
  // State for active search result profile, classroom, or bot
  activeProfile: ProfileSection | null;
  setActiveProfile: (profile: ProfileSection | null) => void;
  activeClassroom: Classroom | null;
  setActiveClassroom: (classroom: Classroom | null) => void;
  activeBot: Bot | null;
  setActiveBot: (bot: Bot | null) => void;
}

const PanelContext = createContext<PanelContextProps | undefined>(undefined);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from sidebar "Chat | Classroom | Bot | Profile" selection
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_KEYS.CHATS);
  // Initialize state for active chat, profile, classroom, and bot
  const [activeProfile, setActiveProfile] = useState<ProfileSection | null>(
    null
  );
  const [activeClassroom, setActiveClassroom] = useState<Classroom | null>(
    null
  );
  const [activeBot, setActiveBot] = useState<Bot | null>(null);

  // State for active chat by its ID
  const [selectedConversation, setSelectedConversation] = useState<ISelectedChatHeader | null>(null);

  return (
    <PanelContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedConversation,
        setSelectedConversation,
        activeProfile,
        setActiveProfile,
        activeClassroom,
        setActiveClassroom,
        activeBot,
        setActiveBot,
      }}
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
