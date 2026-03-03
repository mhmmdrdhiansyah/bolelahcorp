import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch stats for dashboard
  const [
    totalPortfolios,
    publishedPortfolios,
    totalPosts,
    publishedPosts
  ] = await Promise.all([
    prisma.portfolio.count(),
    prisma.portfolio.count({ where: { featured: true } }),
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
  ]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-off-white mb-2">Admin Dashboard</h1>
          <p className="text-mist">Welcome back, {session.user?.name || 'Admin'}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mist text-sm">Total Portfolios</p>
                <p className="text-2xl font-bold text-off-white">{totalPortfolios}</p>
              </div>
              <div className="text-coral text-4xl">📁</div>
            </div>
          </div>

          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mist text-sm">Published Portfolios</p>
                <p className="text-2xl font-bold text-off-white">{publishedPortfolios}</p>
              </div>
              <div className="text-mist text-4xl">⭐</div>
            </div>
          </div>

          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mist text-sm">Total Blog Posts</p>
                <p className="text-2xl font-bold text-off-white">{totalPosts}</p>
              </div>
              <div className="text-mist text-4xl">📝</div>
            </div>
          </div>

          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mist text-sm">Published Posts</p>
                <p className="text-2xl font-bold text-off-white">{publishedPosts}</p>
              </div>
              <div className="text-coral text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/portfolios" className="card card-hover block">
            <h3 className="font-bold text-off-white mb-1">📁 Portfolios</h3>
            <p className="text-mist text-sm">Manage portfolio items</p>
          </a>

          <a href="/admin/posts" className="card card-hover block">
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
    </div>
  );
}