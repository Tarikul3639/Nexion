"use client";

import React from "react";

// Components
import ClassroomList from "@/components/classroom/ClassroomList";
import ChatList from "@/components/chat/LeftSide";
import BotList from "@/components/bot/BotList";
import { ProfileLeftPanel } from "@/components/profile/LeftPanel";

// Contexts
import { usePanel } from "@/context/PanelContext";
import { useLeftPanelData } from "@/context/LeftPanelDataContext";

// Types
import type { ProfileSection } from "@/components/profile/types";
import { Classroom } from "@/types/classroom";
import { IChatList } from "@/types/message";
import { Bot } from "@/types/bot";

export default function LeftPanel() {
  // Extract active states and their setters from the panel context
  const {
    activeTab,
    activeChat,
    setActiveChat,
    activeProfile,
    setActiveProfile,
    activeClassroom,
    setActiveClassroom,
    activeBot,
    setActiveBot,
  } = usePanel();

  // Fetch left panel data such as chat lists
  const { allChats, loading } = useLeftPanelData();

  // Renders the panel content depending on which tab is active
  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        return (
          <ChatList
            allChats={allChats as IChatList[]}
            selectedChat={activeChat as IChatList | undefined}
            onSelectChat={(chat) => setActiveChat(chat as IChatList)}
            isLoading={loading as boolean}
          />
        );

      case "classroom":
        return (
          <ClassroomList
            classrooms={[]}
            selectedClassroom={activeClassroom as Classroom | undefined}
            onSelectClassroom={(cls) => setActiveClassroom(cls as Classroom)}
          />
        );

      case "bots":
        return (
          <BotList
            bots={[]}
            selectedBot={activeBot as Bot | undefined}
            onSelectBot={(bot) => setActiveBot(bot as Bot)}
          />
        );

      case "profile":
        return (
          <ProfileLeftPanel
            activeSection={activeProfile as ProfileSection | undefined}
            onSectionChange={(section: ProfileSection) =>
              setActiveProfile(section)
            }
          />
        );

      default:
        return <div>Select a tab to see content</div>;
    }
  };

  // Main container that renders left panel content
  return <div className="w-full h-full md:w-80 lg:w-96">{renderContent()}</div>;
}
