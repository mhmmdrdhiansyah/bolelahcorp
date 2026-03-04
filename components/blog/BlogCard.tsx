'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface BlogCardProps {
  post: BlogPost;
  className?: string;
  index?: number;
}

// ============================================================================
// Blog Card Component
// ============================================================================

export function BlogCard({ post, className, index = 0 }: BlogCardProps) {
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'group relative w-full h-[380px] rounded-3xl overflow-hidden bg-steel/20 border border-mist/10',
        className
      )}
    >
      {/* Background Image */}
      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-steel to-navy text-mist/30">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />
      <div className="absolute inset-0 bg-coral/10 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />

      {/* Category Badge (Top Left) */}
      {post.category && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
          className="absolute top-4 left-4 z-10"
        >
          <span className="px-3 py-1 text-xs font-semibold tracking-wide rounded-full bg-coral/90 text-off-white backdrop-blur-md border border-coral/20 shadow-lg">
            {post.category.name}
          </span>
        </motion.div>
      )}

      {/* Content Container (Bottom Aligned) */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Date Badge */}
        {post.publishedAt && (
          <div className="mb-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
            <span className="text-xs font-medium text-mist/70">
              {formatDate(post.publishedAt)}
            </span>
          </div>
        )}

        {/* Title & Excerpt */}
        <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
          <Link href={`/blog/${post.slug}`} className="inline-block group/link">
            <h3 className="text-xl md:text-2xl font-bold text-off-white mb-2 group-hover/link:text-coral transition-colors flex items-center gap-2">
              {post.title}
              <svg className="w-5 h-5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </h3>
          </Link>

          {post.excerpt && (
            <p className="text-mist/80 text-sm line-clamp-3 mt-2 font-light">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Read More Link (Sliding up on hover) */}
        <div className="flex items-center gap-2 mt-4 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 delay-150 overflow-hidden">
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-2 text-sm font-medium text-coral hover:text-off-white transition-colors"
          >
            Read More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
