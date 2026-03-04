'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  coverImage: string;
  images: any;
  technologies: any;
  projectUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  order: number;
}

interface PortfolioCardProps {
  portfolio: Portfolio;
  className?: string;
  index?: number;
}

// ============================================================================
// Portfolio Card Component (Client Component)
// ============================================================================

export function PortfolioCard({ portfolio, className, index = 0 }: PortfolioCardProps) {
  // Parse JSON data safely
  const technologies = Array.isArray(portfolio.technologies)
    ? portfolio.technologies
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'group relative w-full h-[450px] rounded-3xl overflow-hidden bg-steel border border-mist/10',
        className
      )}
    >
      {/* Background Image */}
      {portfolio.coverImage ? (
        <Image
          src={portfolio.coverImage}
          alt={portfolio.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-navy/50 text-mist/30">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0l-8-8a2 2 0 00-2.828 0l-8 8a2 2 0 002.828 0l8-8a2 2 0 002.828 0z" />
          </svg>
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
      <div className="absolute inset-0 bg-coral/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />

      {/* Content Container (Bottom Aligned) */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        {/* Technologies (Sliding up on hover) */}
        <div className="flex flex-wrap gap-2 mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          {technologies.slice(0, 3).map((tech: string, i: number) => (
            <span
              key={`${portfolio.id}-${tech}-${i}`}
              className="px-3 py-1 text-xs font-semibold tracking-wide rounded-full bg-mist/10 text-mist backdrop-blur-md border border-mist/20"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 3 && (
            <span className="px-3 py-1 text-xs font-semibold tracking-wide rounded-full bg-mist/5 text-mist/70 backdrop-blur-md border border-mist/10">
              +{technologies.length - 3}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <Link href={`/portfolio/${portfolio.slug}`} className="inline-block group/link">
            <h3 className="text-2xl md:text-3xl font-bold text-off-white mb-2 group-hover/link:text-coral transition-colors flex items-center gap-2">
              {portfolio.title}
              <svg className="w-6 h-6 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </h3>
          </Link>
          
          {portfolio.shortDesc && (
            <p className="text-mist/80 text-sm md:text-base line-clamp-2 mt-2 font-light">
              {portfolio.shortDesc}
            </p>
          )}
        </div>

        {/* Action Links (Fading in on hover) */}
        <div className="flex gap-4 mt-6 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 delay-200 overflow-hidden">
          {portfolio.projectUrl && (
            <a
              href={portfolio.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-off-white hover:text-coral transition-colors"
              onClick={(e) => e.stopPropagation()}
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
              className="flex items-center gap-2 text-sm font-medium text-off-white hover:text-coral transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
