import { z } from 'zod';

// ============================================================================
// PageSection Validation Schemas
// ============================================================================

// Page options
export const pageOptions = ['home', 'about', 'contact'] as const;
export type PageOption = typeof pageOptions[number];

// Section name options (examples)
export const sectionNameOptions = [
  'hero',
  'about',
  'services',
  'portfolio',
  'testimonials',
  'contact',
  'cta',
  'stats',
  'team',
  'pricing',
  'faq',
] as const;
export type SectionNameOption = typeof sectionNameOptions[number];

const pageSectionBaseSchema = {
  page: z.enum(pageOptions, {
    message: 'Page must be one of: home, about, contact',
  }),
  section: z.string()
    .min(1, 'Section name is required')
    .max(100, 'Section name must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Section name must contain only lowercase letters, numbers, and hyphens'),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  content: z.any(), // Flexible JSON content
  enabled: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
};

// Schema for creating a new page section
export const createPageSectionSchema = z.object({
  ...pageSectionBaseSchema,
});

// Schema for updating a page section (all fields optional)
export const updatePageSectionSchema = z.object({
  page: z.enum(pageOptions).optional(),
  section: z.string()
    .min(1, 'Section name is required')
    .max(100, 'Section name must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Section name must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  content: z.any().optional(),
  enabled: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

// Type exports
export type CreatePageSectionInput = z.infer<typeof createPageSectionSchema>;
export type UpdatePageSectionInput = z.infer<typeof updatePageSectionSchema>;

// Content type helpers for specific sections
export interface HeroContent {
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export interface ServiceItem {
  title: string;
  icon?: string;
  description: string;
}

export interface ServicesContent {
  services?: ServiceItem[];
}

export interface TestimonialItem {
  name: string;
  role?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface TestimonialsContent {
  testimonials?: TestimonialItem[];
}

export interface StatsItem {
  label: string;
  value: string;
  icon?: string;
}

export interface StatsContent {
  stats?: StatsItem[];
}
