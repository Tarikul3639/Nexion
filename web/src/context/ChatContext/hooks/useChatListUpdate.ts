// src/context/hooks/useChatListUpdate.ts
"use client";

import { useCallback, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { ILastMessage, ISearchResult } from "@/types/message/types";
import { usePanel } from "@/context/PanelContext";

interface ChatListUpdate {
  conversationId: string;
  unreadCount: number;
  lastMessage?: ILastMessage | null;
  updatedAt: string;
}

/**
 * Custom hook for handling real-time 'conversation:update' socket events.
 * This hook updates the chat list when a conversation receives a new message
 * or when any of its properties change (e.g., unread count, last message, etc.).
 *
 * @param setConversations - The state setter function from ConversationProvider.
 */
export const useChatListUpdate = (
  setConversations: React.Dispatch<React.SetStateAction<ISearchResult[]>>
) => {
  const { socket } = useSocket();
  const { selectedConversation } = usePanel();

  /**
   * IMPORTANT:
   * The event handler is memoized using useCallback to prevent
   * unnecessary re-subscriptions when the component re-renders.
   */
  const handleConversationUpdate = useCallback(
    (update: ChatListUpdate) => {
      // console.log("Received conversation:update (Hook):", update);

      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === update.conversationId);

        if (index !== -1) {
          // Conversation found → update the last message and timestamp if available.
          const updatedList = [...prev];
          let updatedConv = { ...updatedList[index] };
          
          // Update unread count
          if(selectedConversation?.id === update.conversationId) {
            // If the updated conversation is currently selected, reset unread count to 0
            socket?.emit("conversation:read", { conversationId: update.conversationId });
          } else {
          updatedConv.unreadCount = update.unreadCount;
          }
          
          // Update last message and timestamp if provided
          if (update.lastMessage) {
            updatedConv.lastMessage = update.lastMessage;
            updatedConv.updatedAt = update.updatedAt; // Move conversation to the top.
          }

          updatedList[index] = updatedConv;

          // Sort by updatedAt to ensure the most recent conversations appear first.
          const sortedList = updatedList.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );

          return sortedList;
        }

        // Conversation not found → return the previous list unchanged.
        return prev;
      });
    },
    [setConversations , selectedConversation]
  );

  /**
   * IMPORTANT NOTE:
   * The socket listener is registered when the socket is available,
   * and properly cleaned up when the component unmounts or socket changes.
   */
  useEffect(() => {
    if (!socket) return;

    // Attach listener for 'conversation:update' event.
    socket.on("conversation:update", handleConversationUpdate);

    // Clean up listener on unmount or when dependencies change.
    return () => {
      socket.off("conversation:update", handleConversationUpdate);
    };
  }, [socket, handleConversationUpdate]);
};
