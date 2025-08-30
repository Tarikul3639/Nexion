import { usePanel } from "@/context/PanelContext";
import ChatHeader from "./ChatHeader";
import { ChatProvider } from "@/context/ChatContext";
import { ChatItem } from "@/types/chat";
import InputBar from "./InputBar/index";

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
        <div className="flex-1 overflow-y-auto p-4 bg-white/5">HI</div>
        <InputBar />
      </ChatProvider>
    </div>
  );
}
