"use client";

import { BotMessageSquare } from "lucide-react";
import { ScaleLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 relative overflow-hidden">
      <div className="relative z-10 text-center space-y-5 md:space-y-8">
        {/* Logo with enhanced styling */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-10 md:w-12 h-10 md:h-12 p-1.5 md:p-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <BotMessageSquare className="w-full h-full text-white" />
            </div>
            {/* Pulsing ring effect around logo */}
            <div className="absolute inset-0 w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg animate-ping opacity-20" />
          </div>
        </div>
        {/* Enhanced loading content */}
        <div className="space-y-6">
          {/* Modern spinner with multiple rings */}
          <div className="relative flex justify-center">
            <ScaleLoader color="#3B82F6" width={3} height={12} />
          </div>
        </div>
      </div>
    </div>
  );
}