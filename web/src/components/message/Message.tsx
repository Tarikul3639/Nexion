"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reply, CheckCheck, Pin } from "lucide-react";
import React, { useState, useRef } from "react";
import { MessageProps } from "./Message.types";
import AttachmentDisplay from "./AttachmentDisplay";
import ActionButton from "./ActionButton";
import ReplyPreview from "./ReplyPreview";
import ReactionDisplay from "./ReactionDisplay";
import { motion, useAnimation } from "framer-motion";

export default function Message({
  messages,
  messagesEndRef,
  messagesContainerRef,
  onReply,
  onPin,
  onEdit,
  onDelete,
  onReaction,
}: MessageProps) {
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    number | null
  >(null);
  const [holdMessage, setHoldMessage] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const messageRefs = useRef<{ [key: number]: HTMLDivElement }>({});
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const dragStarted = useRef(false);
  const controls = useAnimation();

  // Function to scroll to original message
  const scrollToMessage = (messageId: number) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Clear existing timeout
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      // Highlight the message temporarily
      setHighlightedMessageId(messageId);
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-auto p-3 md:p-4 space-y-2 bg-gray-50"
      suppressHydrationWarning
    >
      {messages.map((message) => (
        <div
          key={message.id}
          ref={(el) => {
            if (el) messageRefs.current[message.id] = el;
          }}
          className={`flex max-w-screen ${
            message.isOwn ? "justify-end" : "justify-start"
          } transition-all duration-500 ${
            highlightedMessageId === message.id
              ? "bg-gray-200 p-2 rounded-sm"
              : ""
          }`}
          suppressHydrationWarning
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: -50, right: 50 }}
            dragElastic={0.2}
            whileTap={{ scale: 0.98 }}
            onTapStart={() => {
              dragStarted.current = false;
              // Start hold timer
              holdTimeout.current = setTimeout(() => {
                if (!dragStarted.current) {
                  setHoldMessage(message.id);
                }
              }, 300); // 300ms hold like Messenger
            }}
            onDragStart={() => {
              setIsDragging(message.id);
              dragStarted.current = true; // Mark drag
              if (holdTimeout.current) {
                clearTimeout(holdTimeout.current); // Cancel hold
              }
            }}
            onTapCancel={() => {
              if (holdTimeout.current) clearTimeout(holdTimeout.current);
              setHoldMessage(null);
            }}
            onTap={() => {
              if (holdTimeout.current) clearTimeout(holdTimeout.current);
              setHoldMessage(null);
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40 && message.isOwn) {
                onReply?.(message);
                setIsDragging(null);
              }
              if (info.offset.x > 40 && !message.isOwn) {
                onReply?.(message);
                setIsDragging(null);
              }
              controls.start({ x: 0 });
            }}
            animate={controls}
            initial={{ x: 0 }}
            // Class names for message bubble
            className={`flex items-end space-x-3 max-w-[85%] md:max-w-sm lg:max-w-md relative ${
              message.isOwn ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            {/* Drag handle */}
            {isDragging === message.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
                className={`absolute z-10 ${
                  message.isOwn
                    ? "-right-12 top-1/2 transform -translate-y-1/2"
                    : "-left-12 top-1/2 transform -translate-y-1/2"
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                  <Reply className="w-4 h-4 text-white transform transition-transform duration-200 hover:scale-110" />
                </div>
              </motion.div>
            )}

            {/* Avatar for other's messages */}
            {!message.isOwn && (
              <Avatar className="w-7 h-7 md:w-8 md:h-8 text-sm font-semibold flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  {message.avatar}
                </AvatarFallback>
              </Avatar>
            )}

            {/* Message bubble */}
            <div className="relative group select-none">
              <div
                className={`flex items-center space-x-2 mb-1 ${
                  message.isOwn
                    ? "justify-start flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                {/* Message status */}
                {message.isOwn && (
                  <div className="w-5 h-5 flex items-center justify-center text-center text-blue-600">
                    <CheckCheck className="w-4 h-4" />
                  </div>
                )}

                <span className="text-sm font-medium text-gray-900">
                  {message.sender}
                </span>
                {message.role === "teacher" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-purple-100 text-purple-600"
                  >
                    Teacher
                  </Badge>
                )}
                {message.role === "assistant" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-600"
                  >
                    TA
                  </Badge>
                )}
                {message.role === "admin" && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-red-100 text-red-600"
                  >
                    Admin
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {message.timestamp}
                  {message.isEdited && (
                    <span className="ml-1 text-gray-400 italic">(edited)</span>
                  )}
                </span>
              </div>
              <div
                className={`rounded shadow-sm relative ${
                  message.isOwn
                    ? "bg-blue-500 text-white rounded-tr-none border border-blue-400"
                    : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
                } ${
                  message.isPinned
                    ? message.isOwn
                      ? "ring-2 ring-yellow-400"
                      : "ring-2 ring-yellow-400/50"
                    : ""
                }`}
              >
               {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <ReactionDisplay
                    reactions={message.reactions}
                    isOwn={message.isOwn}
                    onReaction={onReaction}
                    messageId={message.id}
                  />
                )}

                {/* Pin indicator */}
                {message.isPinned && (
                  <div
                    className={`absolute -top-4 ${
                      message.isOwn
                        ? "-left-4 -rotate-40 text-yellow-500"
                        : "-right-4 rotate-40 text-yellow-500"
                    }`}
                  >
                    <div className="text-xs px-1.5 py-0.5 rounded-full">
                      <Pin className="w-3 h-3" />
                    </div>
                  </div>
                )}

                {/* Reply Preview */}
                <ReplyPreview
                  message={message}
                  onScrollToMessage={scrollToMessage}
                />

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <AttachmentDisplay
                    attachments={message.attachments}
                    isOwn={message.isOwn}
                  />
                )}

                {/* Message content */}
                {message.content && (
                  <p className="text-sm px-4 py-2 leading-relaxed  break-words whitespace-pre-wrap break-words overflow-wrap break-all">
                    {message.content}
                  </p>
                )}
              </div>

              {/* Action button */}
              <ActionButton
                message={message}
                onReply={onReply}
                onPin={onPin}
                onEdit={onEdit}
                onDelete={onDelete}
                onReaction={onReaction}
                forceOpen={holdMessage === message.id}
                onOpenChange={(open: boolean) => {
                  if (!open) setHoldMessage(null);
                }}
              />

              {/* Reply Button */}
              <div
                className={`flex items-center ${
                  message.isOwn ? "justify-end" : "justify-start"
                } space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply?.(message)}
                  className="h-6 px-2 text-xs"
                >
                  <Reply className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
