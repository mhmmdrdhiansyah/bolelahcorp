import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminSidebarProvider } from '@/components/admin/AdminLayout';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

// This layout applies to all /admin/* routes except those with their own layouts
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[#0a0f1e]">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
