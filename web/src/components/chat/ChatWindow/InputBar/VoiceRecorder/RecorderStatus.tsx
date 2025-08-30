"use client";

interface RecorderStatusProps {
  isRecording: boolean;
  isPlaying: boolean;
  time: number;
}

export default function RecorderStatus({
  isRecording,
  isPlaying,
  time,
}: RecorderStatusProps) {
  return (
    <>
      <div className="flex-1 text-center">
        {isRecording
          ? "Recording..."
          : isPlaying
          ? "Playing..."
          : "Paused"}
      </div>
      <div className="w-12 text-right">
        {new Date(time * 1000).toISOString().substr(14, 5)}
      </div>
    </>
  );
}
