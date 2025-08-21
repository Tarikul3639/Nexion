"use client";

import { BotMessageSquare } from "lucide-react";

interface WelcomeProps {
  userName?: string;
}

export default function Welcome({ userName }: WelcomeProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
          <BotMessageSquare className="w-8 md:w-12 h-8 md:h-12 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Welcome to ChatFly
        </h2>
        <p className="text-gray-600 mb-2 text-sm md:text-base">
          Select a conversation from the sidebar to start chatting with
          your classmates and teachers.
        </p>
        <p className="text-gray-600 text-sm md:text-base">{userName}</p>
      </div>
    </div>
  );
}