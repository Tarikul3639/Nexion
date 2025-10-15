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
  const { activeChat } = usePanel();
  const { user } = useAuth();

  if (!draftMessage?.text && !draftMessage?.attachments?.length) return null;

  // ---------------- Upload single attachment ----------------
  const uploadAttachment = (att: any) => {
    return new Promise<any>((resolve, reject) => {
      if (!att.file) return resolve(att);

      const formData = new FormData();
      formData.append("file", att.file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prev) => ({
            ...prev,
            [att.name || att.file.name]: percent,
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
    if (!socket || !activeChat || !user || !draftMessage) return;

    const tempId = uuid();

    // ---------- 1. Optimistic message ----------
    const optimisticMessage: any = {
      id: tempId,
      senderId: user.id,
      senderName: user.username || "Unknown",
      senderAvatar: user.avatar || "",
      content: {
        ...draftMessage,
        attachments: draftMessage.attachments?.map((att) => ({
          ...att,
          previewUrl: att.file ? URL.createObjectURL(att.file) : att.url,
        })),
      },
      updatedAt: new Date().toISOString(),
      status: "uploading",
      isMe: true,
      replyToId: replyToId || undefined,
    };

    setAllMessages((prev) => [...prev, optimisticMessage]);

    // ---------- 2. Upload attachments ----------
    let uploadedAttachments: any = [];
    if (draftMessage.attachments?.length) {
      uploadedAttachments = await Promise.all(draftMessage.attachments.map(uploadAttachment));
    }

    // ---------- 3. Update optimistic message ----------
    setAllMessages((prev) =>
      prev.map((msg) =>
        msg.id === tempId
          ? { ...msg, status: "sending", content: { ...msg.content, attachments: uploadedAttachments } }
          : msg
      )
    );

    // ---------- 4. Send message to socket ----------
    socket.emit("sendMessage", {
      conversation: activeChat.type !== "user" ? activeChat.id : undefined,
      receiverId: activeChat.type === "user" ? activeChat.id : undefined,
      sender: user.id,
      content: { ...draftMessage, attachments: uploadedAttachments },
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
            className={`rounded-sm flex items-center justify-center transition-all duration-200 focus:outline-none ${
              draftMessage?.text || draftMessage?.attachments?.length
                ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                : "bg-gray-600 hover:bg-gray-700 hidden"
            }`}
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
