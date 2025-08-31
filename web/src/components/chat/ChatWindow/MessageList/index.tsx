"use client";
import React, { useRef, useState } from "react";
import MessageItem from "./MessageBubble";
import { messages } from "@/data/messagesData";

export default function MessageList() {
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToMessage = (messageId: string) => {
    const el = messageRefs.current[messageId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedMessageId(messageId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-3 md:p-4 space-y-4">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          highlighted={highlightedMessageId === msg.id}
          scrollToMessage={scrollToMessage}
          ref={(el: HTMLDivElement) => {
            if (el) messageRefs.current[msg.id] = el;
          }}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
