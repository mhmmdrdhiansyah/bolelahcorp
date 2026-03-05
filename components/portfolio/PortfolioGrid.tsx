'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Portfolio as PortfolioType } from '@/types';
import { PortfolioCard } from './PortfolioCard';
import Link from 'next/link';

// ============================================================================
// Types
// ============================================================================

interface PortfolioGridProps {
  portfolios?: PortfolioType[];
  className?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
}

// ============================================================================
// Animation Variants
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ============================================================================
// Portfolio Grid Component (Masonry-like layout)
// ============================================================================

export function PortfolioGrid({ portfolios, className, showViewAll = true, viewAllLink = '/portfolio' }: PortfolioGridProps) {
  // Use first 5 portfolios
  const displayPortfolios = (portfolios || []).slice(0, 5);

  if (displayPortfolios.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className={cn('section relative bg-navy py-32 overflow-hidden', className)}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-coral/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-steel/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-8">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-coral/10 text-coral border border-coral/20 text-sm font-semibold tracking-wider uppercase mb-6">
              Selected Works
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-off-white mb-6 tracking-tight">
              Featured Projects
            </h2>
            <div className="w-16 h-1 bg-coral/50 mb-6 rounded-full" />
            <p className="text-mist/90 text-lg md:text-xl font-light leading-relaxed">
              A curated selection of my finest work, showcasing technical expertise, creative problem-solving, and attention to detail.
            </p>
          </motion.div>

          {/* View All Button - Desktop */}
          {showViewAll && displayPortfolios.length > 0 && (
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href={viewAllLink}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-off-white hover:bg-white/10 transition-all duration-300"
              >
                <span className="font-semibold tracking-wide">View Full Portfolio</span>
                <span className="w-8 h-8 rounded-full bg-coral flex items-center justify-center group-hover:scale-110 group-hover:bg-coral-dark transition-all duration-300 shadow-lg shadow-coral/30">
                  <svg className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Feature Grid Layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Main large featured project (spans 2 columns on large screens) */}
          {displayPortfolios[0] && (
            <div className="lg:col-span-2 md:col-span-2 h-[500px] lg:h-[600px] group w-full">
              <PortfolioCard
                portfolio={displayPortfolios[0] as any}
                index={0}
                className="w-full h-full rounded-[2rem]"
              />
            </div>
          )}

          {/* Second featured project */}
          {displayPortfolios[1] && (
            <div className="h-[500px] lg:h-[600px] w-full group">
              <PortfolioCard
                portfolio={displayPortfolios[1] as any}
                index={1}
                className="w-full h-full rounded-[2rem]"
              />
            </div>
          )}

          {/* Remaining projects in standard grid */}
          {displayPortfolios.slice(2).map((portfolio, index) => (
            <div key={portfolio.id || index} className="h-[400px] lg:h-[450px] w-full group">
              <PortfolioCard
                portfolio={portfolio as any}
                index={index + 2}
                className="w-full h-full rounded-3xl"
              />
            </div>
          ))}
        </motion.div>

        {/* View All Button - Mobile Focus */}
        {showViewAll && displayPortfolios.length > 0 && (
          <motion.div
            className="mt-12 md:hidden flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={viewAllLink}
              className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-off-white hover:bg-white/10 active:scale-95 transition-all duration-300"
            >
              <span className="font-semibold tracking-wide">View Full Portfolio</span>
              <span className="w-8 h-8 rounded-full bg-coral flex items-center justify-center">
                <svg className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
