// Server Component - handles data fetching
// This file has NO 'use client' directive

import { BlogList } from './BlogList';
import type { BlogPost } from './BlogCard';

// ============================================================================
// Data Fetching Function
// ============================================================================

async function getBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  try {
    const { prisma } = await import('@/lib/prisma');

    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return posts as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// ============================================================================
// Server Component Wrapper
// ============================================================================

export async function ServerBlogList({
  className,
  limit
}: {
  className?: string;
  limit?: number;
}) {
  const posts = await getBlogPosts(limit);

  // Pass data to Client Component
  return <BlogList posts={posts} className={className} limit={limit} />;
}
