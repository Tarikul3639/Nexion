// src/context/hooks/useUserStatusUpdate.ts
"use client";

import { useCallback, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { ISearchResult } from "@/types/message/types";
import { usePanel } from "@/context/PanelContext";
import type { ISelectedChatHeader } from "@/types/message/types";

interface UserStatusUpdate {
  userId: string;
  status: "online" | "offline" | "away" | "busy" | string;
  /**
   * Optional timestamp from the server when the user last went offline.
   * Used to display "last active" information.
   */
  lastActiveAt?: string | null;
}

/**
 * Custom hook for handling real-time 'user:status' socket events.
 * This updates the user’s presence (online/offline/away/busy)
 * across all direct conversations in the chat list.
 *
 * @param setConversations - The state setter function from ConversationProvider.
 */
export const useUserStatusUpdate = (
  setConversations: React.Dispatch<React.SetStateAction<ISearchResult[]>>
) => {
  const { socket } = useSocket();
  const { selectedConversation, setSelectedConversation } = usePanel();

  /**
   * IMPORTANT NOTE:
   * Memoized event handler to prevent re-creation on each render.
   * Updates only direct conversations related to the affected user.
   */
  const handleUserOffline = useCallback(
    (update: UserStatusUpdate) => {
      // console.log(
      //   `Received user:status update (Hook) for ${update.userId}: ${update.status}`
      // );

      setConversations((prev) => {
        return prev.map((conv) => {
          // Applies only to direct conversations where the user is the partner.
          if (conv.type === "direct" && conv.partnerId === update.userId) {
            const updatedConv = { ...conv };

            // 1. Update partner status fields for UI reflection.
            updatedConv.partnerStatus = update.status;
            updatedConv.status = update.status;

            // 2. If user went offline, update lastActiveAt timestamp.
            if (update.status === "offline" && update.lastActiveAt) {
              updatedConv.lastActiveAt = new Date(update.lastActiveAt);
            }

            return updatedConv;
          }

          return conv;
        });
      });

      //NOTE: When user goes offline, we update For right Panel
      setSelectedConversation((prev) => {
        if (prev && prev.partnerId === update.userId) {
          return {
            ...prev,
            status: "offline",
            lastActiveAt: update.lastActiveAt
              ? new Date(update.lastActiveAt)
              : null,
          };
        }
        return prev;
      });
    },
    [setConversations, setSelectedConversation]
  );

  const handleUserOnline = useCallback(
    (update: UserStatusUpdate) => {
      // console.log(
      //   `Received user:status update (Hook) for ${update.userId}: ${update.status}`
      // );

      setConversations((prev) => {
        return prev.map((conv) => {
          // Applies only to direct conversations where the user is the partner.
          if (conv.type === "direct" && conv.partnerId === update.userId) {
            const updatedConv = { ...conv };

            // 1. Update partner status fields for UI reflection.
            updatedConv.partnerStatus = update.status;
            updatedConv.status = update.status;

            return updatedConv;
          }

          return conv;
        });
      });

      //NOTE: When user comes online, we do not update For right Panel
      setSelectedConversation((prev) => {
        if (prev && prev.partnerId === update.userId) {
          return {
            ...prev,
            status: "online",
          };
        }
        return prev;
      });
    },
    [setConversations, setSelectedConversation]
  );

  /**
   * IMPORTANT NOTE:
   * Adds and removes the socket listener for 'user:status' events.
   * Ensures proper cleanup to avoid duplicate listeners.
   */
  useEffect(() => {
    if (!socket) return;

    // Attach listener for real-time user status updates.
    socket.on("user:offline", handleUserOffline);
    socket.on("user:online", handleUserOnline);

    // Clean up listener on unmount or when dependencies change.
    return () => {
      socket.off("user:offline", handleUserOffline);
      socket.off("user:online", handleUserOnline);
    };
  }, [socket, handleUserOffline, handleUserOnline]);
};
