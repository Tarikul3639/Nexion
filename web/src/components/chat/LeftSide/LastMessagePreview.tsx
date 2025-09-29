"use client";

import React from "react";
import { IMessage } from "@/types/message/message.messageList";

interface LastMessagePreviewProps {
  message?: IMessage;
}

export default function LastMessagePreview({ message }: LastMessagePreviewProps) {
  if (!message) return null;

  const { sender, content } = message;

  if (content?.text) {
    return (
      <span>
        <span className="text-gray-300 font-semibold">{sender.username}:</span>{" "}
        {content.text}
      </span>
    );
  }

  if (content?.attachments?.length) {
    const att = content.attachments[0];
    switch (att.type) {
      case "image":
        return (
          <span>
            <span className="text-gray-300 font-semibold">{sender.username}:</span>{" "}
            [Image: {att.alt ?? "unknown"}]
          </span>
        );
      case "video":
        return (
          <span>
            <span className="text-gray-300 font-semibold">{sender.username}:</span>{" "}
            [Video: {att.duration ?? "unknown"}s]
          </span>
        );
      case "audio":
        return (
          <span>
            <span className="text-gray-300 font-semibold">{sender.username}:</span>{" "}
            [Audio: {att.duration ?? "unknown"}s]
          </span>
        );
      case "file":
        return (
          <span>
            <span className="text-gray-300 font-semibold">{sender.username}:</span>{" "}
            [File: {att.name ?? "unknown"}]
          </span>
        );
      default:
        return null;
    }
  }

  return <span>[No content]</span>;
}
