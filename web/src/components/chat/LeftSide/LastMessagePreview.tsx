import type { ILastMessage } from "../../../types/message/types"

interface LastMessagePreviewProps {
  message: ILastMessage | null | undefined
}

export default function LastMessagePreview({ message }: LastMessagePreviewProps) {
  if (!message) {
    return <span className="text-slate-500">No messages yet</span>
  }

  const { sender, content, type } = message

  if (type === "image") {
    return <span className="text-slate-400">📷 Image</span>
  }

  if (type === "video") {
    return <span className="text-slate-400">🎥 Video</span>
  }

  if (type === "audio") {
    return <span className="text-slate-400">🎵 Audio</span>
  }

  if (type === "file") {
    return <span className="text-slate-400">📎 File</span>
  }

  if (content.text) {
    return (
      <span>
        <strong className="text-slate-300">{sender?.name || "Deleted User"}:</strong> {content.text}
      </span>
    )
  }

  return <span className="text-slate-500">Message</span>
}
