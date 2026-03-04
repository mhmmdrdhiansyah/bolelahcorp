// Server Component - handles data fetching
// This file has NO 'use client' directive

import { Hero } from './Hero';
import type { HeroContent } from './Hero';

// ============================================================================
// Data Fetching Function
// ============================================================================

async function getHeroContent(): Promise<HeroContent | null> {
  try {
    const { prisma } = await import('@/lib/prisma');
    const section = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: 'home',
          section: 'hero',
        },
      },
    });

    if (!section || !section.enabled) {
      return null;
    }

    return section.content as unknown as HeroContent;
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return null;
  }
}

// ============================================================================
// Server Component Wrapper
// ============================================================================

export async function ServerHero({ className }: { className?: string }) {
  const content = await getHeroContent();

  // Pass data to Client Component
  return <Hero content={content || undefined} className={className} />;
}
