export default function MessageStatus({ status }: { status: string }) {
  return (
    <div className="w-full flex items-center justify-end space-x-1 py-1">
      <span className="text-sm text-gray-400 capitalize">{status}</span>
    </div>
  );
}
