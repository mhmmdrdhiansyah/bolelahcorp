'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebarProvider } from './AdminLayout';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminPageLayoutProps {
  children: ReactNode;
}

// Get page title from pathname
function getPageTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname.startsWith('/admin/portfolios')) return 'Portfolios';
  if (pathname.startsWith('/admin/blog')) return 'Blog Posts';
  if (pathname.startsWith('/admin/pages')) return 'Page Sections';
  if (pathname.startsWith('/admin/settings')) return 'Settings';
  return 'Admin';
}

export function AdminPageLayout({ children }: AdminPageLayoutProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[#0a0f1e]">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader title={pageTitle} />
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
