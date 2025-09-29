import ChatHeader from "./ChatTopBar";
import { ChatProvider } from "@/context/ChatContext";
import InputBar from "./InputBar/index";
import MessageList from "./MessageList";
import ReplyPreview from "./ReplayPreview";
import ImagePreview from "./ImagePreview";

export default function ChatContainer() {
  return (
    <div className="flex-1 flex flex-col h-full ">
      <ChatProvider>
        <ChatHeader />
        <MessageList />
        <ImagePreview />
        <ReplyPreview />
        <InputBar />
      </ChatProvider>
    </div>
  );
}
