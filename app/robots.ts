import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// ============================================================================
// Robots.txt Generation
// ============================================================================

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/login/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
