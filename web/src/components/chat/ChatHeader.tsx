"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { ChatItem } from "@/types/chat";

export default function ChatHeader({
  selectedChat,
  setSelectedChat,
}: {
  selectedChat: ChatItem;
  setSelectedChat: (chat: ChatItem | null) => void;
}) {
  return (
    <Card className="w-full py-2 border-none shadow-none rounded-none bg-transparent">
      <CardHeader className="flex py-2 flex-row items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Back button [Only on mobile] */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden text-gray-300 hover:text-white hover:bg-[#323438]"
            onClick={() => setSelectedChat(null)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <Avatar className="w-10 md:w-12 h-10 md:h-12 rounded-lg flex-shrink-0">
            <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
            <AvatarFallback className="rounded-lg bg-white text-black">
              <span className="text-xl font-bold">
                {(selectedChat?.name || "NA").slice(0, 2).toUpperCase()}
              </span>
            </AvatarFallback>
          </Avatar>

          {/* Chat info */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <h3 className="text-lg md:text-xl font-semibold text-white truncate">
              {selectedChat.name}
            </h3>
            <div className="flex flex-col md:flex-row md:items-center text-xs text-gray-400 font-medium gap-1 md:gap-3 overflow-hidden">
              {selectedChat.participants && (
                <span className="truncate">
                  {selectedChat.participants} members
                </span>
              )}

              {selectedChat.status === "online" ? (
                <span className="text-green-500 truncate">Active now</span>
              ) : (
                <span className="text-gray-500 truncate">
                  {selectedChat.type === "single" && (
                    <span className="mr-1 text-gray-400">Offline</span>
                  )}
                  {selectedChat.lastActive ?? "Offline"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side with tooltips */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-[#323438]"
                >
                  <Phone className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice Call</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-[#323438]"
                >
                  <Video className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Video Call</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-[#323438]"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More Options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
    </Card>
  );
}
