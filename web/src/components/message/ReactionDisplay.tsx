"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
  reacted: boolean;
}

interface ReactionDisplayProps {
  reactions: Reaction[];
  isOwn: boolean;
  onReaction?: (id: number, emoji: string) => void;
  messageId: number;
}

export default function ReactionDisplay({
  reactions,
  isOwn
}: ReactionDisplayProps) {
  const [hoveredReaction, setHoveredReaction] = useState<number | null>(null);

  return (
    <div className={`absolute -bottom-4 right-0 flex gap-1 ${
      isOwn ? "justify-end" : "justify-start"
    }`}>
      {reactions.map((reaction, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
          onMouseEnter={() => setHoveredReaction(index)}
          onMouseLeave={() => setHoveredReaction(null)}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            // onClick={() => onReaction?.(messageId, reaction.emoji)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              reaction.reacted
                ? isOwn
                  ? "bg-white/20 border border-white/30 text-white shadow-lg"
                  : "bg-blue-100 border border-blue-200 text-blue-600 shadow-lg"
                : isOwn
                ? "bg-white/10 border border-white/20 text-white/80 hover:bg-white/20"
                : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="text-sm">{reaction.emoji}</span>
            <span className="text-xs font-semibold">{reaction.count}</span>
          </motion.button>
          
          {/* Tooltip showing users who reacted */}
          {hoveredReaction === index && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 pointer-events-none"
            >
              <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg min-w-max">
                <div className="font-semibold mb-1 flex items-center">
                  <span className="mr-1">{reaction.emoji}</span>
                  {reaction.count} {reaction.count === 1 ? 'person' : 'people'}
                </div>
                <div className="text-xs text-gray-300 whitespace-nowrap">
                  {reaction.users.slice(0, 3).join(', ')}
                  {reaction.users.length > 3 && ` and ${reaction.users.length - 3} more`}
                </div>
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
