import { DraftMessage } from "@/types/message/message";

export default function TextCard({ msg }: { msg: DraftMessage }) {
  if (!msg.text) return null;

  return (
    <div className="relative text-base text-gray-50 space-y-2.5 leading-relaxed whitespace-pre-wrap break-words">
      {msg.text && <p>{msg.text}</p>}
    </div>
  );
}
