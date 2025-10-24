// ChatInfo.tsx (Final & Error-Free Version)
"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ISelectedChatHeader } from "@/types/message/types";

// Helper function to format date/time dynamically (like Messenger)
const formatLastActive = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // 1. Less than a minute ago
    if (diffInSeconds < 60) {
        return "just now";
    }
    // 2. Less than an hour ago
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // 3. Today (e.g., "today at 10:30 AM")
    if (date.toDateString() === now.toDateString()) {
        return `today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    // 4. Yesterday (e.g., "yesterday at 10:30 AM")
    if (date.toDateString() === yesterday.toDateString()) {
        return `yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    }

    // 5. Default (e.g., "on 12/25/2024")
    return `on ${date.toLocaleDateString()}`;
};


export default function ChatInfo({ User }: { User: ISelectedChatHeader }) {

    // 1. Data Processing
    const status = User.status;
    // Ensures User.lastActiveAt (string) is converted to a Date object safely.
    const lastActiveDate = User.lastActiveAt 
        ? new Date(User.lastActiveAt) 
        : null;

    // 2. Determine Display Message
    let displayMessage = '';
    let statusClassName = 'text-gray-400 text-xs font-medium cursor-pointer';

    if (status === 'online') {
        displayMessage = 'Online';
        statusClassName = 'text-green-500 text-xs font-medium cursor-pointer capitalize';
    } else if (lastActiveDate) {
        const formattedTime = formatLastActive(lastActiveDate);
        displayMessage = `Last active ${formattedTime}`;
        statusClassName = 'text-gray-400 text-xs font-medium cursor-pointer';
    } else if (status) {
        // Fallback for 'away', 'busy', etc.
        displayMessage = status;
        statusClassName = 'text-gray-400 text-xs font-medium cursor-pointer capitalize';
    }


    return (
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <h3 className="text-lg md:text-xl font-semibold text-white truncate capitalize">{User.name}</h3>
            <Tooltip>
                <TooltipTrigger asChild>
                    {/* FIX: This is the single required child element for TooltipTrigger */}
                    {/* We ensure that only a single <span> element is rendered here */}
                    {displayMessage ? (
                         <span className={statusClassName}>
                            {displayMessage}
                        </span>
                    ) : (
                        // Render an empty span if no message exists to satisfy the single child requirement,
                        // or better, just ensure displayMessage always has a value if status is defined.
                        <span className={statusClassName}>
                           {status && status.toUpperCase()}
                        </span>
                    )}
                </TooltipTrigger>
                <TooltipContent className="text-white text-sm">{User.status}</TooltipContent>
            </Tooltip>
        </div>
    );
}