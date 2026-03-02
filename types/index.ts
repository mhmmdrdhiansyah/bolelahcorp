// ============================================================================
// User Types
// ============================================================================

export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: Role;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// NextAuth Types
// ============================================================================

import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}

// ============================================================================
// Blog Types
// ============================================================================

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: PostStatus;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categoryId: string | null;
  author?: User;
  category?: Category;
  tags?: PostTag[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  _count?: {
    posts: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostTag {
  postId: string;
  tagId: string;
  tag?: Tag;
}

// ============================================================================
// Portfolio Types
// ============================================================================

export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  coverImage: string;
  images: JsonValue; // Array of image URLs
  technologies: JsonValue; // Array of tech stack names
  projectUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  order: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

// ============================================================================
// Page Section Types
// ============================================================================

export interface PageSection {
  id: string;
  page: string; // 'home', 'about', 'contact'
  section: string; // 'hero', 'about', 'services'
  title: string;
  content: JsonValue; // Flexible content structure
  enabled: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Site Settings Types
// ============================================================================

export interface SiteSettings {
  id: string;
  key: string;
  value: JsonValue;
  updatedAt: Date;
}

// ============================================================================
// Contact Types
// ============================================================================

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: Date;
}

// ============================================================================
// Utility Types
// ============================================================================

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// ============================================================================
// Form Types
// ============================================================================

export interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: PostStatus;
  categoryId?: string;
  tags?: string[];
  publishedAt?: Date;
  scheduledAt?: Date;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdatePostInput extends CreatePostInput {
  id: string;
}

export interface CreatePortfolioInput {
  title: string;
  slug?: string;
  description: string;
  shortDesc?: string;
  coverImage: string;
  images: string[];
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  order?: number;
  completedAt?: Date;
}

export interface UpdatePortfolioInput extends CreatePortfolioInput {
  id: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
