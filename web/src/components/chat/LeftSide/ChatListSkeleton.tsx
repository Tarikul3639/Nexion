import { Skeleton } from "@/components/ui/skeleton";

export default function ChatListSkeleton() {
  return (
    <div className="w-full h-full text-white md:px-2.5 py-2.5 space-y-3 overflow-hidden">
      {/* Search bar skeleton */}
      <div className="relative px-2">
        <Skeleton className="h-12 w-full rounded bg-[#2c2c2c]" />
        <Skeleton className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-1/2 rounded bg-[#373636]" />
        <Skeleton className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#373636]" />
      </div>
      <div className="px-2">
        <Skeleton className="h-6 w-full rounded bg-[#2c2c2c]" />
      </div>

      {/* Dummy chat items skeleton */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 px-4">
          <Skeleton className="h-12 w-12 rounded-sm bg-[#2c2c2c]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full rounded bg-[#2c2c2c]" />
            <Skeleton className="h-4 w-2/3 rounded bg-[#2c2c2c]" />
          </div>
        </div>
      ))}
    </div>
  );
}
