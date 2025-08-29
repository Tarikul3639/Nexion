import React from "react";
import { Message, FileMessage, VideoMessage, ImageMessage } from "@/types/chat";

interface MessagePreviewProps {
  message: Message;
}

export default function LastMessagePreview({ message }: MessagePreviewProps) {
  switch (message.type) {
    case "text":
      return (
        <span>
          <span className="text-gray-400 font-semibold">{message.senderName}:</span>{" "}
          {message.content}
        </span>
      );
    case "image":
      const imageMsg = message as ImageMessage;
      return (
        <span>
          <span className="text-gray-400 font-semibold">{message.senderName}:</span> [Image:{" "}
          {imageMsg.content.alt ?? "unknown"}]
        </span>
      );
    case "video":
      const videoMsg = message as VideoMessage;
      return (
        <span>
          <span className="text-gray-400 font-semibold">{message.senderName}:</span> [Video:{" "}
          {videoMsg.content.duration ?? "unknown"}]
        </span>
      );
    case "file":
      const fileMsg = message as FileMessage;
      return (
        <span>
          <span className="text-gray-400 font-semibold">{message.senderName}:</span> [File:{" "}
          {fileMsg.content.filename ?? "unknown"}]
        </span>
      );
    default:
      return null;
  }
}
