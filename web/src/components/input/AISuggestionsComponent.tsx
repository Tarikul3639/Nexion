"use client";

import { useRef, useEffect } from "react";
import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";

interface AISuggestionsComponentProps {
  showAISuggestions: boolean;
  setShowAISuggestions: (show: boolean) => void;
  aiSuggestions: string[];
  onAISuggestion: (suggestion: string) => void;
}

export default function AISuggestionsComponent({
  showAISuggestions,
  setShowAISuggestions,
  aiSuggestions,
  onAISuggestion
}: AISuggestionsComponentProps) {
  const aiSuggestionsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close AI suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const node = event.target as Node;

      if (
        aiSuggestionsRef.current &&
        !aiSuggestionsRef.current.contains(node)
      ) {
        setShowAISuggestions(false);
      }
    };

    if (showAISuggestions) {
      document.addEventListener("mouseup", handleClickOutside);
      return () => {
        document.removeEventListener("mouseup", handleClickOutside);
      };
    }
  }, [showAISuggestions, setShowAISuggestions]);

  return (
    <>
      {/* AI Suggestions Bar */}
      {showAISuggestions && (
        <div
          ref={aiSuggestionsRef}
          className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              AI Suggestions
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.length > 0 ? (
              aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onAISuggestion(suggestion)}
                  className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors flex flex-center space-x-2"
                >
                  <span className="text-left">{suggestion}</span>
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
      )}
    </>
  );
}
