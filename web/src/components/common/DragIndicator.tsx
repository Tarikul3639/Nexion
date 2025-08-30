"use client";
import React from "react";
import { motion } from "framer-motion";
import { Reply } from "lucide-react";

interface DragIndicatorProps {
  isMe?: boolean;
}

export default function DragIndicator({ isMe = false }: DragIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 1000,
        damping: 35,
      }}
      className={`absolute z-10 ${
        isMe ? "-right-12 top-1/2 -translate-y-1/2" : "-left-12 top-1/2 -translate-y-1/2"
      }`}
    >
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
        <Reply className="w-4 h-4 text-white" />
      </div>
    </motion.div>
  );
}
