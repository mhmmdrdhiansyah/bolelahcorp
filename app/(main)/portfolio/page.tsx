import { prisma } from '@/lib/prisma';
import { Header, Footer } from '@/components/layout';
import { SITE_NAME } from '@/lib/constants';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

// ============================================================================
// SEO Metadata
// ============================================================================

export const metadata: Metadata = {
  title: `Portfolio - ${SITE_NAME}`,
  description: 'Explore our portfolio of web development projects, showcasing our expertise in Next.js, React, WordPress, and more.',
};

// ============================================================================
// Data Fetching
// ============================================================================

async function getAllPortfolios() {
  const portfolios = await prisma.portfolio.findMany({
    orderBy: [
      { featured: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
    select: {
      id: true,
      title: true,
      slug: true,
      shortDesc: true,
      coverImage: true,
      technologies: true,
      projectUrl: true,
      githubUrl: true,
      completedAt: true,
      views: true,
      featured: true,
    },
  });

  return portfolios;
}

// ============================================================================
// Portfolio List Page
// ============================================================================

export default async function PortfolioPage() {
  const portfolios = await getAllPortfolios();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-navy">
        {/* Header Section */}
        <section className="bg-navy-dark border-b border-white/5">
          <div className="container max-w-6xl px-4 py-16 md:py-24">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-off-white mb-6">
              Our <span className="text-coral">Portfolio</span>
            </h1>
            <p className="text-lg text-mist/80 max-w-2xl">
              Explore our latest web development projects. We specialize in building modern,
              performant web applications using cutting-edge technologies.
            </p>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="container max-w-6xl px-4 py-16">
          {portfolios.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mist/60 text-lg">No portfolios available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios.map((portfolio, index) => {
                const technologies = Array.isArray(portfolio.technologies)
                  ? portfolio.technologies
                  : [];

                return (
                  <Link
                    key={portfolio.id}
                    href={`/portfolio/${portfolio.slug}`}
                    className="group flex flex-col bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:bg-white/10 hover:border-coral/30 transition-all duration-300"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-video overflow-hidden">
                      {portfolio.coverImage ? (
                        <Image
                          src={portfolio.coverImage}
                          alt={portfolio.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-steel">
                          <span className="text-off-white/30 text-4xl font-bold">
                            {portfolio.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Featured Badge */}
                      {portfolio.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-coral text-white shadow-lg">
                            Featured
                          </span>
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-off-white mb-2 group-hover:text-coral transition-colors">
                        {portfolio.title}
                      </h3>

                      {/* Short Description */}
                      {portfolio.shortDesc && (
                        <p className="text-mist/70 text-sm mb-4 line-clamp-2 flex-grow">
                          {portfolio.shortDesc}
                        </p>
                      )}

                      {/* Technologies */}
                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {technologies.slice(0, 4).map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs font-medium rounded-full bg-steel/20 text-mist border border-steel/30"
                            >
                              {tech}
                            </span>
                          ))}
                          {technologies.length > 4 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/5 text-mist/60">
                              +{technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-mist/50 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          {portfolio.completedAt && (
                            <span>{formatDate(portfolio.completedAt, 'short')}</span>
                          )}
                          {portfolio.views > 0 && (
                            <span>• {portfolio.views} views</span>
                          )}
                        </div>
                        <span className="text-coral group-hover:translate-x-1 transition-transform">
                          View Project →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-steel/10 border-t border-white/5">
          <div className="container max-w-4xl px-4 py-16 text-center">
            <h2 className="text-3xl font-bold text-off-white mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-mist/80 mb-8">
              Let's work together to bring your ideas to life.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-coral text-white font-semibold rounded-lg hover:bg-coral-dark transition-colors"
            >
              Get in Touch
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
