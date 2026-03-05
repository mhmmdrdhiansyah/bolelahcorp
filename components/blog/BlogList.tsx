'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { BlogPost } from './BlogCard';
import { BlogCard } from './BlogCard';

// ============================================================================
// Types
// ============================================================================

interface BlogListProps {
  posts?: BlogPost[];
  className?: string;
  limit?: number;
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
// Blog List Component
// ============================================================================

export function BlogList({ posts, className, limit = 3 }: BlogListProps) {
  const displayPosts = (posts || []).slice(0, limit);

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className={cn('section relative bg-navy/80 py-32 overflow-hidden', className)}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[30%] left-[-5%] w-[500px] h-[500px] bg-coral/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-steel/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-coral/10 text-coral border border-coral/20 text-sm font-semibold tracking-wider uppercase mb-6">
              Insights & Articles
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-off-white mb-6 tracking-tight">
              Latest Thinking
            </h2>
            <div className="w-16 h-1 bg-coral/50 mb-6 rounded-full" />
            <p className="text-mist/90 text-lg md:text-xl font-light leading-relaxed">
              Exploring the intersection of design, engineering, and digital experiences. Random thoughts and deep dives.
            </p>
          </motion.div>

          {/* View All Desktop */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/blog"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-coral/10 border border-coral/20 text-coral hover:bg-coral hover:text-white transition-all duration-300"
            >
              <span className="font-semibold tracking-wide">Journal Archive</span>
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <svg className="w-4 h-4 text-current group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Blog Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {displayPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </motion.div>

        {/* View All Mobile */}
        <motion.div
          className="mt-12 md:hidden flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-coral/10 border border-coral/20 text-coral hover:bg-coral hover:text-white transition-all duration-300"
          >
            <span className="font-semibold tracking-wide">Journal Archive</span>
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-current group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
