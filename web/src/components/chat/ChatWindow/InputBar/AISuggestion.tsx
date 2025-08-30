"use client";

import { useRef } from "react";
import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { useChat } from "@/context/ChatContext";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function AISuggestions() {
  const ref = useRef<HTMLDivElement>(null);
  const {
    showAISuggestions,
    setShowAISuggestions,
    aiSuggestions,
    setAISuggestions,
    onAISuggestion,
  } = useChat();

  // use the reusable hook
  useClickOutside(ref, () => setShowAISuggestions(false), showAISuggestions);

  if (!showAISuggestions) return null;

  return (
    <div ref={ref} className="px-4 py-2">
      <div className="flex items-center space-x-2 mb-2">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-blue-600">
          AI Suggestions
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {aiSuggestions.length > 0 ? (
          aiSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onAISuggestion(suggestion);
                setShowAISuggestions(false);
              }}
              className="border border-gray-700 rounded-sm px-3 py-2 text-sm text-gray-200 hover:border-gray-500 transition-colors flex items-center space-x-2"
            >
              <span>{suggestion}</span>
              <div className="flex space-x-1">
                <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-green-500 cursor-pointer" />
                <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-red-500 cursor-pointer" />
              </div>
            </button>
          ))
        ) : (
          <div className="text-gray-500 text-sm">
            No AI suggestions available
          </div>
        )}
      </div>
    </div>
  );
}
