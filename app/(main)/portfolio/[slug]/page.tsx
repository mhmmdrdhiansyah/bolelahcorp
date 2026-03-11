import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Header, Footer } from '@/components/layout';
import { formatDate } from '@/lib/utils';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import type { Metadata } from 'next';
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery';

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
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      select: {
        title: true,
        shortDesc: true,
        coverImage: true,
        metaTitle: true,
        metaDescription: true,
      },
    });

    if (!portfolio) {
      return {
        title: 'Portfolio Not Found',
      };
    }

    const title = portfolio.metaTitle || portfolio.title;
    const description = portfolio.metaDescription || portfolio.shortDesc || `View ${portfolio.title} project on ${SITE_NAME}`;
    const imageUrl = portfolio.coverImage || `${SITE_URL}/og-image.png`;
    const url = `${SITE_URL}/portfolio/${slug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
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
      title: 'Portfolio Project',
    };
  }
}

// ============================================================================
// Data Fetching
// ============================================================================

async function getPortfolio(slug: string) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
      },
    },
  });

  return portfolio;
}

async function getRelatedPortfolios(currentId: string, limit: number = 3) {
  return prisma.portfolio.findMany({
    where: {
      featured: true,
      id: { not: currentId },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDesc: true,
      coverImage: true,
      technologies: true,
    },
    orderBy: { order: 'asc' },
    take: limit,
  });
}

async function incrementViewCount(portfolioId: string) {
  try {
    await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Silently fail if we can't increment views
  }
}

// ============================================================================
// Generate Static Params
// ============================================================================

export async function generateStaticParams() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      select: { slug: true },
      take: 50,
    });

    return portfolios.map((portfolio) => ({
      slug: portfolio.slug,
    }));
  } catch {
    return [];
  }
}

// ============================================================================
// Portfolio Detail Page Component
// ============================================================================

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  if (!portfolio) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementViewCount(portfolio.id);

  // Get related portfolios
  const relatedPortfolios = await getRelatedPortfolios(portfolio.id);

  // Parse JSON data safely
  const technologies = Array.isArray(portfolio.technologies)
    ? portfolio.technologies
    : [];
  const images = Array.isArray(portfolio.images)
    ? portfolio.images
    : [];

  // Format completion date
  const completionDate = portfolio.completedAt
    ? formatDate(portfolio.completedAt, 'long')
    : null;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-navy">
        {/* Back to Portfolio */}
        <div className="bg-navy-dark border-b border-white/5">
          <div className="container max-w-6xl px-4 py-4">
            <Link
              href="/#portfolio"
              className="inline-flex items-center gap-2 text-sm text-mist hover:text-coral transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Portfolio
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="container max-w-6xl px-4 py-12 md:py-16">
          {/* Cover Image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 border border-white/10">
            {portfolio.coverImage ? (
              <Image
                src={portfolio.coverImage}
                alt={portfolio.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-steel">
                <span className="text-off-white/30 text-6xl font-bold">{portfolio.title.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Technologies Tags */}
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {technologies.map((tech: string, i: number) => (
                <span
                  key={`${portfolio.id}-${tech}-${i}`}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full bg-steel/20 text-mist border border-steel/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-off-white mb-6 leading-tight">
            {portfolio.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-mist/70 text-sm mb-8 pb-8 border-b border-white/10">
            {/* Completion Date */}
            {completionDate && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Completed {completionDate}</span>
              </div>
            )}

            {/* Author */}
            {portfolio.author && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{portfolio.author.name || 'Bolehah Corp'}</span>
              </div>
            )}

            {/* Views */}
            {portfolio.views > 0 && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{portfolio.views} view{portfolio.views !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Short Description */}
          {portfolio.shortDesc && (
            <div className="bg-steel/10 border-l-4 border-coral p-6 rounded-r-lg mb-10">
              <p className="text-lg text-mist/90">{portfolio.shortDesc}</p>
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap gap-4 mb-12">
            {portfolio.projectUrl && (
              <a
                href={portfolio.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white font-semibold rounded-lg hover:bg-coral-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
            {portfolio.githubUrl && (
              <a
                href={portfolio.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-off-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Source Code
              </a>
            )}
          </div>

          {/* Full Description */}
          <div className="prose prose-invert prose-lg max-w-none mb-16">
            <div className="text-mist/90 whitespace-pre-wrap leading-relaxed">
              {portfolio.description}
            </div>
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-off-white mb-8">
                Project Gallery
              </h2>
              <PortfolioGallery images={images} title={portfolio.title} />
            </section>
          )}

          {/* Author Info */}
          {portfolio.author && portfolio.author.bio && (
            <div className="mt-12 p-6 bg-steel/10 rounded-2xl border border-white/5">
              <div className="flex items-start gap-4">
                {portfolio.author.image ? (
                  <Image
                    src={portfolio.author.image}
                    alt={portfolio.author.name || 'Author'}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-15 h-15 rounded-full bg-steel/30 flex items-center justify-center text-off-white font-bold text-xl">
                    {portfolio.author.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <h4 className="text-off-white font-semibold mb-1">
                    About {portfolio.author.name || 'the Author'}
                  </h4>
                  <p className="text-mist/70 text-sm leading-relaxed">{portfolio.author.bio}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Related Projects */}
        {relatedPortfolios.length > 0 && (
          <section className="container max-w-6xl px-4 py-16 border-t border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold text-off-white mb-8">
              Related Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPortfolios.map((related) => {
                const relatedTechnologies = Array.isArray(related.technologies)
                  ? related.technologies
                  : [];

                return (
                  <Link
                    key={related.id}
                    href={`/portfolio/${related.slug}`}
                    className="group flex flex-col bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
                  >
                    {related.coverImage && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-off-white font-semibold mb-2 line-clamp-2 group-hover:text-coral transition-colors">
                        {related.title}
                      </h3>
                      {related.shortDesc && (
                        <p className="text-mist/70 text-sm line-clamp-2 flex-grow">
                          {related.shortDesc}
                        </p>
                      )}
                      {relatedTechnologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {relatedTechnologies.slice(0, 3).map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs rounded-full bg-white/5 text-mist/70"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
