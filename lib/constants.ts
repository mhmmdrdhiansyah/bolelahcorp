// ============================================================================
// Color Palette (from PRD)
// ============================================================================

export const COLORS = {
  NAVY: '#1D3557',
  NAVY_LIGHT: '#2A4A73',
  NAVY_DARK: '#152540',
  STEEL: '#457B9D',
  STEEL_LIGHT: '#5A8FB0',
  STEEL_DARK: '#36627D',
  CORAL: '#E63946',
  CORAL_LIGHT: '#F06B76',
  CORAL_DARK: '#C4202D',
  OFF_WHITE: '#F1FAEE',
  OFF_WHITE_DARK: '#E0E9DD',
  MIST: '#A8DADC',
  MIST_LIGHT: '#BCE5E7',
  MIST_DARK: '#8AC0C2',
} as const;

// ============================================================================
// Site Constants
// ============================================================================

export const SITE_NAME = 'Bolehah Corp';
export const SITE_DESCRIPTION = 'Professional IT services company specializing in WordPress, PHP, Next.js, and full-stack web development with 5+ years of experience.';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// ============================================================================
// App Constants
// ============================================================================

export const APP_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PORTFOLIO: '/portfolio',
  BLOG: '/blog',
  CONTACT: '/contact',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PORTFOLIOS: '/admin/portfolios',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_PAGES: '/admin/pages',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_LOGIN: '/admin/login',
} as const;

export const API_ROUTES = {
  // Auth
  AUTH: '/api/auth',

  // Public API
  PORTFOLIOS: '/api/portfolios',
  PORTFOLIO_SLUG: (slug: string) => `/api/portfolios/${slug}`,
  BLOG: '/api/blog',
  BLOG_SLUG: (slug: string) => `/api/blog/${slug}`,
  CONTACT: '/api/contact',

  // Admin API
  ADMIN_PORTFOLIOS: '/api/admin/portfolios',
  ADMIN_PORTFOLIO_ID: (id: string) => `/api/admin/portfolios/${id}`,
  ADMIN_POSTS: '/api/admin/blog',
  ADMIN_POST_ID: (id: string) => `/api/admin/blog/${id}`,
  ADMIN_SECTIONS: '/api/admin/pages/sections',
  ADMIN_SECTION_ID: (id: string) => `/api/admin/pages/sections/${id}`,
  ADMIN_SETTINGS: '/api/admin/settings',
  ADMIN_MEDIA: '/api/admin/media',
} as const;

// ============================================================================
// Pagination Constants
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
} as const;

// ============================================================================
// File Upload Constants
// ============================================================================

export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
} as const;

// ============================================================================
// Date Format Constants
// ============================================================================

export const DATE_FORMATS = {
  DISPLAY: 'MMMM d, yyyy',
  DISPLAY_WITH_TIME: 'MMMM d, yyyy • h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// ============================================================================
// Status Constants
// ============================================================================

export const POST_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  SCHEDULED: 'SCHEDULED',
} as const;

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

// ============================================================================
// Social Links (default)
// ============================================================================

export const DEFAULT_SOCIAL_LINKS = {
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
} as const;

// ============================================================================
// Animation Durations
// ============================================================================

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  EXTRA_SLOW: 500,
} as const;
