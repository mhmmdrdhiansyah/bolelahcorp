import { SITE_NAME, SITE_URL } from '@/lib/constants';

// ============================================================================
// Types
// ============================================================================

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
}

// ============================================================================
// SEO Component
// ============================================================================

export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = [SITE_NAME],
  keywords = [],
  noIndex = false,
}: SEOProps) {
  // Default values
  const defaultTitle = `${SITE_NAME} - IT Solutions & Web Development`;
  const defaultDescription = 'Professional IT services company specializing in WordPress, PHP, Next.js, and full-stack web development with 5+ years of experience.';
  const defaultImage = `${SITE_URL}/og-image.png`;

  const pageTitle = title ? `${title} | ${SITE_NAME}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url || SITE_URL;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && authors.length > 0 && (
        authors.forEach((author) => (
          <meta key={author} property="article:author" content={author} />
        ))
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1D3557" />
    </>
  );
}

// ============================================================================
// Helper function for generating metadata object (for Next.js metadata API)
// ============================================================================

export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = [SITE_NAME],
  keywords = [],
  noIndex = false,
}: SEOProps) {
  const defaultTitle = `${SITE_NAME} - Portfolio & Blog`;
  const defaultDescription = 'Professional portfolio and tech blog by Muhammad Ardhiansyah';
  const defaultImage = `${SITE_URL}/og-image.png`;

  const pageTitle = title ? `${title} | ${SITE_NAME}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url || SITE_URL;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    robots: noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type,
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
  };
}
