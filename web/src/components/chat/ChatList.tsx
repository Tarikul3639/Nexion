"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import Loading from "../ui/loading";

export interface Chat {
  _id: string;
  username: string;
  type?: "personal" | "group" | "classroom" | "unknown";
  avatar?: string;
  online?: boolean;
  members?: number;
  unread?: number;
  timestamp?: string;
}

export interface Message {
  content: string;
  sender?: { username: string };
  createdAt?: string;
}

export interface ChatWithMessages extends Chat {
  lastMessage?: Message;
  participants?: any[]; // for members count
}

interface ChatListProps {
  onChatSelect?: (chat: ChatWithMessages) => void;
  selectedChatId?: string;
}

export default function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const [chatList, setChatList] = useState<ChatWithMessages[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  // 🔹 Load chat list
  useEffect(() => {
    if (!socket) return;

    setLoading(true);

    socket.on("chatList", (conversations: ChatWithMessages[]) => {
      setChatList(
        conversations.map((chat) => ({
          ...chat,
          timestamp: chat.lastMessage?.createdAt,
          members: chat.participants?.length ?? 0,
        }))
      );
      setLoading(false);
    });

    socket.on("chatListError", (msg: string) => {
      console.error(msg);
      setLoading(false);
    });

    socket.emit("getChatList");

    return () => {
      socket.off("chatList");
      socket.off("chatListError");
    };
  }, [socket]);

  // 🔹 Search handler
  const handleSearching = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setLoading(true);

    if (!e.target.value) {
      socket?.emit("getChatList");
    } else {
      socket?.emit("searchChats", e.target.value);
      socket?.once("searchChatsResult", (results: ChatWithMessages[]) => {
        setChatList(results);
        setLoading(false);
      });
    }
  };

  // 🔹 Chat click handler
  const handleChatClick = (chat: ChatWithMessages) => {
    if (onChatSelect) onChatSelect(chat); // parent handles navigation
  };

  const filteredChats = chatList.filter(chat =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-[calc(100dvh-4rem)] sm:h-[calc(100dvh)]">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Chats</h2>
          <Button size="icon" variant="ghost" className="text-gray-500">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-gray-100 border-0 focus:bg-white focus-visible:ring-2"
            value={searchQuery}
            onChange={handleSearching}
          />
        </div>
      </div>

      {/* Chat list / Loading */}
      <div className="flex-1 overflow-y-auto p-1">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <div
              key={chat._id}
              onClick={() => handleChatClick(chat)}
              className={`p-3 border-b border-gray-100 rounded-md cursor-pointer hover:bg-blue-100 transition-colors touch-manipulation ${
                selectedChatId === chat._id ? "border-l-4 bg-blue-100 border-x-blue-500" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 md:w-12 h-10 md:h-12 font-semibold text-base">
                  <AvatarFallback
                    className={`${
                      chat.type === "classroom" ? "bg-blue-100 text-blue-600" :
                      chat.type === "group" ? "bg-green-100 text-green-600" :
                      "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {chat.avatar ?? chat.username[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate text-sm md:text-base">
                      {chat.username}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {chat.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs md:text-sm text-gray-600 truncate pr-2">
                      {chat.lastMessage && `${chat.lastMessage.sender?.username}: ${chat.lastMessage.content}`}
                    </p>
                    {chat.unread && chat.unread > 1 && (
                      <Badge className="bg-blue-500 text-white text-xs min-w-[18px] md:min-w-[20px] h-4 md:h-5 flex items-center justify-center flex-shrink-0">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                  {chat.members && (
                    <p className="text-xs text-gray-400 mt-1">{chat.members} members</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No chats found</p>
        )}
      </div>
    </div>
  );
}
