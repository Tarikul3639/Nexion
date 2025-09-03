"use client";

import React from "react";
import ChatList from "@/components/chat/ChatList";
import ClassroomList from "@/components/classroom/ClassroomList";
import BotList from "@/components/bot/BotList";
import { ChatItem } from "@/types/chat";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";
import { usePanel } from "@/context/PanelContext";
import { useLeftPanelData } from "@/context/LeftPanelDataContext";

export default function LeftPanel() {
  const { activeTab, selectedChat, setSelectedChat } = usePanel();
  const { allChats, loading } = useLeftPanelData();

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center md:w-80 lg:w-96 bg-white/1 text-white">
        <p className="p-4 text-center">Loading...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        return (
          <ChatList
            allChats={allChats as ChatItem[]}
            selectedChat={selectedChat as ChatItem | undefined}
            onSelectChat={(chat) => setSelectedChat(chat as ChatItem)}
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

      default:
        return <div>Select a tab to see content</div>;
    }
  };

  return (
    <div className="w-full h-full md:w-80 lg:w-96">
      {renderContent()}
    </div>
  );
}
