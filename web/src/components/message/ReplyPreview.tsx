"use client";

import React from "react";
import { ArrowUp, Image as ImageIcon, Video, Paperclip } from "lucide-react";
import { Message } from "@/types/message.types";

interface ReplyPreviewProps {
  message: Message;
  onScrollToMessage: (messageId: number) => void;
}

export default function ReplyPreview({
  message,
  onScrollToMessage,
}: ReplyPreviewProps) {
  if (!message.replyTo) return null;

  return (
    <div
      className={`p-2 m-1 rounded-sm border-l-4 cursor-pointer transition-all duration-200 ${
        message.isOwn
          ? "bg-blue-600 border-blue-200 text-blue-100"
          : "bg-gray-100 border-gray-500 text-gray-600"
      }`}
      onClick={() => onScrollToMessage(message.replyTo!.id)}
      title="Click to scroll to original message"
    >
      <div className="flex items-center space-x-2 mb-1">
        <ArrowUp
          className={`w-3 h-3 ${
            message.isOwn ? "text-blue-200" : "text-blue-500"
          }`}
        />
        <p className="text-xs font-medium opacity-90">
          {message.replyTo.sender}
        </p>
        {/* Attachment icons */}
        {message.replyTo.attachments &&
          message.replyTo.attachments.length > 0 && (
            <div className="flex items-center space-x-1">
              {message.replyTo.attachments.some((file) =>
                file.type.startsWith("image/")
              ) && (
                <ImageIcon
                  className={`w-3 h-3 ${
                    message.isOwn ? "text-blue-200" : "text-blue-500"
                  }`}
                />
              )}
              {message.replyTo.attachments.some((file) =>
                file.type.startsWith("video/")
              ) && (
                <Video
                  className={`w-3 h-3 ${
                    message.isOwn ? "text-purple-200" : "text-purple-500"
                  }`}
                />
              )}
              {message.replyTo.attachments.some(
                (file) =>
                  !file.type.startsWith("image/") &&
                  !file.type.startsWith("video/")
              ) && (
                <Paperclip
                  className={`w-3 h-3 ${
                    message.isOwn ? "text-gray-200" : "text-gray-500"
                  }`}
                />
              )}
            </div>
          )}
      </div>

      {/* Reply content */}
      {message.replyTo.content && (
        <p
          title={message.replyTo.content}
          className="text-xs line-clamp-1 max-w-xs break-words"
        >
          {message.replyTo.content}
        </p>
      )}

      {/* Attachment summary for replied message */}
      {message.replyTo.attachments &&
        message.replyTo.attachments.length > 0 && (
          <p
            className={`text-xs mt-1 italic ${
              message.isOwn ? "text-blue-200/80" : "text-gray-500"
            }`}
          >
            📎{" "}
            {(() => {
              const images = message.replyTo.attachments.filter((file) =>
                file.type.startsWith("image/")
              );
              const videos = message.replyTo.attachments.filter((file) =>
                file.type.startsWith("video/")
              );
              const otherFiles = message.replyTo.attachments.filter(
                (file) =>
                  !file.type.startsWith("image/") &&
                  !file.type.startsWith("video/")
              );

              const parts = [];
              if (images.length > 0)
                parts.push(
                  `${images.length} image${images.length > 1 ? "s" : ""}`
                );
              if (videos.length > 0)
                parts.push(
                  `${videos.length} video${videos.length > 1 ? "s" : ""}`
                );
              if (otherFiles.length > 0)
                parts.push(
                  `${otherFiles.length} file${otherFiles.length > 1 ? "s" : ""}`
                );

              return parts.join(", ");
            })()}
          </p>
        )}

      {/* Show placeholder if no content and no attachments */}
      {!message.replyTo.content &&
        (!message.replyTo.attachments ||
          message.replyTo.attachments.length === 0) && (
          <p
            className={`text-xs italic ${
              message.isOwn ? "text-blue-200/60" : "text-gray-400"
            }`}
          >
            Message has no content
          </p>
        )}
    </div>
  );
}
