export function PasswordChangeFormSkeleton() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-off-white mb-2">Change Password</h2>
        <div className="h-4 bg-white/10 rounded w-64 animate-pulse" />
      </div>

      <div className="space-y-6">
        <div>
          <div className="h-4 bg-white/10 rounded w-40 mb-2 animate-pulse" />
          <div className="h-12 bg-white/10 rounded-xl animate-pulse" />
        </div>
        <div>
          <div className="h-4 bg-white/10 rounded w-36 mb-2 animate-pulse" />
          <div className="h-12 bg-white/10 rounded-xl animate-pulse" />
        </div>
        <div>
          <div className="h-4 bg-white/10 rounded w-44 mb-2 animate-pulse" />
          <div className="h-12 bg-white/10 rounded-xl animate-pulse" />
        </div>
        <div className="pt-4">
          <div className="h-12 bg-white/10 rounded-xl w-48 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
