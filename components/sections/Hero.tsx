'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

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
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

// ============================================================================
// Components
// ============================================================================

function AnimatedBlob({
  className,
  delay = 0,
  duration = 10,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={cn('absolute rounded-full filter blur-[100px] opacity-40 mix-blend-screen', className)}
      animate={{
        scale: [1, 1.2, 0.9, 1.1, 1],
        x: [0, 40, -20, 20, 0],
        y: [0, -40, 30, -10, 0],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        delay,
      }}
    />
  );
}

function CTALink({
  href,
  children,
  variant = 'primary',
  glowColor = 'rgba(230, 57, 70, 0.5)' // Coral by default
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  glowColor?: string;
}) {
  const baseStyles = 'relative inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 overflow-hidden group';

  const variants = {
    primary: 'bg-coral text-off-white border border-coral/50',
    secondary: 'bg-white/5 backdrop-blur-md border border-mist/20 text-off-white hover:bg-white/10 hover:border-mist/40',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      {/* Glow effect behind button */}
      {variant === 'primary' && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: glowColor }}
        />
      )}
      <Link
        href={href}
        className={cn(baseStyles, variants[variant])}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        <span className="relative z-10 flex items-center">
          {children}
        </span>
      </Link>
    </motion.div>
  );
}

// Custom split text component for cooler reveal
function SplitText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "100%", opacity: 0, rotateZ: 5 },
              visible: {
                y: 0,
                opacity: 1,
                rotateZ: 0,
                transition: {
                  type: "spring" as const,
                  damping: 20,
                  stiffness: 100
                }
              }
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function Hero({ content, className }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Default content
  const defaultContent: HeroContent = {
    headline: 'Crafting Digital Excellence',
    subheadline: 'Full-stack developer architecting scalable, aesthetic, and high-performance web applications.',
    ctaText: 'View Portfolio',
    ctaLink: '/portfolio',
    secondaryCtaText: 'Let\'s Talk',
    secondaryCtaLink: '/#contact',
  };

  const heroContent = content || defaultContent;

  return (
    <section
      ref={containerRef}
      id="hero"
      className={cn(
        'relative min-h-[100dvh] flex items-center justify-center overflow-hidden',
        'bg-navy',
        className
      )}
    >
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        {/* Animated Orbs */}
        <AnimatedBlob
          className="w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-coral/30 top-[-10%] left-[-10%]"
          delay={0}
          duration={20}
        />
        <AnimatedBlob
          className="w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-steel/40 bottom-[-10%] right-[-10%]"
          delay={2}
          duration={18}
        />
        <AnimatedBlob
          className="w-[20vw] h-[20vw] max-w-[400px] max-h-[400px] bg-mist/20 top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2"
          delay={5}
          duration={25}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="container relative z-10 px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: headerY, opacity }}
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Badge/Tag */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-off-white/80 text-sm font-medium shadow-2xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral" />
              </span>
              <span>Available for freelance opportunities</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold text-off-white tracking-tight mb-8 leading-[1.1]">
            <SplitText text={heroContent.headline} />
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl text-mist/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            {heroContent.subheadline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto"
          >
            <div className="w-full sm:w-auto">
              <CTALink href={heroContent.ctaLink} variant="primary">
                {heroContent.ctaText}
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </CTALink>
            </div>
            <div className="w-full sm:w-auto">
              <CTALink href={heroContent.secondaryCtaLink} variant="secondary">
                {heroContent.secondaryCtaText}
              </CTALink>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-mist/50 text-xs tracking-[0.2em] uppercase font-semibold">Scroll</span>
        <motion.div
          className="w-[1px] h-16 bg-gradient-to-b from-mist/50 to-transparent origin-top"
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Bottom Gradient Fade to transition to next section smoothly */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-navy to-transparent pointer-events-none z-10" />
    </section>
  );
}
