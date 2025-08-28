"use client";
import React from "react";
import { Bot } from "@/types/bot";

interface BotListProps {
  bots: Bot[];
  selectedBot?: Bot;
  onSelectBot: (bot: Bot) => void;
}

export default function BotList({ bots, selectedBot, onSelectBot }: BotListProps) {
  return (
    <div className="w-full h-full overflow-auto">
      {bots.length === 0 && <p className="text-gray-500">No bots available</p>}
      {bots.map((bot) => (
        <div
          key={bot.id}
          onClick={() => onSelectBot(bot)}
          className={`p-2 cursor-pointer rounded hover:bg-gray-200 ${
            selectedBot?.id === bot.id ? "bg-gray-300 font-semibold" : ""
          }`}
        >
          {bot.name}
        </div>
      ))}
    </div>
  );
}
