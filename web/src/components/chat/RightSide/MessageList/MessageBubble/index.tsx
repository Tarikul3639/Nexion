"use client";

import React, { forwardRef, useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import DragIndicator from "@/components/common/DragIndicator";
import MessageAvatar from "./MessageAvatar";
import MessageHeader from "../MessageHeader";
import MessageContent from "./MessageContent";
import MessageStatus from "./MessageStatus";
import type { MessageItem } from "@/types/message";
import { useChat } from "@/context/ChatContext";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

interface Props {
  message: MessageItem;
  highlighted?: boolean;
  scrollToMessage?: (id: string) => void;
}

const MessageBubble = forwardRef<HTMLDivElement, Props>(
  ({ message, highlighted }, ref) => {
    const { setReplyToId } = useChat();
    const { socket } = useSocket();
    const { user } = useAuth();

    const [isDragging, setIsDragging] = useState(false);
    const controls = useAnimation();
    const dragStarted = useRef(false);
    
    // Determine if the message is sent by the current user
    message.isMe = message.senderId === user?.id;

    // 👁️ intersection observer hook
    const { ref: inViewRef, inView } = useInView({
      threshold: 0.5, // 50% visible
      triggerOnce: true, // Just first time emit
    });

    // ✅ message read event emit
    useEffect(() => {
      if (inView && !message.isMe && socket && user) {
        socket.emit("messageRead", {
          messageId: message.id.toString(),
          userId: user.id,
        });
      }
    }, [inView, message, socket, user]);

    // Merge forwarded ref + inView ref
    const setRefs = (el: HTMLDivElement) => {
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      inViewRef(el);
    };

    // Determine if drag offset exceeds threshold
    const handleDrag = (offsetX: number) => {
      if ((message.isMe && offsetX < -40) || (!message.isMe && offsetX > 40)) {
        setIsDragging(true);
      } else {
        setIsDragging(false);
      }
    };

    const handleDragEnd = (offsetX: number) => {
      if ((message.isMe && offsetX < -40) || (!message.isMe && offsetX > 40)) {
        setReplyToId(message.id);
      }
      setIsDragging(false);
      controls.start({ x: 0 });
    };

    const containerClass = `flex max-w-screen overflow-hidden ${
      message.isMe ? "justify-end" : "justify-start"
    } ${highlighted ? "bg-gray-200 p-2 rounded-sm" : ""}`;

    const bubbleClass = `flex items-start space-x-3 max-w-[90%] md:max-w-sm lg:max-w-md relative ${
      message.isMe ? "flex-row-reverse space-x-reverse" : ""
    }`;

    return (
      <div ref={setRefs} className={containerClass}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -50, right: 50 }}
          dragElastic={0.2}
          transition={{ type: "spring", stiffness: 1000, damping: 35 }}
          animate={controls}
          initial={{ x: 0 }}
          className={bubbleClass}
          onDragStart={() => {
            dragStarted.current = true;
            setIsDragging(false);
          }}
          onDrag={(e, info) => handleDrag(info.offset.x)}
          onDragEnd={(_, info) => handleDragEnd(info.offset.x)}
        >
          {isDragging && <DragIndicator isMe={message.isMe} />}
          <MessageAvatar message={message} />
          <div>
            <MessageHeader message={message} />
            <MessageContent message={message} />
            {message.isMe && <MessageStatus status={message.status} />}
          </div>
        </motion.div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
