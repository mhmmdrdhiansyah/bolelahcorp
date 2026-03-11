// Server Component - handles data fetching
// This file has NO 'use client' directive

import { About } from './About';
import type { CompanyInfo, SocialLinks } from './About';

// ============================================================================
// Data Fetching Functions
// ============================================================================

async function getAboutContent(): Promise<{ content: CompanyInfo | null; socialLinks: SocialLinks | null }> {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Fetch about content
    const aboutSection = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: 'home',
          section: 'about',
        },
      },
    });

    // Fetch social links
    const socialSetting = await prisma.siteSetting.findUnique({
      where: { key: 'social_links' },
    });

    return {
      content: aboutSection?.enabled ? (aboutSection.content as unknown as CompanyInfo) : null,
      socialLinks: socialSetting?.value as unknown as SocialLinks | null,
    };
  } catch (error) {
    console.error('Error fetching about content:', error);
    return { content: null, socialLinks: null };
  }
}

// ============================================================================
// Server Component Wrapper
// ============================================================================

export async function ServerAbout({ className, id }: { className?: string; id?: string }) {
  const { content, socialLinks } = await getAboutContent();

  // Pass data to Client Component
  return <About content={content || undefined} socialLinks={socialLinks || undefined} className={className} id={id} />;
}
