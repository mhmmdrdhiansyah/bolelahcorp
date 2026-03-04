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

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

// ============================================================================
// Blog List Component
// ============================================================================

export function BlogList({ posts, className, limit = 3 }: BlogListProps) {
  // Limit posts and ensure array
  const displayPosts = (posts || []).slice(0, limit);

  // Don't render if no posts
  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className={cn('section relative bg-navy py-24 overflow-hidden', className)}>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-coral/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-steel/10 rounded-full filter blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-coral/10 text-coral border border-coral/20 text-sm font-semibold tracking-wider uppercase mb-4">
            Blog
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-off-white mb-4 tracking-tight">
            Latest Articles
          </h2>
          <p className="text-mist text-lg">
            Thoughts on development, design, and technology
          </p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {displayPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-mist/60 text-sm mb-4">
            Want to see more? Check out the full blog archive.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-coral text-off-white font-semibold hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/30 hover:-translate-y-1 transition-all duration-300"
          >
            View All Articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
