import AttachmentDropdown from "./AttachmentDropdown";
import MessageTextarea from "./MessageTextarea";
import AISuggestionsToggleButton from "./AISuggestionsToggleButton";
import SendButton from "./SendButton";
import AISuggestions from "./AISuggestion";

export default function ConversationFooter() {
  return (
    <div className="flex justify-center flex-col py-2">
      <div className="flex items-end space-x-2 px-2">
        <AttachmentDropdown />
        <MessageTextarea />
        <AISuggestionsToggleButton />
        <SendButton />
      </div>
      <AISuggestions />
    </div>
  );
}
