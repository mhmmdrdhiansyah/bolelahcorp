import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/constants';

// ============================================================================
// Sitemap Generation
// ============================================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get all published blog posts
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Get all published portfolio items
    const portfolios = await prisma.portfolio.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Get categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
      },
    });

    // Get tags
    const tags = await prisma.tag.findMany({
      select: {
        slug: true,
      },
    });

    // Base routes
    const baseRoutes: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: `${SITE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/portfolio`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ];

    // Blog post routes
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Portfolio routes
    const portfolioRoutes: MetadataRoute.Sitemap = portfolios.map((portfolio) => ({
      url: `${SITE_URL}/portfolio/${portfolio.slug}`,
      lastModified: portfolio.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Category routes
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${SITE_URL}/blog?category=${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    // Tag routes
    const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: `${SITE_URL}/blog?tag=${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    }));

    return [
      ...baseRoutes,
      ...postRoutes,
      ...portfolioRoutes,
      ...categoryRoutes,
      ...tagRoutes,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return base routes on error
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: `${SITE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/portfolio`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];
  }
}
