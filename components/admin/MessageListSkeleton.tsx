export function MessageListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-off-white">Messages</h2>
      </div>

      {/* Filters skeleton */}
      <div className="h-12 bg-white/10 rounded-lg animate-pulse max-w-md" />

      {/* Content skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* List skeleton */}
        <div className="lg:col-span-1 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-steel/20 rounded-xl border border-mist/10 p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2 mb-1" />
              <div className="h-3 bg-white/5 rounded w-1/3" />
            </div>
          ))}
        </div>

        {/* Detail skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-steel/30 rounded-xl border border-mist/20 p-6 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
            <div className="h-4 bg-white/5 rounded w-1/2 mb-6" />
            <div className="h-32 bg-white/5 rounded mb-6" />
            <div className="h-10 bg-white/10 rounded w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
