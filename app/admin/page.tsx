import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { DashboardStats } from '@/components/admin';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Fetch stats for dashboard
  const [
    totalPortfolios,
    publishedPortfolios,
    totalPosts,
    publishedPosts,
    unreadMessages
  ] = await Promise.all([
    prisma.portfolio.count(),
    prisma.portfolio.count({ where: { featured: true } }),
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.contactSubmission.count({ where: { read: false } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-off-white mb-2">
          Welcome back, {session?.user?.name || 'Admin'}!
        </h1>
        <p className="text-mist">Here's what's happening with your portfolio today.</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        totalPortfolios={totalPortfolios}
        publishedPortfolios={publishedPortfolios}
        totalPosts={totalPosts}
        publishedPosts={publishedPosts}
      />

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <a href="/admin/messages" className="card card-hover block relative">
          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-coral text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
          <h3 className="font-bold text-off-white mb-1">✉️ Messages</h3>
          <p className="text-mist text-sm">{unreadMessages > 0 ? `${unreadMessages} unread` : 'View contact messages'}</p>
        </a>

        <a href="/admin/portfolios" className="card card-hover block">
          <h3 className="font-bold text-off-white mb-1">📁 Portfolios</h3>
          <p className="text-mist text-sm">Manage portfolio items</p>
        </a>

        <a href="/admin/blog" className="card card-hover block">
          <h3 className="font-bold text-off-white mb-1">📝 Blog Posts</h3>
          <p className="text-mist text-sm">Manage blog articles</p>
        </a>

        <a href="/admin/pages" className="card card-hover block">
          <h3 className="font-bold text-off-white mb-1">📄 Page Sections</h3>
          <p className="text-mist text-sm">Edit landing page content</p>
        </a>

        <a href="/admin/settings" className="card card-hover block">
          <h3 className="font-bold text-off-white mb-1">⚙️ Settings</h3>
          <p className="text-mist text-sm">Site settings & config</p>
        </a>
      </div>

      {/* Placeholder for Coming Soon */}
      <div className="mt-8 p-6 border border-dashed border-mist/30 rounded-xl">
        <p className="text-center text-mist">
          More features coming soon in Phase 3... 🚧
        </p>
      </div>
    </div>
  );
}
