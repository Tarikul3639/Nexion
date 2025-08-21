"use client";

import { useRef, useEffect } from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

interface EmojiPickerComponentProps {
  emojiPickerVisible: boolean;
  setEmojiPickerVisible: (visible: boolean) => void;
  onEmojiClick: (emoji: string) => void;
}

export default function EmojiPickerComponent({
  emojiPickerVisible,
  setEmojiPickerVisible,
  onEmojiClick,
}: EmojiPickerComponentProps) {
  const emojiRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const node = event.target as Node;

      if (emojiRef.current && !emojiRef.current.contains(node)) {
        setEmojiPickerVisible(false);
      }
    };

    if (emojiPickerVisible) {
      document.addEventListener("mouseup", handleClickOutside);
      return () => {
        document.removeEventListener("mouseup", handleClickOutside);
      };
    }
  }, [emojiPickerVisible, setEmojiPickerVisible]);

  return (
    <>
      {/* Emoji Picker */}
      {emojiPickerVisible && (
        <div ref={emojiRef}>
          <EmojiPicker
            onEmojiClick={(emoji: { emoji: string }) =>
              onEmojiClick(emoji.emoji)
            }
            style={{ width: "100%", border: "none" }}
            height={400}
            emojiStyle={EmojiStyle.FACEBOOK}
            lazyLoadEmojis={true}
            allowExpandReactions={true}
            skinTonesDisabled={true}
            autoFocusSearch={false}
          />
        </div>
      )}
    </>
  );
}
