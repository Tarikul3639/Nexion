"use client";

import { BotMessageSquare } from "lucide-react";
import { ScaleLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-[#131313] relative overflow-hidden">
      <div className="relative z-10 text-center space-y-5 md:space-y-8">
        {/* Logo with pulsing dark-themed styling */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-10 md:w-12 h-10 md:h-12 p-1.5 md:p-2 bg-gradient-to-r from-indigo-700 to-violet-700 rounded-lg flex items-center justify-center shadow-lg shadow-black/50 ring-1 ring-white/10">
              <BotMessageSquare className="w-full h-full text-white" />
            </div>
            {/* Pulsing ring effect around logo */}
            <div className="absolute inset-0 w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-indigo-700 to-violet-700 rounded-sm animate-ping opacity-30" />
          </div>
        </div>
        {/* Loading spinner */}
        <div className="space-y-6">
          <div className="relative flex justify-center">
            <ScaleLoader color="#6c35ebd0" width={4} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
