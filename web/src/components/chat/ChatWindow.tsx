import { usePanel } from "@/context/PanelContext";
import ChatHeader from "./ChatHeader";
import { Chat } from "@/types/chat.list";

export default function ChatWindow() {
  const { selectedChat, setSelectedChat } = usePanel();
  console.log(selectedChat);
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader selectedChat={selectedChat as Chat} setSelectedChat={setSelectedChat} />
    </div>
  );
}
