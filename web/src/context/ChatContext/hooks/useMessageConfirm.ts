// src/context/hooks/useMessageConfirm.ts
import { useEffect, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { IMessage } from "@/types/message/indexs";

// Server-sent payload for confirmation
interface MessageConfirmPayload extends IMessage {
    tempId: string; // The ID sent by the client
}

/**
 * Custom hook to listen for the 'message:confirm' socket event 
 * and update the main messages list, replacing the tempId with the final ID.
 * * @param setAllMessages - State setter function for all messages.
 */
export const useMessageConfirm = (
    setAllMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
) => {
    const { socket } = useSocket();

    const handleMessageConfirm = useCallback(
        (confirmedMessage: MessageConfirmPayload) => {
            // console.log("Received message:confirm:", confirmedMessage);

            setAllMessages(prevMessages => {
                return prevMessages.map(msg => {
                    // Find the message using its temporary ID
                    if (msg.id === confirmedMessage.tempId) {
                        return {
                            ...msg,
                            // 1. Replace the tempId with the permanent database ID
                            id: confirmedMessage.id,
                            // 2. Update status to 'sent' (or 'confirmed')
                            deliveryStatus: "sent", 
                            // 3. Update server-generated timestamp
                            updatedAt: confirmedMessage.updatedAt,
                            // Include other confirmed fields if necessary
                        };
                    }
                    return msg;
                });
            });
        },
        [setAllMessages] 
    );

    useEffect(() => {
        if (!socket) return;
        
        socket.on("message:confirm", handleMessageConfirm);

        return () => {
            socket.off("message:confirm", handleMessageConfirm);
        };
    }, [socket, handleMessageConfirm]);
};