// src/context/hooks/useMessageDelivery.ts
import { useEffect, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { IMessage } from "@/types/message/indexs";

/**
 * Payload structure for the 'message:delivered' event received from the server.
 */
interface DeliveryUpdatePayload {
  /** The unique database ID of the message */
  id: string;

  /** The updated delivery status (e.g., 'delivered') */
  deliveryStatus: IMessage["deliveryStatus"];
}

/**
 * Custom hook for handling the 'message:delivered' socket event.
 * This updates the delivery status of messages on the sender's UI
 * when the server confirms successful delivery.
 *
 * @param setAllMessages - State setter function used to update message list.
 */
export const useMessageDelivery = (
  setAllMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
) => {
  const { socket } = useSocket();

  /**
   * IMPORTANT NOTE:
   * Memoized handler to efficiently update the message state
   * whenever a 'message:delivered' event is received.
   */
  const handleMessageDelivered = useCallback(
    (data: DeliveryUpdatePayload) => {
      console.log("Received message:delivered (UI Update):", data);

      setAllMessages((prevMessages) => {
        return prevMessages.map((msg) => {
          // Find the message by its original database ID
          if (msg.id === data.id) {
            // Update the delivery status in the sender's local state
            return {
              ...msg,
              deliveryStatus: data.deliveryStatus,
            };
          }
          return msg;
        });
      });
    },
    [setAllMessages]
  );

  /**
   * IMPORTANT NOTE:
   * Registers and cleans up the socket listener for delivery updates.
   * Ensures proper event handling and prevents memory leaks.
   */
  useEffect(() => {
    if (!socket) return;

    // Attach the listener for delivery status updates
    socket.on("message:delivered", handleMessageDelivered);

    // Clean up listener on unmount or dependency change
    return () => {
      socket.off("message:delivered", handleMessageDelivered);
    };
  }, [socket, handleMessageDelivered]);
};
