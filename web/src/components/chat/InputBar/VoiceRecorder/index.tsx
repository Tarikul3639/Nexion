"use client";

import { useChat } from "@/context/ChatContext";
import { useState, useRef, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

import RecordButton from "./RecordButton";
import RecorderControls from "./RecorderControls";
import RecorderStatus from "./RecorderStatus";

const MAX_DURATION = 120; // 2 minutes

export default function VoiceRecorder() {
  const { isRecordingActive, setIsRecordingActive } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [stop, setStop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [time, setTime] = useState(0); // recording seconds
  const [playTime, setPlayTime] = useState(0); // playback seconds
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const startTimestampRef = useRef<number | null>(null);

  // Start / Stop recording
  const handleRecordingToggle = async () => {
    if (!isRecording) {
      setIsRecording(true);
      setStop(false);
      setTime(0);
      audioChunksRef.current = [];
      startTimestampRef.current = null;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setStop(true);
      };

      mediaRecorder.start();

      // Smooth timer with requestAnimationFrame
      const update = (timestamp: number) => {
        if (!startTimestampRef.current) startTimestampRef.current = timestamp;
        const elapsed = (timestamp - startTimestampRef.current) / 1000;
        setTime(elapsed);

        if (elapsed >= MAX_DURATION) {
          mediaRecorder.stop();
          setIsRecording(false);
          return;
        }
        animationFrameRef.current = requestAnimationFrame(update);
      };
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Cancel Recording
  const handleCancel = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }

    setIsRecordingActive(false);
    setTime(0);
    setAudioURL(null);
    setIsRecording(false);
    setStop(false);
    setIsPlaying(false);
    setPlayTime(0);
    audioChunksRef.current = [];

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const handleRecording = async () => {
    handleRecordingToggle();
    setIsRecordingActive(true);
  };

  // Play / Pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    } else {
      audioRef.current.play();
      setIsPlaying(true);

      // Smooth playback progress
      const updatePlay = () => {
        if (audioRef.current) {
          setPlayTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration || 0);
          if (!audioRef.current.paused) {
            animationFrameRef.current = requestAnimationFrame(updatePlay);
          }
        }
      };
      animationFrameRef.current = requestAnimationFrame(updatePlay);
    }
  };

  // Reset audio on new recording
  useEffect(() => {
    if (isRecording) {
      setAudioURL(null);
      setIsPlaying(false);
      setStop(false);
      setTime(0);
      setPlayTime(0);
    }
  }, [isRecording]);

  // cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // progress calculation
  const progressPercent = isRecording
    ? (time / MAX_DURATION) * 100
    : duration > 0
    ? (playTime / duration) * 100
    : 0;

  return (
    <TooltipProvider>
      <RecordButton
        isRecordingActive={isRecordingActive}
        isRecording={isRecording}
        handleCancel={handleCancel}
        handleRecording={handleRecording}
      />

      {(isRecordingActive || stop) && (
        <div className="relative w-full rounded-full bg-blue-500 flex items-center justify-center px-2 py-0.5 text-sm overflow-hidden">
          {/* smooth progress background */}
           <motion.div
            className="absolute left-0 top-0 h-full bg-blue-700"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "linear", duration: 0.05 }}
          />

          <div className="flex w-full items-center relative z-10">
            <RecorderControls
              isRecording={isRecording}
              stop={stop}
              audioURL={audioURL}
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              handleRecordingToggle={handleRecordingToggle}
            />

            <RecorderStatus
              isRecording={isRecording}
              isPlaying={isPlaying}
              time={isRecording ? Math.floor(time) : Math.floor(playTime)}
            />
          </div>

          {audioURL && (
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => {
                setIsPlaying(false);
                setPlayTime(0);
              }}
            />
          )}
        </div>
      )}
    </TooltipProvider>
  );
}
