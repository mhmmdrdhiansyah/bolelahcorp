// Server Component - handles data fetching
// This file has NO 'use client' directive

import { Testimonials } from './Testimonials';
import type { TestimonialsContent } from './Testimonials';

// ============================================================================
// Data Fetching Function
// ============================================================================

async function getTestimonialsContent(): Promise<TestimonialsContent | null> {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Fetch testimonials content from database
    const testimonialsSection = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: 'home',
          section: 'testimonials',
        },
      },
    });

    if (!testimonialsSection || !testimonialsSection.enabled) {
      return null;
    }

    return testimonialsSection.content as unknown as TestimonialsContent;
  } catch (error) {
    console.error('Error fetching testimonials content:', error);
    return null;
  }
}

// ============================================================================
// Server Component Wrapper
// ============================================================================

export async function ServerTestimonials({ className, id }: { className?: string; id?: string }) {
  const content = await getTestimonialsContent();

  // Pass data to Client Component (will use default if content is null)
  return <Testimonials content={content || undefined} className={className} id={id} />;
}
