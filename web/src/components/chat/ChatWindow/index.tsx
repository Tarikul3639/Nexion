import { usePanel } from "@/context/PanelContext";
import ChatHeader from "./ChatTopBar";
import { ChatProvider } from "@/context/ChatContext";
import { ChatItem } from "@/types/chat";
import InputBar from "./InputBar/index";
import MessageList from "./MessageList";
import ReplyPreview from "./ReplayPreview";

export default function ChatContainer() {
  const { selectedChat, setSelectedChat } = usePanel();
  console.log(selectedChat);
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatProvider>
        <ChatHeader
          selectedChat={selectedChat as ChatItem}
          setSelectedChat={setSelectedChat}
        />
        <MessageList />
        <ReplyPreview />
        <InputBar />
      </ChatProvider>
    </div>
  );
}
