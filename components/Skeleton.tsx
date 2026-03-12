export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-privy-gray-800 ${className}`}
      aria-hidden
    />
  );
}

export function FileCardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="mt-2 h-4 w-24" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
