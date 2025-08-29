"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, CircleStop } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RecorderControlsProps {
  isRecording: boolean;
  stop: boolean;
  audioURL: string | null;
  isPlaying: boolean;
  handlePlayPause: () => void;
  handleRecordingToggle: () => void;
}

export default function RecorderControls({
  isRecording,
  stop,
  audioURL,
  isPlaying,
  handlePlayPause,
  handleRecordingToggle,
}: RecorderControlsProps) {
  return (
    <>
      {stop && audioURL && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="bg-blue-900 hover:bg-blue-800 text-white h-8 w-8 rounded-full"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause />
              ) : (
                <Play />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? "Pause" : "Play"}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {isRecording && !stop && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="bg-blue-900 hover:bg-blue-800 text-white rounded-full"
              onClick={handleRecordingToggle}
            >
              <CircleStop />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Stop</p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
