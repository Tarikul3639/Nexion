import React from "react";
import { MessageItem,DraftMessage } from "@/types/message";
import ImageCard from "./ImageCard";
import AudioCard from "./AudioCard";
import TextCard from "./TextCard";

export default function MessageContent({ msg }: { msg: DraftMessage }) {
  return (
    <div className="relative text-base text-gray-50 space-y-2.5 leading-relaxed whitespace-pre-wrap break-words">
      {/* Message content */}
      {msg.text && <TextCard msg={msg} />}

      {/* Images */}
      <ImageCard msg={msg} />

      {/* Audio */}
      <AudioCard msg={msg} />
    </div>
  );
}
