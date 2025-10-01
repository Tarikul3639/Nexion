"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IChatList } from "@/types/message/message.messageList";
import LastMessagePreview from "./LastMessagePreview";
import { useAuth } from "@/context/AuthContext";

export interface IChatListProps {
  chat: IChatList;
  isActive: boolean;
  onSelect: (chat: IChatList) => void;
}

export default function ChatItem({ chat, isActive, onSelect }: IChatListProps) {
  const { user } = useAuth();
  const lastMsg = chat.lastMessage;
  const avatar = chat.avatar;
  const type = chat.type;
  const status =
    chat.participants && chat.participants.length && user
      ? chat.participants.find((p) => p._id !== user.id)?.status
      : undefined;
  return (
    <div
      className={`flex items-center md:px-2.5 py-2.5 cursor-pointer transition-colors duration-200 rounded-xl ${
        isActive ? "bg-[#323438]" : "hover:bg-[#323438] active:bg-[#1E1E1F]"
      }`}
      onClick={() => onSelect(chat)}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-12 h-12 rounded-lg">
          <AvatarImage src={avatar} alt={chat.name} />
          <AvatarFallback className="rounded-lg">
            <span className="text-[20px] font-extrabold">
              {chat.name?.slice(0, 2).toUpperCase() ?? "NA"}
            </span>
          </AvatarFallback>
        </Avatar>

        {status && (
          <span
            className={`absolute -bottom-1 -right-1 flex items-center justify-center text-white font-bold h-4 w-4 text-[10px] uppercase rounded-full leading-none
              ${
                status === "online"
                  ? "bg-[#23C26C]"
                  : status === "away"
                  ? "bg-yellow-500"
                  : status === "busy"
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
          >
            {type.slice(0, 1).toUpperCase()}
          </span>
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
