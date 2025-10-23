import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { usePanel } from "@/context/PanelContext";
import { IMessage } from "@/types/message/indexs";
import { getMessages } from "./getMessages";

export function useChatMessages() {
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);
  const { socket } = useSocket();
  const { selectedConversation } = usePanel();
  const { fetchInitialMessages } = getMessages();

  useEffect(() => {
    const chatId = selectedConversation?.id;
    if (!chatId || !socket) return;

    const loadMessages = async () => {
      const data = await fetchInitialMessages(50, 0);
      if (data) setAllMessages(data.messages);
      // Mark conversation as read
      socket.emit("conversation:read", { conversationId: chatId });
    };
    
    // Initial message load
    loadMessages();
  }, [socket, selectedConversation?.id]);

  return { allMessages, setAllMessages };
}
