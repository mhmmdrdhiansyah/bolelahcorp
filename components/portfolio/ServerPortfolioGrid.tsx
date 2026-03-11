// Server Component - handles data fetching
// This file has NO 'use client' directive

import { PortfolioGrid } from './PortfolioGrid';
import type { Portfolio } from '@/types';

// ============================================================================
// Data Fetching Function
// ============================================================================

async function getPortfolios() {
  try {
    const { prisma } = await import('@/lib/prisma');

    const portfolios = await prisma.portfolio.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        shortDesc: true,
        coverImage: true,
        images: true,
        technologies: true,
        projectUrl: true,
        githubUrl: true,
        featured: true,
        order: true,
        completedAt: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      },
    });

    return portfolios;
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return [];
  }
}

// ============================================================================
// Server Component Wrapper
// ============================================================================

export async function ServerPortfolioGrid({ className, viewAllLink }: { className?: string; viewAllLink?: string }) {
  const portfolios = await getPortfolios();

  // Add safety check - ensure we have an array
  const portfoliosArray = Array.isArray(portfolios) ? portfolios : [];

  // Pass data to Client Component with type cast for Prisma JsonValue compatibility
  return <PortfolioGrid portfolios={portfoliosArray as Portfolio[]} className={className} viewAllLink={viewAllLink} />;
}
