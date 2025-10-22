// SendButton.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useChat } from "@/context/ChatContext";
import { usePanel } from "@/context/PanelContext";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuid } from "uuid";
import { MessageItem } from "@/types/message/indexs";

// Define the attachment interface based on DraftMessage's attachment type
interface MessageAttachment {
  type: "image" | "video" | "file" | "audio/webm";
  file?: File;
  url?: string;
  name?: string;
  size?: number;
  extension?: string;
  alt?: string;
  thumbnail?: string;
  duration?: number;
  waveform?: number[];
  previewUrl?: string; // Used for local preview before upload
}

export default function SendButton() {
  const {
    draftMessage,
    setDraftMessage,
    setAllMessages,
    replyToId,
    setReplyToId,
    setIsRecordingActive,
    setUploadProgress,
  } = useChat();
  const { socket } = useSocket();
  const { selectedConversation } = usePanel();
  const { user } = useAuth();

  // Move the conditional return outside of the JSX render logic
  // This prevents the React.Children.only error by ensuring we don't conditionally
  // render content inside the TooltipTrigger component
  if (!draftMessage?.text && !draftMessage?.attachments?.length) return null;

  // Helper function to determine message type based on content
  const getMessageType = (text: string | undefined, attachments: MessageAttachment[] | undefined): MessageItem['type'] => {
    if (attachments && attachments.length > 0) {
      // If multiple types of attachments, default to 'file'. Otherwise, use the first attachment's type.
      if (attachments.length > 1 || attachments.some(a => a.type === 'file')) {
        return 'file';
      }
      // Extract base type (e.g., 'image' from 'image/jpeg' or 'audio' from 'audio/webm')
      const firstType = attachments[0].type.split('/')[0]; 
      // Ensure it matches a valid MessageItem type or default to 'file' if ambiguous
      if (['image', 'video', 'file', 'audio', 'text', 'system', 'notification'].includes(firstType)) {
          return firstType as MessageItem['type'];
      }
    }
    return 'text';
  };

  // ---------------- Upload single attachment ----------------
  const uploadAttachment = (att: MessageAttachment) => {
    return new Promise<MessageAttachment>((resolve, reject) => {
      if (!att.file) return resolve(att);

      const formData = new FormData();
      formData.append("file", att.file);

      const xhr = new XMLHttpRequest();
      // NOTE: The API endpoint path should be confirmed
      xhr.open("POST", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prev) => ({
            ...prev,
            [att.name || (att.file ? att.file.name : 'unknown')]: percent,
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve({ ...att, url: data.url, file: undefined, previewUrl: undefined });
        } else reject(new Error("Upload failed"));
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(formData);
    });
  };

  const handleMessageSend = async () => {
    if (!socket || !selectedConversation || !user || !draftMessage) return;

    const tempId = uuid();
    const messageType = getMessageType(draftMessage.text, draftMessage.attachments); // 💡 New: Get message type

    // ---------- 1. Optimistic message ----------
    const optimisticMessage: MessageItem = {
      id: tempId,
      conversationId: selectedConversation.id, // Add conversationId for consistency
      senderId: user.id,
      senderName: user.username || user.name || "Unknown",
      senderAvatar: user.avatar || "",
      content: {
        ...draftMessage,
        attachments: draftMessage.attachments?.map((att) => ({
          ...att,
          previewUrl: att.file ? URL.createObjectURL(att.file) : att.url,
        })),
      },
      type: messageType, // 💡 New: Set message type
      updatedAt: new Date().toISOString(),
      status: "uploading",
      isMe: true,
      replyToId: replyToId || undefined,
      isEdited: false, // Default is false for new message
    };

    setAllMessages((prev) => [...prev, optimisticMessage]);

    // ---------- 2. Upload attachments ----------
    let uploadedAttachments: MessageAttachment[] = [];
    if (draftMessage.attachments?.length) {
      uploadedAttachments = await Promise.all(draftMessage.attachments.map(uploadAttachment));
    }

    // ---------- 3. Update optimistic message (status and attachments) ----------
    setAllMessages((prev) =>
      prev.map((msg) =>
        msg.id === tempId
          ? { ...msg, status: "sending", content: { ...msg.content, attachments: uploadedAttachments } }
          : msg
      )
    );

    // ---------- 4. Send message to socket ----------
    socket.emit("sendMessage", {
      conversation: selectedConversation.type !== "user" ? selectedConversation.id : undefined,
      partner: selectedConversation.type === "user" ? selectedConversation.id : undefined,
      sender: user.id,
      content: { ...draftMessage, attachments: uploadedAttachments },
      type: messageType, // 💡 New: Pass message type to server
      senderName: user.username || user.name, // 💡 New: Pass sender name
      senderAvatar: user.avatar, // 💡 New: Pass sender avatar
      replyTo: replyToId,
      tempId,
    });

    // ---------- 5. Reset draft ----------
    setDraftMessage({ text: "", attachments: [] });
    setReplyToId(null);
    setIsRecordingActive(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id="send-btn"
            size="icon"
            onClick={handleMessageSend}
            className="rounded-sm flex items-center justify-center transition-all duration-200 focus:outline-none bg-blue-600 hover:bg-blue-700 active:scale-95"
          >
            <Send className="w-5 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Send Message</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}