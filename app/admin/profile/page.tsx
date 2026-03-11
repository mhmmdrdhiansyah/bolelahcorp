import { Suspense } from 'react';
import { PasswordChangeForm } from '@/components/admin/PasswordChangeForm';
import { PasswordChangeFormSkeleton } from '@/components/admin/PasswordChangeFormSkeleton';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-7xl mx-auto">
      {/* User Info Header */}
      <div className="mb-8 p-6 rounded-xl bg-steel/30 border border-mist/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-coral">
              {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-off-white">
              {session?.user?.name || 'Admin'}
            </h1>
            <p className="text-mist">{session?.user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-coral/20 text-coral border border-coral/30">
              {session?.user?.role === 'ADMIN' ? 'Administrator' : 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <Suspense fallback={<PasswordChangeFormSkeleton />}>
        <PasswordChangeForm />
      </Suspense>
    </div>
  );
}
