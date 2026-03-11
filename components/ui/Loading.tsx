'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'skeleton' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

interface SkeletonProps {
  className?: string;
  count?: number;
}

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface DotsProps {
  className?: string;
}

interface PulseProps {
  className?: string;
}

// ============================================================================
// Sizes
// ============================================================================

const sizes = {
  sm: { spinner: 'w-4 h-4', dots: 'w-1.5 h-1.5' },
  md: { spinner: 'w-8 h-8', dots: 'w-2 h-2' },
  lg: { spinner: 'w-12 h-12', dots: 'w-3 h-3' },
};

// ============================================================================
// Spinner Component
// ============================================================================

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'relative rounded-full border-2 border-current border-t-transparent animate-spin',
        sizes[size].spinner,
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================================================
// Dots Component
// ============================================================================

export function LoadingDots({ className }: DotsProps) {
  const dotVariants = {
    hidden: { opacity: 0.3, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)} role="status" aria-label="Loading">
      <motion.div
        className="w-2 h-2 rounded-full bg-coral"
        variants={dotVariants}
        animate="visible"
        initial="hidden"
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-coral"
        variants={dotVariants}
        animate="visible"
        initial="hidden"
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 0.1,
        }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-coral"
        variants={dotVariants}
        animate="visible"
        initial="hidden"
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================================================
// Pulse Component
// ============================================================================

export function Pulse({ className }: PulseProps) {
  return (
    <div
      className={cn('animate-pulse bg-steel/30 rounded', className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================================================
// Skeleton Component
// ============================================================================

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn('animate-pulse bg-steel/30 rounded', className)}
          style={{
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================================================
// Card Skeleton (for cards)
// ============================================================================

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white/5 border border-white/5 rounded-2xl overflow-hidden', className)}>
      {/* Image skeleton */}
      <Skeleton className="w-full aspect-[16/10]" count={1} />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <Skeleton className="h-3 w-20 rounded-full" count={1} />
        <Skeleton className="h-6 w-full" count={2} />
        <Skeleton className="h-4 w-full" count={3} />
        <Skeleton className="h-4 w-1/2" count={1} />
      </div>
    </div>
  );
}

// ============================================================================
// Blog Card Skeleton
// ============================================================================

export function BlogCardSkeleton({ className }: { className?: string }) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'rounded-2xl overflow-hidden bg-white/5 border border-white/5 h-full',
        className
      )}
    >
      {/* Image skeleton */}
      <div className="relative aspect-[16/10] bg-steel/20 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Date skeleton */}
        <div className="h-3 w-24 bg-steel/30 rounded animate-pulse" />

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-5 w-full bg-steel/30 rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-steel/30 rounded animate-pulse" />
        </div>

        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-steel/30 rounded animate-pulse" />
          <div className="h-4 w-full bg-steel/30 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-steel/30 rounded animate-pulse" />
        </div>

        {/* Read more skeleton */}
        <div className="h-4 w-20 bg-steel/30 rounded animate-pulse" />
      </div>
    </motion.article>
  );
}

// ============================================================================
// Main Loading Component
// ============================================================================

export function Loading({
  variant = 'spinner',
  size = 'md',
  className,
  text,
}: LoadingProps) {
  const content = (() => {
    switch (variant) {
      case 'spinner':
        return <Spinner size={size} className={className} />;
      case 'dots':
        return <LoadingDots className={className} />;
      case 'skeleton':
        return <Skeleton className={cn('h-8 w-full', className)} />;
      case 'pulse':
        return <Pulse className={cn('h-12 w-12 rounded-full', className)} />;
      default:
        return <Spinner size={size} className={className} />;
    }
  })();

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {content}
        {text && (
          <p className="text-mist/60 text-sm animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Full Page Loading
// ============================================================================

export function FullPageLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-6">
        <Spinner size="lg" className="text-coral" />
        <p className="text-mist/60 text-sm">{text}</p>
      </div>
    </div>
  );
}
