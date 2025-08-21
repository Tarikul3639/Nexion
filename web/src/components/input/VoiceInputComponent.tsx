"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, X, Play, Pause, Check } from "lucide-react";

interface VoiceInputComponentProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  voice: Blob | null;
  setVoice: (v: Blob | null) => void;
  disabled?: boolean;
}

export default function ModernVoiceInputComponent({
  isOpen,
  setIsOpen,
  setVoice,
  voice,
  disabled = false,
}: VoiceInputComponentProps) {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [Preview, setPreview] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio playback handlers
  const handlePlayVoice = () => {
    if (voice && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const setupAudioPlayback = useCallback(() => {
    if (voice && !audioRef.current) {
      const audio = new Audio(URL.createObjectURL(voice));
      audioRef.current = audio;

      // Estimate duration based on file size as fallback for infinity duration
      const estimatedDuration = voice.size / (1024 * 16);

      let durationSet = false;

      // Try multiple events to get valid duration
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        if (isFinite(duration) && !isNaN(duration) && duration > 0) {
          setAudioDuration(duration);
          durationSet = true;
        }
      });

      audio.addEventListener('canplaythrough', () => {
        const duration = audio.duration;
        if (isFinite(duration) && !isNaN(duration) && duration > 0) {
          setAudioDuration(duration);
          durationSet = true;
        } else if (!durationSet && estimatedDuration > 0) {
          setAudioDuration(estimatedDuration);
          durationSet = true;
        }
      });

      audio.addEventListener('durationchange', () => {
        const duration = audio.duration;
        if (isFinite(duration) && !isNaN(duration) && duration > 0) {
          setAudioDuration(duration);
          durationSet = true;
        }
      });

      audio.addEventListener('timeupdate', () => {
        setPlaybackTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlaybackTime(0);
        audio.currentTime = 0;
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setAudioDuration(0);
        setIsPlaying(false);
        setPlaybackTime(0);
      });
    }
  }, [voice]);

  // Setup audio when voice is available
  useEffect(() => {
    if (voice) {
      setupAudioPlayback();
    } else {
      // Reset preview when voice is cleared (after sending)
      setPreview(false);
      setIsPlaying(false);
      setPlaybackTime(0);
      setAudioDuration(0);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }
    };
  }, [voice, setupAudioPlayback]);

  // Reset preview when modal is closed (after sending message)
  useEffect(() => {
    if (!isOpen && Preview) {
      setPreview(false);
      setIsPlaying(false);
      setPlaybackTime(0);
    }
  }, [isOpen, Preview]);

  // 🎙️ Start Recording
  const handleMicClick = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Voice recording is not supported in this browser");
        return;
      }

      // Request microphone permission with optimized constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        alert("Audio recording is not supported in this browser");
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setVoice(blob);
        chunksRef.current = [];
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setIsPaused(false);
        setTime(0);
      };

      mediaRecorder.start();
      setIsOpen(true);
      setIsRecording(true);
      setIsPaused(false);
      setTime(0);
    } catch (error) {
      console.error("Microphone access error:", error);

      // Better error messages for different scenarios
      const err = error as DOMException;
      if (err.name === "NotAllowedError") {
        alert(
          "Microphone permission denied. Please allow microphone access and try again."
        );
      } else if (err.name === "NotFoundError") {
        alert(
          "No microphone found. Please connect a microphone and try again."
        );
      } else if (err.name === "NotSupportedError") {
        alert("Audio recording is not supported in this browser.");
      } else {
        alert(
          "Failed to access microphone. Please check your settings and try again."
        );
      }
    }
  };

  // ❌ Cancel Recording
  const handleCancel = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsOpen(false);
    setIsPaused(false);
    setTime(0);
    setVoice(null);
    setPreview(false);
    setIsPlaying(false);
    setPlaybackTime(0);
    setAudioDuration(0);
    
    // Clean up audio
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
  };

  // ⏸️ Pause Recording
  const handlePause = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  // ▶️ Resume Recording
  const handleResume = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  // ✅ Stop and Save Recording
  const handleDone = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setPreview(true);
    }
  };

  // Time counter
  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">

      {isRecording ? (
        <div
          ref={containerRef}
          className="flex items-center bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-lg border border-slate-200 dark:border-slate-700"
        >
          {/* Cancel Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Recording Waveform Animation */}
          <div className="flex items-center gap-1 mx-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all ${
                  !isPaused 
                    ? 'bg-blue-500 animate-pulse' 
                    : 'bg-blue-400'
                }`}
                style={{
                  height: isPaused 
                    ? '8px' 
                    : `${8 + Math.sin(Date.now() / 200 + i) * 4}px`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>

          {/* Time Display */}
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {formatTime(time)}
            </span>
          </div>

          {/* Pause and Resume */}
          <Button
            size="icon"
            variant="ghost"
            onClick={isPaused ? handleResume : handlePause}
            className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </Button>

          {/* Done Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDone}
            className="h-8 w-8 rounded-full text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200 hover:bg-green-100 dark:hover:bg-green-700"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      ) : Preview ? (
        <div className="flex items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-2 space-x-3 max-w-md">
          {/* Voice Icon */}
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.784L4.76 13.85A1 1 0 014 13v-2a1 1 0 01.76-.851l3.623-2.934a1 1 0 01.617-.784zM12 8v4a1 1 0 01-2 0V8a1 1 0 012 0zm3 2a1 1 0 00-1 1v.5a1 1 0 002 0V11a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Audio Info & Play Button */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePlayVoice}
              className="h-7 w-7 rounded-full p-0 text-blue-600 hover:bg-blue-100 flex-shrink-0"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            
            <div className="flex items-center space-x-1 text-xs text-blue-600 min-w-0">
              <span className="truncate">
                {voice ? (voice.size / 1024).toFixed(1) : '0'}KB
                {audioDuration > 0 && ` • ${audioDuration.toFixed(1)}s`}
              </span>
            </div>

            {/* Mini Progress Bar */}
            {audioDuration > 0 && isPlaying && (
              <div className="flex-1 bg-blue-200 rounded-full h-1 min-w-8">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                  style={{
                    width: `${audioDuration > 0 && isFinite(audioDuration) ? Math.min(100, (playbackTime / audioDuration) * 100) : 0}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Remove Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setVoice(null);
              setPreview(false);
              setIsPlaying(false);
              setPlaybackTime(0);
              setAudioDuration(0);
              setIsOpen(false);
            }}
            className="h-7 w-7 rounded-full p-0 text-blue-600 hover:bg-blue-100 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          onClick={handleMicClick}
          disabled={disabled}
          className={`h-8 w-8 rounded-full transition-all ${
            disabled
              ? "text-gray-400 cursor-not-allowed opacity-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-300"
          }`}
        >
          <Mic className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
