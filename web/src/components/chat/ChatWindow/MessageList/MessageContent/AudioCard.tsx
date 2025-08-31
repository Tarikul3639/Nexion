"use client";

import React from "react";
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AudioCardProps {
  audioSrc: string;
  duration?: string;
  status?: string; // e.g. "Delivered", "Seen"
}

export default function AudioCard({
  audioSrc,
  duration="00:00"
}: AudioCardProps) {
  if (!audioSrc) return null;
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className="flex items-start gap-2.5">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {isPlaying ? (
                <Button 
                variant="ghost" 
                className={`p-2 hover:bg-white/5 hover:text-white ${isPlaying ? 'text-white bg-white/5' : 'text-gray-400'}`} 
                onClick={() => setIsPlaying(false)}>
                    <Pause className="w-4 h-4" />
                </Button>
            ) : (
                <Button 
                 variant="ghost" 
                 className="p-2 bg-white/2 hover:bg-white/10 hover:text-white" 
                 onClick={() => setIsPlaying(true)}>
                    <Play className="w-4 h-4" />
                </Button>
            )}

            {/* Example bars */}
         <svg aria-hidden="true" className="w-[145px] md:w-[185px] md:h-[40px]" viewBox="0 0 185 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="17" width="3" height="6" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="7" y="15.5" width="3" height="9" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="21" y="6.5" width="3" height="27" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="14" y="6.5" width="3" height="27" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="28" y="3" width="3" height="34" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="35" y="3" width="3" height="34" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="42" y="5.5" width="3" height="29" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="49" y="10" width="3" height="20" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="56" y="13.5" width="3" height="13" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="63" y="16" width="3" height="8" rx="1.5" fill="#6B7280" className="dark:fill-white"/>
            <rect x="70" y="12.5" width="3" height="15" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="77" y="3" width="3" height="34" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="84" y="3" width="3" height="34" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="91" y="0.5" width="3" height="39" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="98" y="0.5" width="3" height="39" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="105" y="2" width="3" height="36" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="112" y="6.5" width="3" height="27" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="119" y="9" width="3" height="22" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="126" y="11.5" width="3" height="17" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="133" y="2" width="3" height="36" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="140" y="2" width="3" height="36" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="147" y="7" width="3" height="26" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="154" y="9" width="3" height="22" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="161" y="9" width="3" height="22" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="168" y="13.5" width="3" height="13" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="175" y="16" width="3" height="8" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="182" y="17.5" width="3" height="5" rx="1.5" fill="#E5E7EB" className="dark:fill-gray-500"/>
            <rect x="66" y="16" width="8" height="8" rx="4" fill="#1C64F2"/>
         </svg>

          {/* Duration */}
          <span className="inline-flex self-center items-center p-2 text-sm font-normal text-white">
            {duration}
          </span>
        </div>
    </div>
  );
}
