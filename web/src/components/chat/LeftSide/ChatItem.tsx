"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LastMessagePreview from "./LastMessagePreview"
import type { ISearchResult, IPartnerDetails } from "./types"
import { usePartnerDetails } from "./hooks/usePartnerDetails"
import { usePanel } from "@/context/PanelContext"

export default function ChatItem({ chat }: { chat: ISearchResult }) {
  const { selectedConversation, setSelectedConversation } = usePanel();
  const lastMsg = chat.lastMessage;

  // 1. Get the partner's display details if it's a direct conversation (and exists)
  // 🚨 Note: You must implement a proper `usePartnerDetails` in your app.
  const partnerDetails: IPartnerDetails | null = usePartnerDetails(chat);

  // 2. Determine the final display name and avatar
  const displayName = partnerDetails?.name || chat.name;
  const displayAvatar = partnerDetails?.avatar || chat.avatar;
  
  // 3. Determine the status. For direct chats (conversations), 
  // we want the partner's status. For 'user' results, chat.status is already the user's status.
  // For group chats, there is no single "status," so status will likely be undefined.
  const displayStatus = partnerDetails?.status || chat.status;

  // 4. Check if this chat is the active one
  const isActive = selectedConversation?.id === chat.id;

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
      onClick={() => setSelectedConversation({id:chat.id, type:chat.displayType})}
    >
      {/* Avatar with enhanced styling */}
      <div className="relative flex-shrink-0">
        <div
          className={`
          transition-transform duration-200
          ${isActive ? "scale-105" : "group-hover:scale-105"}
        `}
        >
          <Avatar className="w-12 h-12 rounded-lg transition-colors">
            <AvatarImage src={displayAvatar || "/placeholder.svg"} alt={displayName} />
            <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600 to-purple-800">
              <span className="font-semibold text-white text-sm">{displayName?.slice(0, 2).toUpperCase() ?? "NA"}</span>
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Online status indicator */}
          <div
            className={`
            absolute -bottom-0.5 -right-0.5 flex items-center justify-center
            h-3.5 w-3.5 border-1 rounded-full shadow-md transition-all duration-200
            ${
              displayStatus === "online"
                ? "bg-green-500 shadow-green-500/40 border-green-900"
                : displayStatus === "away"
                  ? "bg-amber-500 shadow-amber-500/40 border-amber-900"
                  : displayStatus === "busy"
                    ? "bg-rose-500 shadow-rose-500/40 border-rose-900"
                    : "bg-neutral-500 shadow-neutral-500/40 border-neutral-900"
            }
          `}
          />
      </div>

      {/* Chat info section */}
      <div className="flex-1 min-w-0">
        {/* Header with name and time */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-base text-neutral-100 truncate capitalize group-hover:text-white transition-colors">
            {displayName}
          </h3>
          <span className="text-xs text-neutral-500 flex-shrink-0 group-hover:text-neutral-400 transition-colors font-medium">
            {lastMsg
              ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : ""}
          </span>
        </div>

        {/* Message preview */}
        <p className="text-xs text-neutral-400 truncate group-hover:text-neutral-300 transition-colors">
          {chat.isTyping ? (
            <span className="text-emerald-400 font-medium">{"Typing..."}</span>
          ) : (
            <LastMessagePreview message={lastMsg} />
          )}
        </p>
      </div>

      {/* Right side badges */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* New badge */}
        {chat.displayType === "user" && (
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

        {/* Unread count badge */}
        {(chat.unreadCount ?? 0) > 0 && (
          <div className="flex-shrink-0">
            <div
              className="
              w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-700
              rounded-full flex items-center justify-center
              shadow-lg shadow-purple-600/50 font-semibold text-white text-xs
              group-hover:shadow-purple-600/70 transition-shadow
            "
            >
              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
