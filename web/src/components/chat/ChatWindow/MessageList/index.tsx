"use client";
import React, { useRef, useState, useEffect } from "react";
import MessageItem from "./MessageBubble";
import { useChat } from "@/context/ChatContext";

export default function MessageList() {
  const { messages } = useChat();
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
