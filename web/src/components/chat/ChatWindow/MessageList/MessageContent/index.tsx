import React from "react";
import { MessageItem } from "@/types/message";
import ImageCard from "./ImageCard";
import AudioCard from "./AudioCard";

const images = [
  "https://i.pravatar.cc/700",
  "https://i.pravatar.cc/700",

];
const audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";

export default function MessageContent({ message }: { message: MessageItem }) {
  return (
    <div className="relative text-base text-gray-50 space-y-2.5 leading-relaxed whitespace-pre-wrap break-words">
      {/* Message content */}
      {message.content && <p>{message.content}</p>}

      {/* Images */}
      <ImageCard images={images} />

      {/* Audio */}
      <AudioCard audioSrc={audioSrc} />
    </div>
  );
}
