'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

interface HeroProps {
  content?: HeroContent;
  className?: string;
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeInOut' as const,
    },
  },
};

// ============================================================================
// Components
// ============================================================================

function AnimatedBlob({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn('absolute rounded-full filter blur-3xl opacity-20', className)}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

function CTALink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const baseStyles = 'inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 active:scale-95';

  const variants = {
    primary: 'bg-coral text-off-white hover:bg-coral-dark hover:shadow-lg hover:shadow-coral/30 hover:-translate-y-1',
    secondary: 'bg-transparent border-2 border-mist text-mist hover:bg-mist hover:text-navy hover:-translate-y-1',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={href}
        className={cn(baseStyles, variants[variant])}
      >
        {children}
      </Link>
    </motion.div>
  );
}

// ============================================================================
// Main Component (Client Component - only animations, no async)
// ============================================================================

export function Hero({ content, className }: HeroProps) {
  // Default content if not provided (fallback)
  const defaultContent: HeroContent = {
    headline: 'Building Digital Experiences',
    subheadline: 'Full-stack developer specializing in modern web technologies',
    ctaText: 'View Portfolio',
    ctaLink: '/portfolio',
    secondaryCtaText: 'Contact Me',
    secondaryCtaLink: '/contact',
  };

  const heroContent = content || defaultContent;

  return (
    <section
      id="hero"
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'bg-gradient-to-br from-navy via-navy to-steel',
        className
      )}
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatedBlob
          className="w-96 h-96 bg-coral top-20 -left-20"
          delay={0}
        />
        <AnimatedBlob
          className="w-[30rem] h-[30rem] bg-mist bottom-20 -right-20"
          delay={1}
        />
        <AnimatedBlob
          className="w-64 h-64 bg-steel top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          delay={2}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <motion.div
        className="container relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge/Tag */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-steel/30 border border-mist/20 text-mist text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-coral" />
              </span>
              Available for freelance work
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-hero font-bold text-off-white mb-6 leading-tight"
          >
            <span className="block">{heroContent.headline.split(' ').slice(0, -1).join(' ')}</span>
            <span className="block text-gradient bg-gradient-to-r from-coral to-mist bg-clip-text text-transparent">
              {heroContent.headline.split(' ').slice(-1)[0]}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-mist max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {heroContent.subheadline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <CTALink href={heroContent.ctaLink} variant="primary">
              {heroContent.ctaText}
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </CTALink>
            <CTALink href={heroContent.secondaryCtaLink} variant="secondary">
              {heroContent.secondaryCtaText}
            </CTALink>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-20 flex flex-col items-center gap-2"
          >
            <span className="text-mist/60 text-sm">Scroll to explore</span>
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-mist/30 flex justify-center pt-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-3 bg-coral rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
    </section>
  );
}
