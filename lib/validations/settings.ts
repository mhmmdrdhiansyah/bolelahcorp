import { z } from 'zod';

// ============================================================================
// Settings Validation Schemas
// ============================================================================

// Setting categories
export type SettingCategory = 'general' | 'contact' | 'social' | 'seo';

// Individual field validators
const optionalUrl = () =>
  z.string().url().optional().or(z.literal('')).or(z.literal(null))
    .transform(val => (val === '' || val === null ? undefined : val));

const optionalString = () =>
  z.string().optional().or(z.literal(''))
    .transform(val => (val === '' ? undefined : val));

// General settings schema
export const generalSettingsSchema = z.object({
  'site.name': z.string().min(1, 'Site name is required'),
  'site.description': optionalString(),
  'site.logo': optionalString(),
});

// Contact settings schema
export const contactSettingsSchema = z.object({
  'contact.email': z.string().email('Invalid email address').optional().or(z.literal('')),
  'contact.phone': optionalString(),
  'contact.address': optionalString(),
});

// Social settings schema
export const socialSettingsSchema = z.object({
  'social.github': optionalUrl(),
  'social.linkedin': optionalUrl(),
  'social.twitter': optionalUrl(),
  'social.instagram': optionalUrl(),
});

// SEO settings schema
export const seoSettingsSchema = z.object({
  'seo.metaTitle': optionalString(),
  'seo.metaDescription': optionalString(),
  'seo.googleAnalytics': optionalString(),
});

// Combined settings schema
export const settingsSchema = z.object({
  ...generalSettingsSchema.shape,
  ...contactSettingsSchema.shape,
  ...socialSettingsSchema.shape,
  ...seoSettingsSchema.shape,
});

// Type exports
export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type ContactSettings = z.infer<typeof contactSettingsSchema>;
export type SocialSettings = z.infer<typeof socialSettingsSchema>;
export type SeoSettings = z.infer<typeof seoSettingsSchema>;
export type SiteSettings = z.infer<typeof settingsSchema>;

// Default settings values
export const defaultSettings: SiteSettings = {
  'site.name': 'Bolehah Corp',
  'site.description': 'Professional portfolio and tech blog',
  'site.logo': '',

  'contact.email': '',
  'contact.phone': '',
  'contact.address': '',

  'social.github': '',
  'social.linkedin': '',
  'social.twitter': '',
  'social.instagram': '',

  'seo.metaTitle': '',
  'seo.metaDescription': '',
  'seo.googleAnalytics': '',
};

// Settings category definitions for UI
export const settingsCategories = [
  {
    id: 'general',
    name: 'General',
    description: 'Basic site information',
    keys: ['site.name', 'site.description', 'site.logo'],
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Contact information',
    keys: ['contact.email', 'contact.phone', 'contact.address'],
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Social media links',
    keys: ['social.github', 'social.linkedin', 'social.twitter', 'social.instagram'],
  },
  {
    id: 'seo',
    name: 'SEO',
    description: 'Search engine optimization',
    keys: ['seo.metaTitle', 'seo.metaDescription', 'seo.googleAnalytics'],
  },
] as const;
