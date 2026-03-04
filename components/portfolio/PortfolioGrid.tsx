'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Portfolio as PortfolioType } from '@/types';
import { PortfolioCard } from './PortfolioCard';

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
// Portfolio Slider Component (Animated with Framer Motion)
// ============================================================================

export function PortfolioGrid({ portfolios, className }: PortfolioGridProps) {
  // Limit to maximum 5 portfolios
  const displayPortfolios = (portfolios || []).slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (displayPortfolios.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(timer);
  }, [currentIndex, isHovered, displayPortfolios.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = displayPortfolios.length - 1;
      if (nextIndex >= displayPortfolios.length) nextIndex = 0;
      return nextIndex;
    });
  };

  if (displayPortfolios.length === 0) {
    return null;
  }

  // Animasi untuk slider framer-motion
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.4 },
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.4 },
      }
    }),
  };

  return (
    <section id="portfolio" className={cn('section relative bg-navy/50 py-24 overflow-hidden', className)}>
      <div className="container px-4 md:px-6 relative">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-coral/10 text-coral border border-coral/20 text-sm font-semibold tracking-wider uppercase mb-4">
              Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-off-white mb-4 tracking-tight">
              Featured Projects
            </h2>
            <p className="text-mist text-lg leading-relaxed">
              A selection of my recent work and personal projects showcasing various technologies, creative solutions, and attention to detail.
            </p>
          </motion.div>

          {/* Navigation Controls */}
          {displayPortfolios.length > 1 && (
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => paginate(-1)}
                className="w-12 h-12 rounded-full flex items-center justify-center border bg-steel/40 border-mist/20 text-off-white hover:bg-coral hover:border-coral hover:text-white hover:scale-105 transition-all duration-300"
                aria-label="Previous project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => paginate(1)}
                className="w-12 h-12 rounded-full flex items-center justify-center border bg-steel/40 border-mist/20 text-off-white hover:bg-coral hover:border-coral hover:text-white hover:scale-105 transition-all duration-300"
                aria-label="Next project"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          )}
        </div>

        {/* Animated Slider Container */}
        <div
          className="relative w-full max-w-5xl mx-auto h-[450px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence initial={false} custom={direction}>
            {displayPortfolios.length > 0 && (
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants as any}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                <PortfolioCard
                  portfolio={displayPortfolios[currentIndex] as any}
                  index={0}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Indicators (Dots) */}
        {displayPortfolios.length > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            {displayPortfolios.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  currentIndex === index
                    ? "bg-coral scale-125"
                    : "bg-mist/30 hover:bg-mist/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
