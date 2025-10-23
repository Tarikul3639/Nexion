import { useState, useCallback } from "react";
import { DraftMessage } from "@/types/message/indexs";

export function useChatAI() {
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([
    "AI Suggestion 1",
    "AI Suggestion 2",
    "AI Suggestion 3",
  ]);

  const onAISuggestion = useCallback((suggestion: string) => {

    console.log("Apply suggestion:", suggestion);
    setShowAISuggestions(false);
  }, []);

  return { showAISuggestions, aiSuggestions, onAISuggestion };
}
