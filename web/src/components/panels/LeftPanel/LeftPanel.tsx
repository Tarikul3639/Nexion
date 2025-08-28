"use client";

import React from "react";
import ChatList from "@/components/chat/ChatList";
import { pinnedChats, allChats } from "../../chat/sample";
import ClassroomList from "@/components/classroom/ClassroomList";
import BotList from "@/components/bot/BotList";
import { Chat } from "@/types/chat.list";
import { Classroom } from "@/types/classroom";
import { Bot } from "@/types/bot";
import { usePanel } from "@/context/PanelContext";

export default function LeftPanel() {
  const { activeTab, selectedChat, setSelectedChat } = usePanel();

  const renderContent = () => {
    switch (activeTab) {
      case "chats":
        return (
          <ChatList
            pinnedChats={pinnedChats as Chat[]}
            allChats={allChats as Chat[]}
            selectedChat={selectedChat as Chat | undefined}
            onSelectChat={(chat) => setSelectedChat(chat as Chat)}
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
    <div className="w-full h-full md:w-80 lg:w-96 flex items-center justify-center">
      {renderContent()}
    </div>
  );
}
