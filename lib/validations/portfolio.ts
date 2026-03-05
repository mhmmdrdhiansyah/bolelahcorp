import { z } from 'zod';

// ============================================================================
// Portfolio Validation Schemas
// ============================================================================

// Helper for optional URL fields (accepts undefined, null, or empty string)
const optionalUrl = () => z.string().url().optional().or(z.literal('')).or(z.literal(null)).transform(val => val === '' || val === null ? undefined : val);

// Helper for optional string fields (accepts undefined, null, or empty string)
const optionalString = () => z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val);

const portfolioBaseSchema = {
  // Required fields
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImage: z.string().url('Cover image must be a valid URL'),
  technologies: z.array(z.string().min(1)).min(1, 'At least one technology is required'),
  // Images - optional, defaults to empty array
  images: z.array(z.string().url()).optional().transform(val => val || []),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  // Optional fields
  shortDesc: optionalString(),
  projectUrl: optionalUrl(),
  githubUrl: optionalUrl(),
  completedAt: z.coerce.date().optional(),
  metaTitle: optionalString(),
  metaDescription: optionalString(),
};

// Schema for creating a new portfolio
export const createPortfolioSchema = z.object({
  ...portfolioBaseSchema,
});

// Schema for updating a portfolio (all fields optional)
export const updatePortfolioSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  shortDesc: z.string().optional(),
  coverImage: z.string().url('Cover image must be a valid URL').optional(),
  images: z.array(z.string().url()).optional(),
  technologies: z.array(z.string().min(1)).optional(),
  projectUrl: z.string().url().optional().or(z.literal('')).optional(),
  githubUrl: z.string().url().optional().or(z.literal('')).optional(),
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  completedAt: z.coerce.date().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Type exports
export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
