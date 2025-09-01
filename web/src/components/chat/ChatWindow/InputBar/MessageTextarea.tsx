import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/context/ChatContext";

export default function MessageTextarea() {
  const { draftMessage, setDraftMessage } = useChat();

  return (
    <Textarea
      className="w-full text-gray-200 min-h-0 max-h-40 resize-none rounded-sm border border-gray-700 text-sm md:text-base leading-tight break-words overflow-wrap break-all"
      placeholder="Type your message..."
      value={draftMessage?.text || ""}
      onChange={(e) => setDraftMessage((prev)=>({...prev, text: e.target.value}))}
    />
  );
}
