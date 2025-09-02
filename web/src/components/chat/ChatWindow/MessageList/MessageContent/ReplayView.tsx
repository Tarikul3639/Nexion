"use client";

import React from "react";
import { useChat } from "@/context/ChatContext";
import ImageCard from "./ImageCard";
import AudioCard from "./AudioCard";
import TextCard from "./TextCard";

export default function ReplyView({ replyToId }: { replyToId: string }) {
  const { allMessages } = useChat();
  const replyingTo = allMessages.find((msg) => msg.id === replyToId);
  if (!replyingTo) return null;

  const attachments = replyingTo.content?.attachments || [];

  const handleClick = () => {
    const messageElement = document.querySelector(
      `[data-message-id="${replyToId}"]`
    );
    if (!messageElement) return;

    // Scroll first
    messageElement.scrollIntoView({ behavior: "smooth", block: "center" });

    // Add transition class
    messageElement.classList.add(
      "transition-all",
      "duration-300",
      "ease-in-out",
      "opacity-80"
    );

    // Remove after duration
    setTimeout(() => {
      messageElement.classList.remove(
        "transition-all",
        "duration-300",
        "ease-in-out",
        "opacity-80"
      );
    }, 1000);
  };

  return (
    <div
      className="bg-gray-900/20 border-l-2 border-blue-500 px-3 py-2 rounded-r-md space-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <p className="text-xs font-medium text-blue-500">
        Replying to {replyingTo.senderName}
      </p>

      {/* Text content */}
      {replyingTo.content?.text && <TextCard msg={replyingTo.content} />}

      {/* Images */}
      {attachments.some((att) => att.type === "image") && (
        <ImageCard msg={replyingTo.content} />
      )}

      {/* Audio */}
      {attachments.some((att) => att.type === "audio/webm") && (
        <AudioCard msg={replyingTo.content} />
      )}

      {/* Files (optional, simple list) */}
      {attachments.some((att) => att.type === "file") && (
        <div className="flex flex-col text-xs text-gray-300 italic space-y-1">
          {attachments
            .filter((att) => att.type === "file")
            .map((file, i) => (
              <a
                key={i}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-400"
              >
                {file.name || `File ${i + 1}`}
              </a>
            ))}
        </div>
      )}

      {/* Placeholder if empty */}
      {!replyingTo.content?.text && attachments.length === 0 && (
        <p className="text-xs text-gray-400 italic">Message has no content</p>
      )}
    </div>
  );
}
