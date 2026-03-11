export function BlogListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-off-white">All Blog Posts</h2>
      </div>
      <div className="h-12 bg-white/10 rounded-lg animate-pulse max-w-md" />
      <div className="bg-steel/30 rounded-xl border border-mist/20 p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-coral border-r-transparent mb-4" />
        <p className="text-mist">Loading blog posts...</p>
      </div>
    </div>
  );
}
