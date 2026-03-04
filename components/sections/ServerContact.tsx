// Server Component - handles data fetching
// This file has NO 'use client' directive

import { Contact } from './Contact';
import type { ContactContent } from './Contact';

// ============================================================================
// Data Fetching Function
// ============================================================================

async function getContactContent(): Promise<ContactContent | null> {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Fetch contact content from database
    const contactSection = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: 'home',
          section: 'contact',
        },
      },
    });

    if (!contactSection || !contactSection.enabled) {
      return null;
    }

    return contactSection.content as unknown as ContactContent;
  } catch (error) {
    console.error('Error fetching contact content:', error);
    return null;
  }
}

// ============================================================================
// Server Component Wrapper
// ============================================================================

export async function ServerContact({ className, id }: { className?: string; id?: string }) {
  const content = await getContactContent();

  // Pass data to Client Component (will use default if content is null)
  return <Contact content={content || undefined} className={className} id={id} />;
}
