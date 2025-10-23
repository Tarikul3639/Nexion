// hooks/useSendMessage.ts (Refined for Text Only)

import { useChat } from "@/context/ChatContext/ChatProvider";
import { usePanel } from "@/context/PanelContext";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuid } from "uuid";
import { IMessage } from "@/types/message/indexs";

// Helper function simplified for 'text' type assumption
const getMessageType = (text: string | undefined): IMessage['type'] => {
    // If text exists, it's a 'text' message. Otherwise, we might handle errors or return 'text' by default.
    return text ? 'text' : 'text'; 
};

export function useSendMessage() {
    const { draftMessage, setDraftMessage, setAllMessages, replyToId, setReplyToId, setIsRecordingActive } = useChat();
    const { socket } = useSocket();
    const { selectedConversation } = usePanel();
    const { user } = useAuth();

    // Check if there is any text to send - wrapping in Boolean to ensure we get a true boolean value
    const isReadyToSend = Boolean(
        draftMessage && 
        draftMessage.text && 
        draftMessage.text.trim().length > 0
    );

    const handleMessageSend = async () => {
        // Extra safety check - don't proceed if any requirement is missing
        if (!socket || !selectedConversation || !user || !draftMessage) {
            console.warn("Message sending aborted: Missing required dependencies");
            return;
        }
        
        // Ensure there's actual text content (double check)
        const textContent = draftMessage?.text?.trim() ?? "";
        if (!textContent) {
            console.warn("Message sending aborted: Empty message content");
            return;
        }
        
        const tempId = uuid();
        const messageType = getMessageType(textContent);

        // ---------- 1. Optimistic message creation (Text Only) ----------
        const optimisticMessage: IMessage = {
            id: tempId,
            conversationId: selectedConversation.id,
            senderId: user.id,
            senderName: user.username || user.name || "Unknown",
            senderAvatar: user.avatar || "",
            content: {
                text: textContent,
                attachments: [], // Empty attachments array
            },
            type: messageType,
            deliveryStatus: "sending", // Directly set to sending for text
            isMe: true,
            replyToId: replyToId || undefined,
            isEdited: false,
            isPinned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            reactions: [],
            readBy: [],
            isSystemMessage: false,
        };

        setAllMessages((prev) => [...prev, optimisticMessage]);

        // ---------- 2. Prepare final content object ----------
        const finalContent = {
            text: textContent,
            attachments: [], // Explicitly empty
        };

        // ---------- 3. Send message to socket ----------
        socket.emit("message:send", {
            conversation: selectedConversation.type !== "user" ? selectedConversation.id : undefined,
            partner: selectedConversation.type === "user" ? selectedConversation.id : undefined,
            sender: user.id,
            content: finalContent, // Send final content
            type: messageType,
            senderName: user.name,
            senderAvatar: user.avatar,
            replyTo: replyToId,
            tempId,
        });

        // ---------- 3. Wait for server confirmation ----------
        socket.on("message:confirm", (data) => {
            console.log("Message send successfully: ",data);
            setAllMessages((prev) =>
                prev.map((msg) =>
                    msg.id === data.id ? { ...msg, ...data } : msg
                )
            );
        });

        // ---------- 4. Reset draft ----------
        setDraftMessage({ text: "", attachments: [] });
        setReplyToId(null);
        setIsRecordingActive(false);
    };

    return { handleMessageSend, isReadyToSend };
}