import React from "react";
import {
  MessageItem,
  TextMessage,
  ImageMessage,
  FileMessage,
  AudioMessage,
  VideoMessage,
} from "@/types/message";
import ImageCard from "./ImageCard";
import AudioCard from "./AudioCard";
import TextCard from "./TextCard";

export default function MessageContent({ message }: { message: MessageItem }) {
  return (
    <div className="relative text-base text-gray-50 space-y-2.5 leading-relaxed whitespace-pre-wrap break-words">
      {/* Message content */}
      <TextCard message={message as TextMessage} />

      {/* Images */}
      <ImageCard message={message as ImageMessage} />

      {/* Audio */}
      <AudioCard message={message as AudioMessage} />
    </div>
  );
}
