import { Textarea } from "@/components/ui/textarea";
import AISuggestionsComponent from "./AISuggestion";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function ConversationFooter() {
  const { showAISuggestions, setShowAISuggestions } = useChat();
  return (
    <div className="flex flex-col py-2">
      <div className="flex space-x-2 px-2">
        <Textarea
          className="w-full text-gray-200 min-h-0 max-h-40 resize-none rounded-sm border border-gray-700"
          placeholder="Type your message..."
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAISuggestions(!showAISuggestions)}
          className={`h-8 px-2 rounded-sm transition-all ${
            showAISuggestions
              ? "text-blue-100 bg-[#323438] hover:bg-[#323480] hover:text-blue-200"
              : "text-gray-500 hover:bg-[#323438] hover:text-blue-100"
          }`}
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>
      <AISuggestionsComponent />
    </div>
  );
}
