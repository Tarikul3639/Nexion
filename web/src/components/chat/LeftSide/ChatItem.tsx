"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LastMessagePreview from "./LastMessagePreview";
import type {
  ISearchResult,
  ILastMessage,
  ISelectedChatHeader,
} from "@/types/message/types";
import { usePanel } from "@/context/PanelContext";
import { useSocket } from "@/context/SocketContext";

export default function ChatItem({
  conversation,
}: {
  conversation: ISearchResult;
}) {
  // IMPORTANT: Access the current selected conversation and setter from context
  const { selectedConversation, setSelectedConversation } = usePanel();
  const { socket } = useSocket();

  // INFO: Basic display properties for this chat item
  const status = conversation.status;
  const name = conversation.name as string;
  const avatar = conversation.avatar as string;
  const unread = conversation.unreadCount;

  // INFO: Last message preview
  const lastMessage: ILastMessage | null = conversation.lastMessage;

  // IMPORTANT: Check if this item is a 'user' type (for New badge)
  const isUser = conversation.displayType === "user";

  // INFO: Determine if this conversation is currently active/selected
  const isActive = selectedConversation?.id === conversation.id;

  // Handler for clicking on this chat item
  const handleChatClick = () => {
    // Set this conversation as the selected one in context
    setSelectedConversation({
      id: conversation.id,
      type: conversation.displayType,
      name: name,
      avatar: avatar,
      status: status,
      lastActiveAt: conversation.lastActiveAt,
    } as ISelectedChatHeader);

    // NOTE: Emit 'conversation:read' event if there are unread messages
    if (socket && conversation.unreadCount > 0) {
      console.log(`Sending conversation:read for ${conversation.id}`);
      conversation.unreadCount = 0; // Optimistically update unread count
      socket.emit("conversation:read", { conversationId: conversation.id });
    }
  };

  return (
    <div
      className={`
        group relative flex items-center gap-3 px-2.5 py-2.5 cursor-pointer
        transition-all duration-200 ease-out rounded-sm
        ${
          isActive
            ? "bg-blue-500/10 border border-blue-500/40 shadow-lg shadow-purple-500/10"
            : "hover:bg-zinc-800/60 border border-transparent hover:border-neutral-700/50"
        }
      `}
      onClick={handleChatClick}
    >
      {/* Avatar Section */}
      <div className="relative flex-shrink-0">
        {/* Avatar scaling animation */}
        <div
          className={`transition-transform duration-200 ${
            isActive ? "scale-105" : "group-hover:scale-105"
          }`}
        >
          <Avatar className="w-12 h-12 rounded-lg transition-colors">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600 to-purple-800">
              <span className="font-semibold text-white text-sm">
                {name?.slice(0, 2).toUpperCase() ?? "NA"}
              </span>
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Online/Status Indicator */}
        <div
          className={`
            absolute -bottom-0.5 -right-0.5 flex items-center justify-center
            h-3.5 w-3.5 border-1 rounded-full shadow-md transition-all duration-200
            ${
              status === "online"
                ? "bg-green-500 shadow-green-500/40 border-green-900"
                : status === "away"
                ? "bg-amber-500 shadow-amber-500/40 border-amber-900"
                : status === "busy"
                ? "bg-rose-500 shadow-rose-500/40 border-rose-900"
                : "bg-neutral-500 shadow-neutral-500/40 border-neutral-900"
            }
          `}
        />
      </div>

      {/* Chat Information Section */}
      <div className="flex-1 min-w-0">
        {/* Header: Name + Last Message Time */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-base text-neutral-100 truncate capitalize group-hover:text-white transition-colors">
            {name}
          </h3>
          <span className="text-xs text-neutral-500 flex-shrink-0 group-hover:text-neutral-400 transition-colors font-medium uppercase">
            {lastMessage
              ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : ""}
          </span>
        </div>

        {/* Last message preview / Typing indicator */}
        <p className={`text-xs ${unread > 0 ? "text-slate-300" : "text-neutral-400"} transition-colors`}>
          {conversation.isTyping ? (
            <span className="text-emerald-400 font-medium">{"Typing..."}</span>
          ) : (
            <LastMessagePreview message={lastMessage} unread={unread} />
          )}
        </p>
      </div>

      {/* Right Side Badges */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* New badge for 'user' type conversations */}
        {isUser && (
          <div className="animate-pulse">
            <span
              className="
                text-[9px] font-semibold px-2 capitalize py-0.5
                rounded-full bg-emerald-500/15
                text-emerald-300 border border-emerald-500/40
                tracking-wider shadow-sm hover:shadow-emerald-500/20 transition-shadow
              "
            >
              New
            </span>
          </div>
        )}

        {/* Unread messages badge */}
        {(unread ?? 0) > 0 && (
          <div className="flex-shrink-0">
            <div
              className="
                w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-700
                rounded-full flex items-center justify-center
                shadow-lg shadow-purple-600/50 font-semibold text-white text-xs
                group-hover:shadow-purple-600/70 transition-shadow
              "
            >
              {unread > 99 ? "99+" : unread}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
