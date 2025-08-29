import { usePanel } from "@/context/PanelContext";
import ConversationHeader from "../ChatHeader/ConversationHeader";
import ConversationFooter from "../InputBar/index";
import { ChatProvider } from "@/context/ChatContext";
import { ChatItem } from "@/types/chat";

export default function ChatWindow() {
  const { selectedChat, setSelectedChat } = usePanel();
  console.log(selectedChat);
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatProvider>
        <ConversationHeader
          selectedChat={selectedChat as ChatItem}
          setSelectedChat={setSelectedChat}
        />
        <div className="flex-1 overflow-y-auto p-4 bg-white/5">HI</div>
        <ConversationFooter />
      </ChatProvider>
    </div>
  );
}
