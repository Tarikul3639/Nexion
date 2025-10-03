import AttachmentDropdown from "./AttachmentDropdown";
import MessageTextarea from "./MessageTextarea";
import AISuggestionsToggleButton from "./AISuggestionsToggleButton";
import SendButton from "./SendButton";
import AISuggestions from "./AISuggestion";
import VoiceButton from "./VoiceRecorder";
import { useChat } from "@/context/ChatContext";

export default function InputBar() {
  const { isRecordingActive } = useChat();
  return (
    <div className="flex justify-center flex-col py-2 border-t border-neutral-800">
      <div className="flex items-end space-x-2 px-2">
        {!isRecordingActive && (
          <>
            <AttachmentDropdown />
            <MessageTextarea />
            <AISuggestionsToggleButton />
          </>
        )}
        <VoiceButton />
        <SendButton />
      </div>
      <AISuggestions />
    </div>
  );
}
