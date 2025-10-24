// src/context/hooks/useNewMessage.ts (FIXED)
import { useEffect, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { usePanel } from "@/context/PanelContext";
import { IMessage } from "@/types/message/indexs";

interface NewMessagePayload extends IMessage {}

/**
 * Custom hook to listen for the 'message:new' socket event 
 * and update the main messages list.
 * * @param setAllMessages - State setter function from the ChatProvider.
 */
export const useNewMessage = (
    setAllMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
) => {
    const { socket } = useSocket();
    const { selectedConversation } = usePanel(); // Get the currently selected conversation

    const handleNewMessage = useCallback(
        (message: NewMessagePayload) => {
            console.log("Received new message via useNewMessage:", message);

            // CRITICAL FIX: Only update the list if the message belongs to the active conversation
            if (message.conversationId !== selectedConversation?.id) {
                console.log(
                    `Message for conversation ${message.conversationId} ignored. Current chat is ${selectedConversation?.id}`
                );
                // If the message is for another chat, we DO NOT add it to the chat window's message list.
                // The chat list update (conversation:update) handles the notification/badge.
                return; 
            }
            
            setAllMessages(prevMessages => {
                // Check for duplicates
                const exists = prevMessages.some(m => m.id === message.id);
                if (exists) {
                    console.warn("Duplicate message received, ignoring:", message.id);
                    return prevMessages;
                }

                // Append the new message to the list
                return [...prevMessages, message];
            });
        },
        [setAllMessages, selectedConversation] // selectedConversation must be a dependency
    );

    useEffect(() => {
        if (!socket) return;

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new", handleNewMessage);
        };
    }, [socket, handleNewMessage]);
};