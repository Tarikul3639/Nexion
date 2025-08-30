"use client";

import { BotMessageSquare } from "lucide-react";

interface WelcomeProps {
  userName?: string;
}

export default function Welcome({ userName }: WelcomeProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-900 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
          <div className="flex items-center justify-center text-white font-extrabold text-3xl">
            NX
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-2">
          Welcome to Nexion
        </h2>
        <p className="text-gray-400 mb-2 text-sm md:text-base">
          Select a conversation from the sidebar to start chatting with your
          friends or teachers.
        </p>
        <p className="text-gray-600 text-sm md:text-base">{userName}</p>
      </div>
    </div>
  );
}
