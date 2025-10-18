"use client";

import React from "react";

// Components
import ClassroomList from "@/components/classroom/ClassroomList";
import ChatList from "@/components/chat/LeftSide";
import BotList from "@/components/bot/BotList";
import { ProfileLeftPanel } from "@/components/profile/LeftPanel";

// Contexts
import { usePanel } from "@/context/PanelContext";

// Types
import type { ProfileSection } from "@/components/profile/types";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";

export default function LeftPanel() {
  // Extract active states and their setters from the panel context
  const {
    activeTab,
    activeProfile,
    setActiveProfile,
    activeClassroom,
    setActiveClassroom,
    activeBot,
    setActiveBot,
  } = usePanel();

  // Renders the panel content depending on which tab is active
  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        return (
          <ChatList/>
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
