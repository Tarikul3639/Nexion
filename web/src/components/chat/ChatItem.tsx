import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatTypeIcon from "./ChatTypeIcon";
import { ChatItemProps } from "./type";

export default function ChatItem({
  chat,
  isActive = false,
  onSelect,
}: ChatItemProps) {
  return (
    <div
      className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 rounded-xl ${
        isActive ? "bg-[#323438]" : "hover:bg-[#323438] active:bg-[#1E1E1F]"
      }`}
      onClick={() => onSelect(chat)}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-10 md:w-12 h-10 md:h-12 rounded-lg">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="rounded-lg">
            <span className="text-xl font-semibold">
              {chat.name?.slice(0, 2).toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
        {chat.type !== "student" && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#23C26C] border-2 border-[#161616] rounded-full flex items-center justify-center">
            <ChatTypeIcon type={chat.type} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 ml-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm text-white truncate">
            {chat.name}
          </h3>
          <span className="text-xs text-[#8B8B90] flex-shrink-0 ml-2">
            {chat.timestamp}
          </span>
        </div>
        <p className="text-xs text-[#8B8B90] truncate">
          {chat.isTyping ? (
            <span className="text-[#23C26C]">Someone is typing...</span>
          ) : (
            chat.lastMessage
          )}
        </p>
      </div>

      {/* Unread Count */}
      {(chat.unreadCount ?? 0) > 0 && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-5 h-5 bg-[#614BFF] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {chat.unreadCount ?? 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
