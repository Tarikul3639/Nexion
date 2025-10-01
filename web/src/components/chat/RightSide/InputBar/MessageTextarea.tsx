import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/context/ChatContext";
import { useRef, useEffect } from "react";

export default function MessageTextarea() {
  const { draftMessage, setDraftMessage, replyToId } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyToId && textareaRef.current) {
      const timeout = setTimeout(() => {
        textareaRef.current!.focus();
        const length = textareaRef.current!.value.length;
        textareaRef.current!.setSelectionRange(length, length);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [replyToId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent new line
      const sendBtn = document.getElementById("send-btn");
      sendBtn?.click(); // trigger send button click
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      className="w-full text-gray-200 min-h-0 max-h-40 resize-none rounded-sm border border-gray-700 text-sm md:text-base leading-tight break-words overflow-wrap break-all"
      placeholder="Type your message..."
      value={draftMessage?.text || ""}
      onKeyDown={handleKeyDown}
      onChange={(e) =>
        setDraftMessage((prev) => ({ ...prev, text: e.target.value }))
      }
    />
  );
}
