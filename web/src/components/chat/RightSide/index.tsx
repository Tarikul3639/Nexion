import ChatHeader from "./ChatTopBar";
import InputBar from "./InputBar/index";
import MessageList from "./MessageList";
import ReplyPreview from "./ReplayPreview";
import ImagePreview from "./ImagePreview";

export default function ChatContainer() {
  return (
    <div className="flex-1 flex flex-col h-full ">
      <ChatHeader />
      <MessageList />
      <ImagePreview />
      <ReplyPreview />
      <InputBar />
    </div>
  );
}
