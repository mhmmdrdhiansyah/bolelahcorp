// Server Component - handles data fetching
// This file has NO 'use client' directive

import { Services } from './Services';
import type { ServicesContent } from './Services';

// ============================================================================
// Data Fetching Function
// ============================================================================

async function getServicesContent(): Promise<ServicesContent | null> {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Fetch services content from database
    const servicesSection = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: 'home',
          section: 'services',
        },
      },
    });

    if (!servicesSection || !servicesSection.enabled) {
      return null;
    }

    return servicesSection.content as unknown as ServicesContent;
  } catch (error) {
    console.error('Error fetching services content:', error);
    return null;
  }
}

// ============================================================================
// Server Component Wrapper
// ============================================================================

export async function ServerServices({ className, id }: { className?: string; id?: string }) {
  const content = await getServicesContent();

  // Pass data to Client Component (will use default if content is null)
  return <Services content={content || undefined} className={className} id={id} />;
}
