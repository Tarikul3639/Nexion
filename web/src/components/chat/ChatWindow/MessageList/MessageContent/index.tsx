import React from "react";
import { DraftMessage } from "@/types/message";
import ImageCard from "./ImageCard";
import AudioCard from "./AudioCard";
import TextCard from "./TextCard";
import ReplyView from "./ReplayView";

export default function MessageContent({
  msg,
  replyToId,
}: {
  msg: DraftMessage;
  replyToId?: string;
}) {
  return (
    <div className="relative text-base text-gray-50 space-y-2.5 leading-relaxed whitespace-pre-wrap break-words">
      {/* Replying to */}
      {replyToId && <ReplyView replyToId={replyToId} />}
      
      {/* Message content */}
      {msg.text && <TextCard msg={msg} />}

      {/* Images */}
      <ImageCard msg={msg} />

      {/* Audio */}
      <AudioCard msg={msg} />
    </div>
  );
}
