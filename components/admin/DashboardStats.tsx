'use client';

import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface StatItem {
  title: string;
  value: number;
  icon: string;
  iconColor: 'coral' | 'mist' | 'off-white';
}

interface DashboardStatsProps {
  totalPortfolios: number;
  publishedPortfolios: number;
  totalPosts: number;
  publishedPosts: number;
  isLoading?: boolean;
}

// ============================================================================
// Skeleton Component
// ============================================================================

interface StatCardSkeletonProps {
  count?: number;
}

function StatCardSkeleton({ count = 4 }: StatCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded w-28 mb-3" />
              <div className="h-7 bg-white/10 rounded w-12" />
            </div>
            <div className="h-10 w-10 bg-white/10 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}

// ============================================================================
// Stat Card Component
// ============================================================================

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  iconColor: 'coral' | 'mist' | 'off-white';
}

function StatCard({ title, value, icon, iconColor }: StatCardProps) {
  const iconColorClasses = {
    coral: 'text-coral',
    mist: 'text-mist',
    'off-white': 'text-off-white',
  };

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-mist text-sm">{title}</p>
          <p className="text-2xl font-bold text-off-white">{value}</p>
        </div>
        <div className={cn('text-4xl', iconColorClasses[iconColor])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DashboardStats Component
// ============================================================================

export function DashboardStats({
  totalPortfolios,
  publishedPortfolios,
  totalPosts,
  publishedPosts,
  isLoading = false,
}: DashboardStatsProps) {
  const stats: StatItem[] = [
    {
      title: 'Total Portfolios',
      value: totalPortfolios,
      icon: '📁',
      iconColor: 'coral',
    },
    {
      title: 'Published Portfolios',
      value: publishedPortfolios,
      icon: '⭐',
      iconColor: 'mist',
    },
    {
      title: 'Total Blog Posts',
      value: totalPosts,
      icon: '📝',
      iconColor: 'mist',
    },
    {
      title: 'Published Posts',
      value: publishedPosts,
      icon: '✅',
      iconColor: 'coral',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCardSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}

// Export skeleton for use in Suspense boundaries
export { StatCardSkeleton };
