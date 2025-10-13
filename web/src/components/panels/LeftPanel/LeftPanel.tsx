"use client";

import React from "react";
import ChatList from "@/components/chat/LeftSide";
import ClassroomList from "@/components/classroom/ClassroomList";
import BotList from "@/components/bot/BotList";
import { IChatList } from "@/types/message/message.messageList";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";
import { usePanel } from "@/context/PanelContext";
import { useLeftPanelData } from "@/context/LeftPanelDataContext";
import { ProfileLeftPanel } from "@/components/profile/LeftPanel";

export default function LeftPanel() {
  const { activeTab, selectedChat, setSelectedChat, selectedProfile, setSelectedProfile } = usePanel();
  const { allChats, loading } = useLeftPanelData();

  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        return (
          <ChatList
            allChats={allChats as IChatList[]}
            selectedChat={selectedChat as IChatList | undefined}
            onSelectChat={(chat) => setSelectedChat(chat as IChatList)}
            isLoading={loading as boolean}
          />
        );

      case "classroom":
        return (
          <ClassroomList
            classrooms={[] /* replace with classroom data */}
            selectedClassroom={selectedChat as Classroom | undefined}
            onSelectClassroom={(cls) => setSelectedChat(cls as Classroom)}
          />
        );

      case "bots":
        return (
          <BotList
            bots={[] /* replace with bot data */}
            selectedBot={selectedChat as Bot | undefined}
            onSelectBot={(bot) => setSelectedChat(bot as Bot)}
          />
        );

      case "profile":
        return (
          <ProfileLeftPanel
            activeSection={selectedProfile ? (selectedProfile.tabName as any) : "general"}
            onSectionChange={(section) => setSelectedProfile({ tabName: section })}
          />
        );

      default:
        return <div>Select a tab to see content</div>;
    }
  };

  return <div className="w-full h-full md:w-80 lg:w-96">{renderContent()}</div>;
}
