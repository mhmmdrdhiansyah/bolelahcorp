import { prisma } from '@/lib/prisma';
import { Header, Footer } from '@/components/layout';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

// ============================================================================
// Metadata
// ============================================================================

export const metadata: Metadata = {
  title: `Journal Archive - ${SITE_NAME}`,
  description: 'Browse through our complete archive of journal entries, articles, and thoughts.',
  openGraph: {
    title: `Journal Archive - ${SITE_NAME}`,
    description: 'Browse through our complete archive of journal entries, articles, and thoughts.',
    type: 'website',
    url: `${SITE_URL}/journal`,
  },
  alternates: {
    canonical: `${SITE_URL}/journal`,
  },
};

// ============================================================================
// Types
// ============================================================================

interface GroupedPosts {
  year: number;
  months: {
    month: number;
    monthName: string;
    posts: {
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      publishedAt: Date;
      category: {
        name: string;
        slug: string;
      } | null;
      tags: {
        name: string;
        slug: string;
      }[];
    }[];
  }[];
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getAllPublishedPosts() {
  return prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { not: null },
    },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      postTags: {
        select: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          tag: {
            name: 'asc',
          },
        },
      },
    },
  });
}

function groupPostsByYearAndMonth(posts: Awaited<ReturnType<typeof getAllPublishedPosts>>): GroupedPosts[] {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const grouped: Record<number, Record<number, typeof posts>> = {};

  posts.forEach((post) => {
    const date = new Date(post.publishedAt!);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!grouped[year]) {
      grouped[year] = {};
    }
    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }

    grouped[year][month].push({
      ...post,
      tags: post.postTags.map((pt) => pt.tag),
    });
  });

  // Convert to array and sort
  return Object.entries(grouped)
    .map(([year, months]) => ({
      year: parseInt(year),
      months: Object.entries(months)
        .map(([month, posts]) => ({
          month: parseInt(month),
          monthName: monthNames[parseInt(month)],
          posts,
        }))
        .sort((a, b) => b.month - a.month), // Recent months first
    }))
    .sort((a, b) => b.year - a.year); // Recent years first
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
      name: true,
      slug: true,
    },
  });
}

// ============================================================================
// Journal Archive Page Component
// ============================================================================

export default async function JournalArchivePage() {
  const [allPosts, categories] = await Promise.all([
    getAllPublishedPosts(),
    getCategories(),
  ]);

  const groupedPosts = groupPostsByYearAndMonth(allPosts);
  const totalPosts = allPosts.length;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-navy">
        {/* Page Header */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-navy-dark">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-coral/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-steel/10 rounded-full blur-[100px]" />
          </div>

          <div className="container max-w-5xl px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block py-1.5 px-4 rounded-full bg-coral/10 text-coral border border-coral/20 text-sm font-semibold tracking-wider uppercase mb-6">
                Archive
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-off-white mb-6">
                Journal Archive
              </h1>
              <p className="text-lg md:text-xl text-mist/80 mb-8">
                Browse through our complete collection of thoughts, tutorials, and insights.
              </p>
              <div className="flex items-center justify-center gap-6 text-mist/60 text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5-1.253" />
                  </svg>
                  {totalPosts} articles
                </span>
                <span className="w-1 h-1 rounded-full bg-mist/30" />
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {groupedPosts.length} years
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Quick Links */}
        {categories.length > 0 && (
          <section className="py-6 border-y border-white/5 bg-navy/50">
            <div className="container max-w-5xl px-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="text-sm font-semibold text-mist/60 uppercase tracking-wider">
                  Browse by:
                </span>
                <Link
                  href="/blog"
                  className="px-4 py-1.5 text-sm rounded-full bg-coral text-white hover:bg-coral-dark transition-colors"
                >
                  All
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/blog?category=${category.slug}`}
                    className="px-4 py-1.5 text-sm rounded-full bg-white/5 text-mist hover:bg-white/10 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Archive Content */}
        <section className="py-16 md:py-24">
          <div className="container max-w-5xl px-4">
            {groupedPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📚</div>
                <h3 className="text-2xl font-bold text-off-white mb-4">
                  Archive is empty
                </h3>
                <p className="text-mist/70">
                  No journal entries have been published yet.
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {groupedPosts.map((yearGroup) => (
                  <div key={yearGroup.year} className="animate-fade-in">
                    {/* Year Header */}
                    <div className="mb-8 pb-4 border-b border-white/10">
                      <h2 className="text-3xl md:text-4xl font-bold text-off-white flex items-center gap-4">
                        <span className="text-coral">{yearGroup.year}</span>
                        <span className="text-mist/30 text-2xl font-normal">
                          ({yearGroup.months.reduce((acc, m) => acc + m.posts.length, 0)} articles)
                        </span>
                      </h2>
                    </div>

                    {/* Months */}
                    <div className="space-y-12 ml-0 md:ml-8">
                      {yearGroup.months.map((monthGroup) => (
                        <div key={monthGroup.month} className="relative">
                          {/* Month Header */}
                          <div className="sticky top-4 z-10 mb-6 inline-block">
                            <span className="px-4 py-2 rounded-lg bg-steel/20 border border-steel/30 text-off-white font-semibold">
                              {monthGroup.monthName}
                            </span>
                          </div>

                          {/* Posts List */}
                          <div className="space-y-4">
                            {monthGroup.posts.map((post, index) => (
                              <article
                                key={post.id}
                                className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-coral/30 transition-all duration-300"
                              >
                                <Link href={`/blog/${post.slug}`} className="block">
                                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    {/* Date */}
                                    <div className="md:w-24 flex-shrink-0">
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-coral">
                                          {new Date(post.publishedAt).getDate()}
                                        </div>
                                        <div className="text-xs text-mist/60 uppercase">
                                          {monthGroup.monthName.slice(0, 3).toUpperCase()}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow">
                                      <h3 className="text-xl font-semibold text-off-white mb-2 group-hover:text-coral transition-colors">
                                        {post.title}
                                      </h3>

                                      {post.excerpt && (
                                        <p className="text-mist/70 text-sm line-clamp-2 mb-3">
                                          {post.excerpt}
                                        </p>
                                      )}

                                      <div className="flex flex-wrap items-center gap-3 text-xs text-mist/50">
                                        {post.category && (
                                          <span className="px-2 py-1 rounded-full bg-steel/20 text-steel">
                                            {post.category.name}
                                          </span>
                                        )}
                                        {post.tags.slice(0, 3).map((tag) => (
                                          <span key={tag.slug} className="text-mist/60">
                                            #{tag.name}
                                          </span>
                                        ))}
                                        {post.tags.length > 3 && (
                                          <span className="text-mist/60">
                                            +{post.tags.length - 3} more
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="md:w-8 flex-shrink-0 flex items-center justify-center">
                                      <svg
                                        className="w-5 h-5 text-mist/30 group-hover:text-coral group-hover:translate-x-1 transition-all"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </div>
                                </Link>
                              </article>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 border-t border-white/5 bg-steel/10">
          <div className="container max-w-4xl px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-off-white mb-4">
              Enjoyed the articles?
            </h2>
            <p className="text-mist/80 mb-8">
              Stay updated with our latest thoughts and tutorials.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-coral text-white hover:bg-coral-dark transition-colors font-semibold"
              >
                Get in Touch
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-off-white hover:bg-white/10 transition-colors font-semibold"
              >
                View Blog
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// ============================================================================
// Generate Static Params
// ============================================================================

export async function generateStaticParams() {
  // No dynamic params needed for archive page
  return [];
}
