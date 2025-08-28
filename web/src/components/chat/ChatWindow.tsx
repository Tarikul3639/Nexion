import { usePanel } from "@/context/PanelContext";

export default function ChatWindow() {
  const { selectedChat, setSelectedChat } = usePanel();
  return (
    <div className="flex-1 h-full flex justify-center items-center text-gray-100">
      <h2>{selectedChat?.name}</h2>
      {/* Render chat details here */}
    </div>
  );
}
