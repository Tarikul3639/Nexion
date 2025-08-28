import React from "react";

export default function ChatTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "class":
      return <span className="text-[#614BFF] text-xs font-bold">C</span>;
    case "group":
      return <span className="text-[#35D57F] text-xs font-bold">G</span>;
    default:
      return null;
  }
}
