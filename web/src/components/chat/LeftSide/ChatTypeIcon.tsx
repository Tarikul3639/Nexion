export default function ChatTypeIcon({ type }: { type?: string }) {
  if (!type) return null;

  switch (type) {
    case "class":
      return <span className="text-white text-xs font-bold">C</span>;
    case "group":
      return <span className="text-white text-xs font-bold">G</span>;
    default:
      return null;
  }
}
