'use client';

import { SessionProvider } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-navy-dark">
        <div className="flex">
          {/* Sidebar will be added later */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
