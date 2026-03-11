'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
  views?: number;
}

interface PortfolioCardProps {
  portfolio: Portfolio;
  className?: string;
  index?: number;
}

// ============================================================================
// Portfolio Card Component (Aesthetic Hover States)
// ============================================================================

export function PortfolioCard({ portfolio, className, index = 0 }: PortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Parse JSON data safely
  const technologies = Array.isArray(portfolio.technologies)
    ? portfolio.technologies
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }} // Custom smooth ease
      className={cn(
        'group relative w-full h-full overflow-hidden bg-navy/80 border border-white/5 cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Glow Behind Card */}
      <div
        className={cn(
          "absolute -inset-1 rounded-[inherit] opacity-0 blur-xl transition-opacity duration-700",
          isHovered ? "opacity-100 bg-coral/30" : "opacity-0"
        )}
      />

      {/* Internal Container to clip content while allowing external glow */}
      <div className="absolute inset-[1px] rounded-[inherit] overflow-hidden bg-steel">
        {/* Background Image / Placeholder */}
        {portfolio.coverImage ? (
          <Image
            src={portfolio.coverImage}
            alt={portfolio.title}
            fill
            className={cn(
              "object-cover transition-all duration-[1000ms] ease-out",
              isHovered ? "scale-110 filter brightness-50" : "scale-100"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-navy to-steel text-mist/30 transition-transform duration-[1000ms] group-hover:scale-110">
            {/* Abstract Placeholder */}
            <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center bg-cover mix-blend-overlay" />
            <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0l-8-8a2 2 0 00-2.828 0l-8 8a2 2 0 002.828 0l8-8a2 2 0 002.828 0z" />
            </svg>
            <span className="font-semibold uppercase tracking-widest text-xs opacity-50">Project Image</span>
          </div>
        )}

        {/* Gradient Overlays */}
        {/* Base dark gradient at bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80" />
        {/* Color overlay that fades in intensely on hover */}
        <div
          className={cn(
            "absolute inset-0 mix-blend-multiply transition-opacity duration-700 pointer-events-none",
            isHovered ? "bg-navy/80 opacity-100" : "bg-transparent opacity-0"
          )}
        />
        {/* Coral accent overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-coral/20 mix-blend-overlay transition-opacity duration-700 pointer-events-none",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Content Container (Bottom Aligned) */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 z-10 pointer-events-none">
          {/* Top Info (Appears on hover) - Technologies */}
          <div
            className={cn(
              "flex flex-wrap gap-2 mb-auto pb-4 transition-all duration-500 ease-out transform",
              isHovered ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            )}
          >
            {technologies.slice(0, 4).map((tech: string, i: number) => (
              <span
                key={`${portfolio.id}-${tech}-${i}`}
                className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-white/10 text-off-white backdrop-blur-md border border-white/20 shadow-lg"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 4 && (
              <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-white/5 text-mist backdrop-blur-md border border-white/10">
                +{technologies.length - 4}
              </span>
            )}
          </div>

          {/* Bottom Info - Title & Desc */}
          <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-4">

            {/* Title with animated line */}
            <div className="relative inline-block pointer-events-auto">
              <Link href={`/portfolio/${portfolio.slug}`} className="block">
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight group-hover:text-coral transition-colors duration-300">
                  {portfolio.title}
                </h3>
              </Link>
            </div>

            {portfolio.shortDesc && (
              <p
                className={cn(
                  "text-mist/90 text-base md:text-lg font-light leading-relaxed mb-6 transition-all duration-500",
                  isHovered ? "line-clamp-4" : "line-clamp-2"
                )}
              >
                {portfolio.shortDesc}
              </p>
            )}

            {/* Action Links (Fading in on hover) */}
            <div className="flex gap-6 pointer-events-auto h-0 overflow-hidden group-hover:h-auto group-hover:pt-2 transition-all duration-500">
              {portfolio.projectUrl && (
                <a
                  href={portfolio.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white hover:text-coral transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                  Live Demo
                </a>
              )}
              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white hover:text-coral transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </span>
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
