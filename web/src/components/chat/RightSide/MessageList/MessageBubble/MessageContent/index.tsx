import React from "react";
import { IMessage } from "@/types/message/indexs";
import MessageDropdown from "./MessageDropdown";
import ImageCard from "./ImageCard";
import AudioCard from "./AudioCard";
import TextCard from "./TextCard";
import ReplyView from "./ReplayView";
import FileCard from "./FileCard";
import MessageSeenStatus from "./MessageSeenStatus";

interface MessageContentProps {
  message: IMessage;
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
        {replyToId && <ReplyView key="reply-view" replyToId={replyToId} />}

        {/* Text message */}
        {content.text && <TextCard key="text-card" msg={content as any} />}

        {/* Media attachments with proper keys */}
        {/* Type checking is handled inside each component */}
        <ImageCard key="image-card" msg={content as any} />
        <AudioCard key="audio-card" msg={content as any} />
        <FileCard key="file-card" msg={content as any} />
        
        {/* Message seen status */}
        {/* <MessageSeenStatus key="seen-status" message={message} /> */}
      </div>
      {/* Dropdown for message actions */}
      <MessageDropdown msgId={id} />
    </div>
  );
}
