"use client";
import React, { useRef, useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { useChat } from "@/context/ChatContext/ChatProvider";
import type { IMessage } from "@/types/message/indexs";

export default function MessageList() {
  const context = useChat();
  const { allMessages } = context;
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);
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

  // Expose scrollToMessage to the context
  // useEffect(() => {
  //   context.scrollToMessage = scrollToMessage;
  // }, [context]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);  

  return (
    <div className="flex-1 overflow-auto p-3 md:p-4 space-y-4">
      {allMessages.map((msg, index) => {
        // Ensure we have a unique key, using index as fallback only when id is missing
        const uniqueKey = msg.id ? msg.id : `message-${index}`;
        return (
          <MessageBubble
            key={uniqueKey}
            message={msg}
            highlighted={highlightedMessageId === msg.id}
            scrollToMessage={scrollToMessage}
            ref={(el: HTMLDivElement) => {
              if (el && msg.id) messageRefs.current[msg.id] = el;
            }}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
