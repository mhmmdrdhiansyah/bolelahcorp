import { z } from 'zod';

// ============================================================================
// Blog Post Validation Schemas
// ============================================================================

// Helper for image URL/path validation (accepts both URLs and relative paths)
const imagePathSchema = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`).refine(
    (val) => {
      // Accept: http://, https://, or / (relative path)
      return val.startsWith('http://') ||
             val.startsWith('https://') ||
             val.startsWith('/');
    },
    `${fieldName} must be a valid URL or path`
  );

// Helper for optional string fields (accepts undefined, null, or empty string)
const optionalString = () =>
  z.string().optional().or(z.literal(''))
    .transform(val => (val === '' ? undefined : val));

const blogBaseSchema = {
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: optionalString(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  coverImage: imagePathSchema('Cover image').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  categoryId: z.string().cuid().optional().or(z.literal('')),
  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),
  // SEO
  metaTitle: optionalString(),
  metaDescription: optionalString(),
  ogImage: imagePathSchema('OG image').optional(),
  // Tags - array of tag IDs
  tagIds: z.array(z.string().cuid()).optional().default([]),
};

// Schema for creating a new blog post
export const createBlogSchema = z.object({
  ...blogBaseSchema,
});

// Schema for updating a blog post (all fields optional)
export const updateBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters').optional(),
  coverImage: imagePathSchema('Cover image').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).optional(),
  categoryId: z.string().cuid().optional().or(z.literal('')),
  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: imagePathSchema('OG image').optional(),
  tagIds: z.array(z.string().cuid()).optional(),
});

// Type exports
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
