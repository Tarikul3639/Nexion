"use client";
import React, { forwardRef, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import DragIndicator from "@/components/common/DragIndicator";
import MessageAvatar from "./MessageAvatar";
import MessageHeader from "./MessageHeader";
import type { MessageItem } from "@/types/message";
import MessageDropdown from "./MessageDropdown";
import MessageContent from "./MessageContent";

interface Props {
  message: MessageItem;
  highlighted?: boolean;
  scrollToMessage?: (id: string) => void;
  onReply?: (message: MessageItem) => void;
}

const MessageBubble = forwardRef<HTMLDivElement, Props>(
  ({ message, highlighted, scrollToMessage, onReply }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const controls = useAnimation();
    const dragStarted = useRef(false);

    return (
      <div
        ref={ref}
        className={`flex max-w-screen overflow-hidden ${
          message.isMe ? "justify-end" : "justify-start"
        } ${highlighted ? "bg-gray-200 p-2 rounded-sm" : ""}`}
      >
        <motion.div
          drag="x"
          transition={{ type: "spring", stiffness: 1000, damping: 35 }}
          dragConstraints={{ left: -50, right: 50 }}
          dragElastic={0.2}
          onDragStart={() => {
            dragStarted.current = true;
            // Initially indicator is hidden
            setIsDragging(false);
          }}
          onDrag={(e, info) => {
            const offset = info.offset.x;
            // Only show drag indicator if threshold exceeded
            if (
              (message.isMe && offset < -40) ||
              (!message.isMe && offset > 40)
            ) {
              setIsDragging(true);
            } else {
              setIsDragging(false);
            }
          }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -40 && message.isMe) {
              onReply?.(message);
            }
            if (info.offset.x > 40 && !message.isMe) {
              onReply?.(message);
            }
            setIsDragging(false);
            controls.start({ x: 0 });
          }}
          animate={controls}
          initial={{ x: 0 }}
          className={`flex items-end space-x-3 max-w-[90%] md:max-w-sm lg:max-w-md relative ${
            message.isMe ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          {/* Drag indicator */}
          {isDragging && <DragIndicator isMe={message.isMe} />}

          <MessageAvatar message={message} />
          <div
            className={`flex items-center space-x-2 ${
              message.isMe ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`relative group select-none text-white rounded shadow-sm leading-6 p-4 rounded-xl ${
                message.isMe
                  ? "rounded-br-none bg-blue-950"
                  : "rounded-bl-none rounded-br-xl bg-[#323438]"
              } ${message.isPinned ? "ring-2 ring-yellow-400" : ""}`}
            >
              <MessageHeader message={message} />
              <MessageContent message={message} />
            </div>
            <MessageDropdown />
          </div>
        </motion.div>
      </div>
    );
  }
);

export default MessageBubble;
