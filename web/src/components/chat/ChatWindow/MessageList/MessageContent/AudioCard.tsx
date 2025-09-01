"use client";

import React, { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioMessage } from "@/types/message";

// Data for the waveform bars
const waveformBars = [
  { x: 0, y: 17, height: 6 },
  { x: 7, y: 15.5, height: 9 },
  { x: 14, y: 6.5, height: 27 },
  { x: 21, y: 6.5, height: 27 },
  { x: 28, y: 3, height: 34 },
  { x: 35, y: 3, height: 34 },
  { x: 42, y: 5.5, height: 29 },
  { x: 49, y: 10, height: 20 },
  { x: 56, y: 13.5, height: 13 },
  { x: 63, y: 16, height: 8 },
  { x: 70, y: 12.5, height: 15 },
  { x: 77, y: 3, height: 34 },
  { x: 84, y: 3, height: 34 },
  { x: 91, y: 0.5, height: 39 },
  { x: 98, y: 0.5, height: 39 },
  { x: 105, y: 2, height: 36 },
  { x: 112, y: 6.5, height: 27 },
  { x: 119, y: 9, height: 22 },
  { x: 126, y: 11.5, height: 17 },
  { x: 133, y: 2, height: 36 },
  { x: 140, y: 2, height: 36 },
  { x: 147, y: 7, height: 26 },
  { x: 154, y: 9, height: 22 },
  { x: 161, y: 9, height: 22 },
  { x: 168, y: 13.5, height: 13 },
  { x: 175, y: 16, height: 8 },
  { x: 182, y: 17.5, height: 5 },
];

export default function AudioCard({ message }: { message: AudioMessage }) {
  if (!message || message.type !== "audio") return null;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("00:00");
  const [isSeeking, setIsSeeking] = useState(false);

  // Format time to mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  // When metadata loaded (get duration)
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Reset when ended
  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Handle seeking logic
  const handleSeek = (event: React.PointerEvent) => {
    if (!audioRef.current || !waveformRef.current) return;
    const waveformWidth = waveformRef.current.offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    const newTime = (clickX / waveformWidth) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    setIsSeeking(true);
    handleSeek(event);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (isSeeking) {
      handleSeek(event);
    }
  };

  const handlePointerUp = () => {
    setIsSeeking(false);
  };

  const progressPercentage = audioRef.current?.duration
    ? (audioRef.current.currentTime / audioRef.current.duration) * 100
    : 0;

  return (
    <div className="flex items-start gap-2.5">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={message.content.audio.url}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        {/* Play / Pause button */}
        <Button
          variant="ghost"
          className={`p-2 hover:bg-white/5 hover:text-white ${
            isPlaying ? "text-white bg-white/5" : "text-gray-400 bg-white/3"
          }`}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>

        {/* Waveform and Progress */}
        <div
          ref={waveformRef}
          className="relative flex items-center md:w-[185px] h-[40px] cursor-pointer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <svg
            aria-hidden="true"
            className="w-full h-full"
            viewBox="0 0 185 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {waveformBars.map((bar, index) => {
              const barXPercentage = (bar.x / 185) * 100;
              const isPlayed = barXPercentage < progressPercentage;
              return (
                <rect
                  key={index}
                  x={bar.x}
                  y={bar.y}
                  width="3"
                  height={bar.height}
                  rx="1.5"
                  className={
                    isPlayed ? "fill-blue-500" : "fill-gray-400 dark:fill-white"
                  }
                />
              );
            })}
          </svg>
        </div>

        {/* Duration */}
        <span className="inline-flex self-center items-center text-sm font-normal text-white">
          {duration}
        </span>
      </div>
    </div>
  );
}
