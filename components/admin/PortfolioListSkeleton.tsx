export function PortfolioListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="h-8 bg-white/10 rounded w-32 animate-pulse" />
        <div className="h-10 bg-white/10 rounded w-36 animate-pulse" />
      </div>

      {/* Search skeleton */}
      <div className="mb-6">
        <div className="h-12 bg-white/10 rounded-lg animate-pulse max-w-md" />
      </div>

      {/* Table skeleton */}
      <div className="bg-steel/30 rounded-xl border border-mist/20 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-mist/20">
          <div className="col-span-1 h-4 bg-white/10 rounded animate-pulse" />
          <div className="col-span-3 h-4 bg-white/10 rounded animate-pulse" />
          <div className="col-span-3 h-4 bg-white/10 rounded animate-pulse" />
          <div className="col-span-2 h-4 bg-white/10 rounded animate-pulse" />
          <div className="col-span-1 h-4 bg-white/10 rounded animate-pulse" />
          <div className="col-span-2 h-4 bg-white/10 rounded animate-pulse" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-mist/10 last:border-b-0">
            <div className="col-span-1 h-12 bg-white/10 rounded-lg animate-pulse" />
            <div className="col-span-3">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-white/10 rounded w-1/2 animate-pulse" />
            </div>
            <div className="col-span-3 h-4 bg-white/10 rounded w-2/3 animate-pulse self-center" />
            <div className="col-span-2 h-6 bg-white/10 rounded-full w-16 animate-pulse self-center" />
            <div className="col-span-1 h-4 bg-white/10 rounded w-8 animate-pulse self-center" />
            <div className="col-span-2 flex gap-2">
              <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
              <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
              <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
