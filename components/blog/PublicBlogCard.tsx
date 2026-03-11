'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface PublicBlogCardProps {
  post: PublicBlogPost;
  className?: string;
  index?: number;
}

// ============================================================================
// Public Blog Card Component
// ============================================================================

export function PublicBlogCard({ post, className, index = 0 }: PublicBlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format date
  const dateString = post.publishedAt ? formatDate(post.publishedAt, 'long') : 'Draft';

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative w-full flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer h-full',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-steel/20">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-steel/30 to-navy">
            <svg className="w-12 h-12 text-mist/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}

        {/* Category Badge */}
        {post.category && (
          <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-navy/90 text-coral backdrop-blur-md border border-white/10">
            {post.category.name}
          </span>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6">
        {/* Date */}
        <time className="text-xs font-medium text-mist/60 mb-3 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {dateString}
        </time>

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="inline-block mb-3">
          <h3 className="text-xl font-bold text-off-white group-hover:text-coral transition-colors duration-300 leading-snug line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-mist/70 text-sm line-clamp-3 font-light leading-relaxed mb-4 flex-grow">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className="px-2.5 py-1 text-xs rounded-full bg-steel/20 text-mist hover:bg-steel/30 hover:text-off-white transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2.5 py-1 text-xs rounded-full bg-steel/20 text-mist/50">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Read More Link */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-coral hover:text-coral-light transition-colors mt-auto"
        >
          Read More
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}
