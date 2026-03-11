import { prisma } from '@/lib/prisma';
import { PublicBlogCard } from '@/components/blog/PublicBlogCard';
import { Header, Footer } from '@/components/layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants';

// ============================================================================
// Metadata
// ============================================================================

export const metadata: Metadata = {
  title: 'Blog - Bolehah Corp',
  description: 'Insights, tutorials, and thoughts on web development, design, and technology.',
  openGraph: {
    title: 'Blog - Bolehah Corp',
    description: 'Insights, tutorials, and thoughts on web development, design, and technology.',
    type: 'website',
    url: `${SITE_URL}/blog`,
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

// ============================================================================
// Types
// ============================================================================

interface SearchParams {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    page?: string;
  }>;
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getPublishedPosts() {
  return prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { not: null }, // Ensure publishedAt is not null
    },
    orderBy: { publishedAt: 'desc' },
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
      postTags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: {
      posts: {
        some: { status: 'PUBLISHED' },
      },
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: { posts: true },
      },
    },
  });
}

async function getTags() {
  return prisma.tag.findMany({
    where: {
      postTags: {
        some: {
          post: { status: 'PUBLISHED' },
        },
      },
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: { postTags: true },
      },
    },
  });
}

// ============================================================================
// Blog Listing Page Component
// ============================================================================

export default async function BlogPage({ searchParams }: SearchParams) {
  const params = await searchParams;
  const categorySlug = params.category;
  const tagSlug = params.tag;

  // Fetch all data
  const [allPosts, categories, tags] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
    getTags(),
  ]);

  // Filter posts based on search params
  let filteredPosts = allPosts;

  if (categorySlug) {
    filteredPosts = filteredPosts.filter(
      (post) => post.category?.slug === categorySlug
    );
  }

  if (tagSlug) {
    filteredPosts = filteredPosts.filter((post) =>
      post.postTags.some((pt) => pt.tag.slug === tagSlug)
    );
  }

  // Transform posts to include tags array
  const posts = filteredPosts.map((post) => ({
    ...post,
    tags: post.postTags.map((pt) => pt.tag),
  }));

  // Get current category/tag name
  const currentCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null;
  const currentTag = tagSlug ? tags.find((t) => t.slug === tagSlug) : null;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-navy">
        {/* Page Header */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-coral/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-steel/10 rounded-full blur-[100px]" />
          </div>

          <div className="container max-w-6xl px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-off-white mb-6">
                Blog
              </h1>
              <p className="text-lg md:text-xl text-mist/80">
                Insights, tutorials, and thoughts on web development, design, and technology.
              </p>

              {/* Current filter info */}
              {(currentCategory || currentTag) && (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-steel/20 border border-steel/30">
                  <span className="text-mist/60 text-sm">Filtering by:</span>
                  <span className="text-coral font-medium">
                    {currentCategory?.name || currentTag?.name}
                  </span>
                  <Link
                    href="/blog"
                    className="ml-2 text-mist/60 hover:text-off-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Categories & Tags Filter */}
        <section className="py-8 border-y border-white/5 bg-navy-dark/50">
          <div className="container max-w-6xl px-4">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-mist/60 uppercase tracking-wider">
                Categories:
              </span>
              <Link
                href="/blog"
                className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                  !categorySlug
                    ? 'bg-coral text-white'
                    : 'bg-white/5 text-mist hover:bg-white/10'
                }`}
              >
                All
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog?category=${category.slug}`}
                  className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                    categorySlug === category.slug
                      ? 'bg-coral text-white'
                      : 'bg-white/5 text-mist hover:bg-white/10'
                  }`}
                >
                  {category.name}
                  <span className="ml-1.5 text-mist/50">({category._count.posts})</span>
                </Link>
              ))}
              <span className="ml-auto hidden sm:block">
                <Link
                  href="/journal"
                  className="text-sm text-coral hover:text-coral/80 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 8a2 2 0 002 2v10a2 2 0 002 2h14a2 2 0 002-2v-4M9 12h6" />
                  </svg>
                  View Archive
                </Link>
              </span>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-mist/60 uppercase tracking-wider mr-2">
                  Popular Tags:
                </span>
                {tags.slice(0, 10).map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      tagSlug === tag.slug
                        ? 'bg-steel text-white'
                        : 'bg-white/5 text-mist/70 hover:bg-steel/20 hover:text-off-white'
                    }`}
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl px-4">
            {posts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {posts.map((post, index) => (
                  <PublicBlogCard key={post.id} post={post} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-off-white mb-4">
                  No posts found
                </h3>
                <p className="text-mist/70 mb-8">
                  {categorySlug || tagSlug
                    ? 'No posts match your current filter.'
                    : 'No blog posts have been published yet.'}
                </p>
                {(categorySlug || tagSlug) && (
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coral text-white hover:bg-coral-dark transition-colors font-semibold"
                  >
                    Clear Filters
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// ============================================================================
// Generate Static Params for Categories/Tags
// ============================================================================

export async function generateStaticParams() {
  // We'll statically generate pages for each category and tag
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const tags = await prisma.tag.findMany({
    select: { slug: true },
  });

  return [
    ...categories.map((c) => ({ category: c.slug })),
    ...tags.map((t) => ({ tag: t.slug })),
  ];
}
