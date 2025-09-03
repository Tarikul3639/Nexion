"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatTypeIcon from "./ChatTypeIcon";
import { IChatList } from "@/types/message/message.messageList";
import LastMessagePreview from "./LastMessagePreview";

export interface IChatListProps {
  chat: IChatList;
  isActive: boolean;
  onSelect: (chat: IChatList) => void;
}

export default function ChatItem({ chat, isActive, onSelect }: IChatListProps) {
  const lastMsg = chat.lastMessage;
  console.log("Last message:", lastMsg);
  return (
    <div
      className={`flex items-center md:px-2 py-3 cursor-pointer transition-colors duration-200 rounded-xl ${
        isActive ? "bg-[#323438]" : "hover:bg-[#323438] active:bg-[#1E1E1F]"
      }`}
      onClick={() => onSelect(chat)}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-12 h-12 rounded-lg">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="rounded-lg">
            <span className="text-[20px] font-extrabold">
              {chat.name?.slice(0, 2).toUpperCase() ?? "NA"}
            </span>
          </AvatarFallback>
        </Avatar>
        {chat.type !== "direct" && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#23C26C] text-center rounded-full flex items-center justify-center">
            <ChatTypeIcon type={chat.type} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 ml-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-base text-gray-100 truncate">
            {chat.name}
          </h3>
          <span className="text-xs text-[#8B8B90] flex-shrink-0 ml-2 uppercase">
            {lastMsg
              ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : ""}
          </span>
        </div>
        <p className="text-sm text-[#8B8B90] truncate">
          {chat.isTyping ? (
            <span className="text-[#23C26C]">Someone is typing...</span>
          ) : (
            <LastMessagePreview message={lastMsg} />
          )}
        </p>
      </div>

      {/* Unread Count */}
      {(chat.unreadCount ?? 0) > 0 && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-5 h-5 bg-[#614BFF] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {chat.unreadCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
