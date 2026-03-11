import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BlogContent } from '@/components/blog/BlogContent';
import { Header, Footer } from '@/components/layout';
import { formatDate, getReadingTime } from '@/lib/utils';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import type { Metadata } from 'next';

// ============================================================================
// Types
// ============================================================================

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ============================================================================
// Generate Metadata for SEO
// ============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      select: {
        title: true,
        excerpt: true,
        coverImage: true,
        metaTitle: true,
        metaDescription: true,
        ogImage: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || `Read ${post.title} on ${SITE_NAME}`;
    const imageUrl = post.ogImage || post.coverImage || `${SITE_URL}/og-image.png`;
    const url = `${SITE_URL}/blog/${slug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.publishedAt?.toISOString(),
        authors: [SITE_NAME],
        url,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch {
    return {
      title: 'Blog Post',
    };
  }
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getBlogPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      postTags: {
        include: {
          tag: {
            select: {
              id: true,
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

  return post;
}

async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit: number = 3
) {
  if (!categoryId) return [];

  return prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      categoryId,
      id: { not: postId },
    },
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
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  });
}

async function incrementViewCount(postId: string) {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Silently fail if we can't increment views
  }
}

// ============================================================================
// Generate Static Params (for static generation)
// ============================================================================

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
      take: 50, // Limit for static generation
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

// ============================================================================
// Blog Detail Page Component
// ============================================================================

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  // Return 404 if post not found
  if (!post) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementViewCount(post.id);

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, post.categoryId);

  // Format dates
  const publishedDate = formatDate(post.publishedAt!, 'long');
  const readingTime = getReadingTime(post.content);

  // Extract tags
  const tags = post.postTags.map((pt) => pt.tag);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-navy">
        {/* Back to Blog */}
        <div className="bg-navy-dark border-b border-white/5">
          <div className="container max-w-4xl px-4 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-mist hover:text-coral transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="container max-w-4xl px-4 py-12 md:py-16">
          {/* Category */}
          {post.category && (
            <Link
              href={`/blog?category=${post.category.slug}`}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-coral/10 text-coral border border-coral/20 hover:bg-coral/20 transition-colors">
                {post.category.name}
              </span>
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-off-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-mist/70 text-sm mb-8 pb-8 border-b border-white/10">
            {/* Author */}
            <div className="flex items-center gap-3">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || 'Author'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-steel/30 flex items-center justify-center text-off-white font-semibold">
                  {post.author.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <div>
                <p className="text-off-white font-medium">{post.author.name || 'Anonymous'}</p>
                {post.author.bio && (
                  <p className="text-xs text-mist/60">{post.author.bio}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time>{publishedDate}</time>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readingTime} min read</span>
            </div>

            {/* Views */}
            {post.views > 0 && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views} view{post.views !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.coverImage && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 border border-white/10">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 900px"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="bg-steel/10 border-l-4 border-coral p-6 rounded-r-lg mb-10">
              <p className="text-lg text-mist/80 italic">{post.excerpt}</p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <BlogContent content={post.content} />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h4 className="text-sm font-semibold text-mist/60 uppercase tracking-wider mb-4">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-4 py-2 text-sm rounded-full bg-white/5 text-mist hover:bg-coral/10 hover:text-coral border border-white/10 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author.bio && (
            <div className="mt-12 p-6 bg-steel/10 rounded-2xl border border-white/5">
              <div className="flex items-start gap-4">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || 'Author'}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-15 h-15 rounded-full bg-steel/30 flex items-center justify-center text-off-white font-bold text-xl">
                    {post.author.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <h4 className="text-off-white font-semibold mb-1">
                    Written by {post.author.name || 'Anonymous'}
                  </h4>
                  <p className="text-mist/70 text-sm leading-relaxed">{post.author.bio}</p>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="container max-w-4xl px-4 py-16 border-t border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold text-off-white mb-8">
              Related Posts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group flex flex-col bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
                >
                  {relatedPost.coverImage && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-off-white font-semibold mb-2 line-clamp-2 group-hover:text-coral transition-colors">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-mist/70 text-sm line-clamp-2 flex-grow">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <time className="text-xs text-mist/50 mt-3">
                      {formatDate(relatedPost.publishedAt!, 'short')}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

