import React from "react";
import { MessageItem } from "@/types/message/indexs";
import MessageDropdown from "./MessageDropdown";
import ImageCard from "./ImageCard";
import AudioCard from "./AudioCard";
import TextCard from "./TextCard";
import ReplyView from "./ReplayView";
import FileCard from "./FileCard";
import MessageSeenStatus from "./MessageSeenStatus";

interface MessageContentProps {
  message: MessageItem;
}

export default function MessageContent({
  message,
}: MessageContentProps) {
  const { isMe, id, content, replyToId } = message;

  const containerClasses = `relative flex items-center group select-none text-white leading-6 space-x-2 ${
    isMe ? "flex-row-reverse space-x-reverse" : ""
  }`;

  const bubbleClasses = `text-base text-gray-50 space-y-2.5 leading-relaxed whitespace-pre-wrap break-words rounded-xl p-4 shadow-sm ${
    isMe
      ? "rounded-tr-none bg-blue-950 pb-2"
      : "rounded-tl-none rounded-br-xl bg-[#323438]"
  }`;

  return (
    <div className={containerClasses} data-message-id={id}>
      <div className={bubbleClasses}>
        {/* Replying to another message */}
        {replyToId && <ReplyView replyToId={replyToId} />}

        {/* Text message */}
        {content.text && <TextCard msg={content} />}

        {/* Media attachments */}
        <ImageCard msg={content} />
        <AudioCard msg={content} />
        <FileCard msg={content} />
        <MessageSeenStatus message={message} />
      </div>
      {/* Dropdown for message actions */}
      <MessageDropdown msgId={id} />
    </div>
  );
}
