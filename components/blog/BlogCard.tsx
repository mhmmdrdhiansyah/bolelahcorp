'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
// Blog Card Component (Modernized)
// ============================================================================

export function BlogCard({ post, className, index = 0 }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format date visually
  const formatDate = (date: Date | null) => {
    if (!date) return { day: '', month: '', year: '' };
    const d = new Date(date);
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: d.toLocaleString('en-US', { month: 'short' }),
      year: d.getFullYear(),
    };
  };

  const dateData = formatDate(post.publishedAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative w-full flex flex-col rounded-3xl overflow-hidden bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-500 cursor-pointer h-full',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow behind card */}
      <div
        className={cn(
          "absolute -inset-1 rounded-[inherit] opacity-0 blur-xl transition-opacity duration-700 pointer-events-none",
          isHovered ? "opacity-100 bg-coral/20" : "opacity-0"
        )}
      />

      {/* Image Section (Top half) */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-steel/20">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-[1000ms] group-hover:scale-110 group-hover:rotate-1"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-steel to-navy text-mist/30">
            <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center bg-cover mix-blend-overlay" />
            <svg className="w-16 h-16 opacity-50 mb-2 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-xs uppercase tracking-widest font-semibold opacity-50">Article Image</span>
          </div>
        )}

        {/* Overlays */}
        <div className={cn(
          "absolute inset-0 bg-coral/20 mix-blend-overlay transition-opacity duration-700 pointer-events-none",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        {/* Category / Date Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
          {post.category && (
            <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-navy/80 text-coral backdrop-blur-md border border-white/10 shadow-lg relative overflow-hidden">
              <span className="relative z-10">{post.category.name}</span>
            </span>
          )}

          {post.publishedAt && (
            <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-off-white shadow-lg transform transition-transform duration-500 group-hover:-translate-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-coral/90">{dateData.month}</span>
              <span className="text-xl font-black leading-none my-0.5">{dateData.day}</span>
              <span className="text-[10px] font-semibold text-mist/70">{dateData.year}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section (Bottom half) */}
      <div className="flex flex-col flex-grow p-6 relative z-10 bg-gradient-to-b from-navy/50 to-transparent pointer-events-none">

        <div className="flex-grow">
          {/* Title */}
          <Link href={`/blog/${post.slug}`} className="inline-block pointer-events-auto w-full group/link">
            <h3 className="text-xl md:text-2xl font-bold text-off-white mb-3 group-hover/link:text-coral transition-colors duration-300 leading-snug line-clamp-2">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-mist/80 text-sm md:text-base line-clamp-3 font-light leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Decorative Read More */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between pointer-events-auto w-full">
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-2 text-sm font-semibold tracking-wide text-coral hover:text-white transition-colors group/read object-left"
          >
            Read Article
            <div className="w-6 h-6 rounded-full bg-coral/10 flex items-center justify-center transition-transform group-hover/read:translate-x-1 group-hover/read:bg-coral">
              <svg className="w-3 h-3 text-current group-hover/read:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Reading Time Estimator (Mock) */}
          <span className="text-xs font-medium text-mist/50 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            5 min read
          </span>
        </div>
      </div>
    </motion.div>
  );
}
