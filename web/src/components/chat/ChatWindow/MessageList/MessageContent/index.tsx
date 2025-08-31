import React from "react";
import { MessageItem } from "@/types/message";
import ImageCard from "./ImageCard";

const images = [
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",

];

export default function MessageContent({ message }: { message: MessageItem }) {
  return (
    <div className="relative text-base text-gray-50 space-y-5 leading-relaxed whitespace-pre-wrap break-words">
      {/* Message content */}
      {message.content && <p>{message.content}</p>}

      {/* Images */}
      <ImageCard images={images} />
    </div>
  );
}
