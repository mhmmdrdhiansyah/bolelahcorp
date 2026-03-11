# Implementation Steps - Portfolio Website

## 📋 Overview

Dokumen ini memecah pengerjaan menjadi actionable steps berdasarkan PRD.

**Total Estimated Time:** 3-4 weeks (part-time)
**Total Estimated Tasks:** 50-60 tasks

---

## 🎯 Phase 1: Project Setup (Week 1)

### Step 1.1: Initialize Next.js Project ✅

**Estimated Time:** 30 minutes

**Status:** COMPLETED (2026-03-02)

**Tasks:**
- [x] Create new Next.js 14+ project with TypeScript
  ```bash
  npx create-next-app@latest --typescript --tailwind --app
  ```
- [x] Navigate to project directory
- [x] Test development server: `npm run dev`
- [x] Verify localhost:3000 accessible

**Deliverable:** Working Next.js boilerplate with Tailwind CSS

---

### Step 1.2: Configure Tailwind with Custom Colors ✅

**Estimated Time:** 30 minutes

**Status:** COMPLETED (2026-03-02)

**Tasks:**
- [x] Edit `tailwind.config.ts`:
  ```typescript
  colors: {
    navy: '#1D3557',
    steel: '#457B9D',
    coral: '#E63946',
    'off-white': '#F1FAEE',
    mist: '#A8DADC',
  }
  ```
- [x] Add custom font (optional): Inter, Poppins, or similar
  - Inter (sans-serif) from next/font/google
  - JetBrains Mono (monospace) from next/font/google
- [x] Test colors in `app/page.tsx` (create sample divs)
- [x] Verify colors match PRD palette

**Deliverable:** Tailwind configured with custom ocean palette

**Files Updated:**
- `tailwind.config.ts` - Custom colors, animations, keyframes
- `app/globals.css` - CSS variables, component classes
- `app/layout.tsx` - Custom fonts (Inter, JetBrains Mono)
- `app/page.tsx` - Color palette test page

---

### Step 1.3: Setup Project Structure ✅

**Estimated Time:** 1 hour

**Status:** COMPLETED (2026-03-02)

**Tasks:**
- [x] Create folder structure:
  ```
  app/
  ├── (public)/          # Route group for public pages
  ├── (admin)/           # Route group for admin pages
  ├── admin/             # Admin routes
  ├── api/               # API routes
  ├── blog/              # Blog routes
  ├── portfolio/         # Portfolio routes
  ├── about/             # About route
  ├── components/        # Reusable components
  │   ├── ui/           # Base UI components (Button, Card, Input)
  │   ├── sections/     # Page sections (Hero, About, etc.)
  │   ├── portfolio/    # Portfolio-specific components
  │   ├── blog/         # Blog-specific components
  │   └── admin/        # Admin-specific components
  ├── lib/              # Utility functions
  ├── types/            # TypeScript types
  ├── public/           # Static assets
  └── styles/           # Global styles
  ```
- [x] Create basic layout files:
  - `app/(public)/layout.tsx` (public layout)
  - `app/(admin)/layout.tsx` (admin layout wrapper)
- [x] Create `types/index.ts` for TypeScript interfaces
- [x] Create `lib/constants.ts` for color palette & constants
- [x] Create `lib/utils.ts` for helper functions

**Deliverable:** Complete folder structure matching architecture

**Files Created:**
- `app/(public)/layout.tsx`
- `app/(public)/page.tsx` (moved from root)
- `app/(admin)/layout.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/index.ts`
- `components/sections/index.ts`
- `components/portfolio/index.ts`
- `components/blog/index.ts`
- `components/admin/index.ts`
- `components/index.ts`
- `lib/constants.ts`
- `lib/utils.ts`
- `lib/index.ts`
- `types/index.ts`

---

### Step 1.4: Install Dependencies ✅

**Estimated Time:** 30 minutes

**Status:** COMPLETED (2026-03-02)

**Tasks:**
- [x] Install core dependencies:
  ```bash
  npm install framer-motion react-hook-form zod @hookform/resolvers next-auth
  npm install @prisma/client
  npm install -D prisma
  npm install sharp
  npm install bcryptjs @types/bcryptjs
  npm install clsx tailwind-merge
  ```
- [x] Verify all packages in `package.json`
- [x] Test import framer-motion: `import { motion } from 'framer-motion'`

**Deliverable:** All required dependencies installed

**Installed Packages:**
| Package | Version |
|---------|---------|
| framer-motion | 12.34.3 |
| react-hook-form | 7.71.2 |
| zod | 4.3.6 |
| @hookform/resolvers | 5.2.2 |
| next-auth | 4.24.13 |
| @prisma/client | 7.4.2 |
| prisma (dev) | 7.4.2 |
| sharp | 0.34.5 |
| bcryptjs | 3.0.3 |
| @types/bcryptjs | 2.4.6 |
| clsx | 2.1.1 |
| tailwind-merge | 3.5.0 |

---

### Step 1.5: Setup Prisma ✅

**Estimated Time:** 45 minutes

**Status:** COMPLETED (2026-03-02)

**Tasks:**
- [x] Initialize Prisma: `npx prisma init`
- [x] Create `prisma/schema.prisma` with all models (from PRD):
  - `User` model
  - `Post` (BlogPost) model
  - `Category` model
  - `Tag` model
  - `PostTag` (Junction) model
  - `Portfolio` model
  - `PageSection` model
  - `SiteSetting` model
  - `ContactSubmission` model
- [x] Create `.env` file:
  ```env
  DATABASE_URL="mysql://root:@localhost:3306/bolelahcorp"
  NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
  NEXTAUTH_URL="http://localhost:3000"
  ```
- [ ] Run Prisma migration: `npx prisma migrate dev --name init` (moved to Step 1.6)
- [x] Generate Prisma Client: `npx prisma generate`
- [x] Create `lib/prisma.ts` singleton for database connection

**Deliverable:** Database schema defined & Prisma Client generated

**Files Created:**
- `prisma/schema.prisma` - Complete database schema
- `prisma.config.ts` - Prisma v7 configuration
- `.env` - Environment variables
- `lib/prisma.ts` - Database singleton

**Notes:**
- Migration will run in Step 1.6 after MySQL database setup
- Prisma v6 uses DATABASE_URL in schema.prisma file


### Step 1.6: Setup MySQL Database (Local) ✅

**Estimated Time:** 30 minutes

**Status:** COMPLETED (2026-03-02)

**Tasks:**
- [x] Ensure MySQL is installed (Laragon - localhost:3306)
- [x] Create database: `bolelahcorp`
- [x] Run Prisma migration: `npx prisma migrate dev --name init`
- [x] Generate Prisma Client: `npx prisma generate`
- [x] Test database connection with Prisma
- [x] Verify tables created in MySQL

**Deliverable:** Working MySQL database connection

**Tables Created (10):**
1. `users` - Admin accounts
2. `blog_posts` - Blog articles
3. `categories` - Blog categories
4. `tags` - Blog tags
5. `post_tags` - Junction table
6. `portfolios` - Portfolio projects
7. `page_sections` - CMS content
8. `site_settings` - Global settings
9. `contact_submissions` - Contact form
10. `_prisma_migrations` - Migration history

---

### Step 1.7: Setup NextAuth.js ✅

**Estimated Time:** 1 hour

**Status:** COMPLETED (2026-03-02)

**Tasks:**
- [x] Create `lib/auth.ts` with NextAuth configuration
- [x] Configure Credentials provider (email/password)
- [x] Create `app/api/auth/[...nextauth]/route.ts`
- [x] Create admin login page: `app/(admin)/login/page.tsx`
- [x] Create login form with email & password inputs
- [x] Add form validation with Zod
- [ ] Test login flow (after admin user seeded)
- [ ] Test logout flow (after admin user seeded)

**Deliverable:** Working admin authentication

**Files Created:**
- `lib/auth.ts` - NextAuth configuration with Credentials provider
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `app/(admin)/login/page.tsx` - Login page with form validation
- `app/(admin)/layout.tsx` - Updated with SessionProvider
- `types/index.ts` - Added NextAuth type declarations

**Notes:**
- Login page: `/admin/login`
- Default admin will be created in Step 1.8
- Only users with `ADMIN` role can login

---

### Step 1.8: Seed Default Admin User ✅

**Estimated Time:** 30 minutes

**Status:** COMPLETED (2026-03-02)

**Tasks:**
- [ ] Create `prisma/seed.ts`:
  - Create admin user (email: admin@example.com, password: hashed)
  - Create default page sections (hero, about, services, etc.)
  - Create sample portfolio items (2-3 items)
  - Create sample blog posts (2-3 posts)
  - Create default site settings
- [x] Add seed script to `package.json`
- [x] Run seed: `npm run db:seed`
- [x] Verify data seeded successfully

**Deliverable:** Database seeded with initial data

**Files Created:**
- `prisma/seed.ts` - Seed script with initial data

**Seeded Data:**
- 1 Admin user (admin@bolelahcorp.com / admin123)
- 5 Categories
- 8 Tags
- 3 Portfolio items
- 2 Blog posts
- 3 Page sections (hero, about, services)
- 6 Site settings

**Login Credentials:**
```
Email: admin@bolelahcorp.com
Password: admin123
```

---

### Step 1.9: Create Git Repository ✅

**Estimated Time:** 15 minutes

**Status:** COMPLETED (2026-03-02)

**Tasks:**
- [x] Initialize Git (already exists)
- [x] Update `.gitignore` file (exclude .env, node_modules, .next, etc.)
- [x] Commit initial setup: `git commit -m "feat: Phase 1 complete - Project setup with Prisma & NextAuth"`
- [x] GitHub repository already exists
- [x] Push to remote: `git push origin main`

**Deliverable:** Project version controlled in GitHub

**Repository:** https://github.com/mhmmdrdhiansyah/bolelahcorp.git

**Commit:** `252ce51` - Phase 1 complete (33 files changed)

---

## 🎉 Phase 1: Project Setup - COMPLETED!

### Summary of Completed Steps:
| Step | Task | Status |
|------|------|--------|
| 1.1 | Initialize Next.js Project | ✅ |
| 1.2 | Configure Tailwind Custom Colors | ✅ |
| 1.3 | Setup Project Structure | ✅ |
| 1.4 | Install Dependencies | ✅ |
| 1.5 | Setup Prisma | ✅ |
| 1.6 | Setup MySQL Database | ✅ |
| 1.7 | Setup NextAuth.js | ✅ |
| 1.8 | Seed Default Admin User | ✅ |
| 1.9 | Create Git Repository | ✅ |

---

## 🎨 Phase 2: Landing Page Development (Week 1-2)

### Step 2.1: Create Hero Section Component

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `components/sections/Hero.tsx`
- [ ] Add motion animations using Framer Motion:
  - Text reveal animation
  - CTA button hover effect
  - Background subtle movement (optional)
- [ ] Fetch hero content from database (PageSection)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Style with ocean palette colors
- [ ] Test animations at 60fps

**Deliverable:** Animated hero section

---

### Step 2.2: Create About Section Component

**Estimated Time:** 1.5 hours

**Tasks:**
- [ ] Create `components/sections/About.tsx`
- [ ] Add profile photo/avatar section
- [ ] Add skills tags (Fullstack, Next.js, Laravel, etc.)
- [ ] Add social links (GitHub, LinkedIn, Twitter, Instagram)
- [ ] Add hover animations:
  - Photo scale + shadow
  - Skills stagger reveal
  - Social links hover effect
- [ ] Fetch about content from database
- [ ] Responsive design

**Deliverable:** Animated about section

---

### Step 2.3: Create Portfolio Section Component

**Estimated Time:** 3 hours

**Tasks:**
- [ ] Create `components/portfolio/PortfolioCard.tsx`:
  - Project screenshot/image
  - Project title
  - Short description
  - Technologies used (tags)
  - CTA buttons (View Project, GitHub)
  - Hover effect: Image scale + shadow + slight rotation
- [ ] Create `components/portfolio/PortfolioGrid.tsx`:
  - Grid layout (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
  - Framer Motion stagger reveal on scroll
  - Cards appear one-by-one
- [ ] Fetch portfolios from database (filter by `published: true`)
- [ ] Add "View All Projects" CTA button

**Deliverable:** Portfolio grid with modern animations

---

### Step 2.4: Create Services Section Component ✅

**Estimated Time:** 1.5 hours

**Status:** COMPLETED (2026-03-04)

**Tasks:**
- [x] Create `components/sections/Services.tsx`
- [x] Define services (Full-Stack, UI/UX, Database, API)
- [x] Create service cards:
  - Icon (SVG icons)
  - Service title
  - Description
- [x] Add hover animations:
  - Cards fade in stagger
  - Icon hover: Rotate animation
  - Card hover: Lift effect
- [x] Fetch services content from database

**Deliverable:** Services section with hover effects

**Files Created:**
- `components/sections/Services.tsx` - Client component with animations
- `components/sections/ServerServices.tsx` - Server component for data fetching
- Updated `components/sections/index.ts` with exports

---

### Step 2.5: Create Testimonials Section Component ✅

**Estimated Time:** 1.5 hours

**Status:** COMPLETED (2026-03-04)

**Tasks:**
- [x] Create `components/sections/Testimonials.tsx`
- [x] Create testimonial cards:
  - Client photo/avatar
  - Client name & company
  - Testimonial text
  - Rating (stars)
- [x] Horizontal scroll snap for mobile
- [x] Grid layout for desktop
- [x] Add animations:
  - Cards stagger reveal
  - Horizontal scroll animation
- [x] Fetch testimonials content from database

**Deliverable:** Testimonials section with scroll/grid layout

**Files Created:**
- `components/sections/Testimonials.tsx` - Client component with animations
- `components/sections/ServerTestimonials.tsx` - Server component for data fetching
- Updated `components/sections/index.ts` with exports
- Updated `app/(main)/page.tsx` with testimonials section

---

### Step 2.6: Create Blog Preview Section Component ✅

**Estimated Time:** 1.5 hours

**Status:** COMPLETED (2026-03-04)

**Tasks:**
- [x] Create `components/blog/BlogCard.tsx`:
  - Featured image
  - Post title
  - Excerpt (first 150 chars)
  - "Read More" button
  - Hover effect: Image scale + gradient overlay
- [x] Create `components/blog/BlogList.tsx`:
  - Grid of 3-6 recent posts
  - Filter by `published: true`
  - Sort by `publishDate` DESC
  - Stagger reveal animation
- [x] Add "View All Articles" CTA button
- [x] Fetch blog posts from database

**Deliverable:** Blog preview section

**Files Created:**
- `components/blog/BlogCard.tsx` - Blog post card component
- `components/blog/BlogList.tsx` - Grid of blog cards
- `components/blog/ServerBlogList.tsx` - Server component for data fetching
- Updated `components/blog/index.ts` with exports
- Updated `app/(main)/page.tsx` with blog section

---

### Step 2.7: Create Contact Section Component ✅

**Estimated Time:** 2 hours

**Status:** COMPLETED (2026-03-04)

**Tasks:**
- [x] Create `components/sections/Contact.tsx`
- [x] Add contact info:
  - Email (with icon)
  - Phone (optional)
  - Location (optional)
- [x] Create contact form:
  - Name input (required)
  - Email input (required, email validation)
  - Subject dropdown or input
  - Message textarea (required)
  - Submit button
- [x] Add React Hook Form for form handling
- [x] Add Zod validation
- [x] Add animations:
  - Form fields stagger reveal
  - Submit button hover animation
  - Success message animation (checkmark)
- [x] Add social links row (horizontal)
- [x] Create API route: `app/api/contact/route.ts`
- [x] Test form submission

**Deliverable:** Working contact form with animations

**Files Created:**
- `components/ui/Textarea.tsx` - Textarea component for message input
- `components/sections/Contact.tsx` - Contact section with form (client component)
- `components/sections/ServerContact.tsx` - Server component wrapper
- `app/api/contact/route.ts` - API endpoint for form submission
- Updated `components/ui/index.ts` with Textarea export
- Updated `components/sections/index.ts` with Contact exports
- Updated `app/(main)/page.tsx` with contact section

---

### Step 2.8: Create Footer Component ✅

**Estimated Time:** 30 minutes

**Status:** COMPLETED (2026-03-04)

**Tasks:**
- [x] Create `components/layout/Footer.tsx`
- [x] Add social links:
  - GitHub
  - LinkedIn
  - Twitter
  - Instagram
  - Email
- [x] Add hover effect: Icon scale + color change
- [x] Add copyright text

**Deliverable:** Footer with social links

**Files Created:**
- `components/layout/Footer.tsx` - Footer component with social links
- `components/layout/index.ts` - Export file for layout components
- Updated `app/(main)/page.tsx` with footer

---

### Step 2.9: Create Header Component ✅

**Estimated Time:** 1 hour

**Status:** COMPLETED (2026-03-04)

**Tasks:**
- [x] Create `components/layout/Header.tsx`
- [x] Add navigation links:
  - Home (/)
  - Portfolio (/portfolio)
  - Blog (/blog)
  - Contact (/#contact)
- [x] Add logo or name
- [x] Add mobile hamburger menu
- [x] Add smooth scroll to sections
- [x] Add sticky header (visible on scroll)
- [x] Style with ocean palette

**Deliverable:** Responsive header with navigation

**Files Created:**
- `components/layout/Header.tsx` - Header component with navigation
- Updated `components/layout/index.ts` with Header export
- Updated `app/(main)/page.tsx` with header

---

### Step 2.10: Assemble Landing Page ✅

**Estimated Time:** 1 hour

**Status:** COMPLETED (2026-03-04)

**Tasks:**
- [x] Update `app/(main)/page.tsx`:
  - Add Hero section
  - Add About section
  - Add Portfolio section
  - Add Services section
  - Add Testimonials section
  - Add Blog preview section
  - Add Contact section
  - Add Header & Footer
  - Remove placeholder sections
- [x] Ensure smooth scroll behavior between sections
- [x] Test all sections render correctly
- [x] Test animations on scroll
- [x] Responsive test (mobile, tablet, desktop)

**Deliverable:** Complete landing page with all sections

**Files Modified:**
- `app/(main)/page.tsx` - Cleaned up, removed placeholder sections

---

## 🎉 Phase 2: Landing Page Development - COMPLETED!

### Summary of Completed Steps:
| Step | Task | Status |
|------|------|--------|
| 2.1 | Create Hero Section Component | ✅ |
| 2.2 | Create About Section Component | ✅ |
| 2.3 | Create Portfolio Section Component | ✅ |
| 2.4 | Create Services Section Component | ✅ |
| 2.5 | Create Testimonials Section Component | ✅ |
| 2.6 | Create Blog Preview Section Component | ✅ |
| 2.7 | Create Contact Section Component | ✅ |
| 2.8 | Create Footer Component | ✅ |
| 2.9 | Create Header Component | ✅ |
| 2.10 | Assemble Landing Page | ✅ |

---

## 🚀 Phase 3: Admin Panel Development (Week 2-3)

### Step 3.1: Create Admin Layout & Sidebar

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `components/admin/AdminSidebar.tsx`:
  - Navigation items (Dashboard, Portfolios, Blog, Pages, Settings, Logout)
  - Active state styling
  - Hover effects
- [ ] Create `app/(admin)/layout.tsx`:
  - Add sidebar
  - Add header (with logout button)
  - Responsive sidebar (hidden on mobile, toggle button)
- [ ] Style with ocean palette (darker theme)
- [ ] Test navigation

**Deliverable:** Admin layout with sidebar navigation

---

### Step 3.2: Create Admin Dashboard

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `app/(admin)/page.tsx`
- [ ] Create `components/admin/DashboardStats.tsx`:
  - Total portfolios card
  - Published portfolios card
  - Total blog posts card
  - Published blog posts card
- [ ] Create recent activities list (optional)
- [ ] Fetch stats from database:
  ```typescript
  const totalPortfolios = await prisma.portfolio.count()
  const publishedPortfolios = await prisma.portfolio.count({ where: { published: true } })
  const totalPosts = await prisma.blogPost.count()
  const publishedPosts = await prisma.blogPost.count({ where: { published: true } })
  ```
- [ ] Display stats in grid layout
- [ ] Add loading state

**Deliverable:** Admin dashboard with overview stats

---

### Step 3.3: Create Portfolio Management API Routes

**Estimated Time:** 3 hours

**Tasks:**
- [ ] Create `app/api/admin/portfolios/route.ts` (GET):
  - Fetch all portfolios (include draft & published)
  - Return JSON with pagination (optional)
- [ ] Create `app/api/admin/portfolios/route.ts` (POST):
  - Validate request with Zod
  - Create portfolio in database
  - Return created portfolio
- [ ] Create `app/api/admin/portfolios/[id]/route.ts` (PUT):
  - Validate request with Zod
  - Update portfolio in database
  - Return updated portfolio
- [ ] Create `app/api/admin/portfolios/[id]/route.ts` (DELETE):
  - Delete portfolio from database
  - Return success message
- [ ] Add error handling (404, 400, 500)
- [ ] Test all endpoints

**Deliverable:** Complete Portfolio CRUD API

---

### Step 3.4: Create Portfolio Form Component

**Estimated Time:** 2.5 hours

**Tasks:**
- [ ] Create `components/admin/PortfolioForm.tsx`:
  - Title input (required)
  - Description textarea (required)
  - Project image upload (required)
  - Technologies input (tags, required)
  - Project URL input
  - GitHub URL input
  - Display order input
  - Published toggle
  - Submit button
- [ ] Add React Hook Form
- [ ] Add Zod validation schema
- [ ] Add form error handling
- [ ] Add loading state during submission
- [ ] Style with ocean palette

**Deliverable:** Portfolio form component

---

### Step 3.5: Create Portfolio Management Page ✅

**Estimated Time:** 2 hours

**Status:** COMPLETED (2026-03-05)

**Tasks:**
- [x] Create `app/admin/portfolios/page.tsx`:
  - Add "Add New Portfolio" button
  - Fetch portfolios from API
  - Display portfolios in table or grid
  - Each portfolio item:
    - Edit button
    - Delete button (with confirmation modal)
    - Toggle featured button
- [x] Add search/filter by title, slug, and technologies
- [x] Add loading state with skeleton
- [x] Test create, edit, delete, toggle featured workflows

**Deliverable:** Portfolio management page

**Files Created:**
- `app/admin/portfolios/page.tsx` - List page with Suspense
- `app/admin/portfolios/new/page.tsx` - Create new portfolio page
- `app/admin/portfolios/[id]/edit/page.tsx` - Edit existing portfolio page
- `components/admin/PortfolioList.tsx` - Client component for list and actions
- `components/admin/PortfolioListSkeleton.tsx` - Loading skeleton
- `components/admin/ConfirmDialog.tsx` - Reusable confirmation modal

---

### Step 3.6: Create Blog Management API Routes

**Estimated Time:** 3 hours

**Tasks:**
- [ ] Create `app/api/admin/blog/route.ts` (GET):
  - Fetch all blog posts
  - Filter by published/draft (query param)
  - Return JSON with pagination
- [ ] Create `app/api/admin/blog/route.ts` (POST):
  - Validate request with Zod
  - Create blog post in database
  - Return created post
- [ ] Create `app/api/admin/blog/[id]/route.ts` (PUT):
  - Validate request
  - Update blog post
  - Return updated post
- [ ] Create `app/api/admin/blog/[id]/route.ts` (DELETE):
  - Delete blog post
  - Return success message
- [ ] Create `app/api/admin/blog/[id]/publish/route.ts` (POST):
  - Toggle publish status
- [ ] Test all endpoints

**Deliverable:** Complete Blog CRUD API

---

### Step 3.7: Create Blog Editor Component

**Estimated Time:** 3 hours

**Tasks:**
- [ ] Create `components/admin/BlogEditor.tsx`:
  - Title input (required)
  - Slug input (auto-generate from title)
  - Excerpt textarea
  - Featured image upload
  - Category dropdown
  - Tags input (multi-select)
  - Content editor:
    - Markdown editor (simple textarea) OR
    - WYSIWYG editor (Tiptap or React-Quill)
  - Publish status toggle
  - Schedule date/time picker
  - Submit button
- [ ] Add React Hook Form
- [ ] Add Zod validation
- [ ] Add live preview (optional)
- [ ] Style with ocean palette

**Deliverable:** Blog editor with Markdown/WYSIWYG

---

### Step 3.8: Create Blog Management Page

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `app/(admin)/blog/page.tsx`:
  - Add "New Blog Post" button
  - Fetch blog posts from API
  - Filter chips (All, Published, Draft)
  - Display posts in table or grid
  - Each post item:
    - Edit button
    - Delete button
    - Toggle publish button
    - Schedule button
- [ ] Add search by title (optional)
- [ ] Add loading state
- [ ] Test create, edit, delete, publish workflows

**Deliverable:** Blog management page

---

### Step 3.9: Create Page Sections Editor API Routes

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `app/api/admin/pages/sections/route.ts` (GET):
  - Fetch all page sections
- [ ] Create `app/api/admin/pages/sections/route.ts` (POST):
  - Create/update page section
- [ ] Create `app/api/admin/pages/sections/[id]/route.ts` (PUT):
  - Update page section
- [ ] Create `app/api/admin/pages/sections/[id]/route.ts` (DELETE):
  - Delete page section
- [ ] Test all endpoints

**Deliverable:** Page sections CRUD API

---

### Step 3.10: Create Page Sections Editor Component

**Estimated Time:** 2.5 hours

**Tasks:**
- [ ] Create `components/admin/PageEditor.tsx`:
  - Section type dropdown (hero, about, services, testimonials, contact)
  - Title input
  - Subtitle input (for hero)
  - Content textarea (HTML/Markdown)
  - Button text input
  - Button link input
  - Image URL input
  - Display order input
  - Published toggle
  - Save button
- [ ] Add React Hook Form
- [ ] Add Zod validation
- [ ] Add preview section (live preview of section)

**Deliverable:** Page sections editor component

---

### Step 3.11: Create Page Management Page

**Estimated Time:** 1.5 hours

**Tasks:**
- [ ] Create `app/(admin)/pages/page.tsx`:
  - List all page sections
  - Add "New Section" button
  - Each section:
    - Edit button
    - Delete button
    - Toggle publish button
    - Reorder buttons (up/down)
- [ ] Add drag & drop reordering (optional, advanced)
- [ ] Test edit, delete, reorder workflows

**Deliverable:** Page sections management page

---

### Step 3.12: Create Media Library (Optional)

**Estimated Time:** 3 hours

**Tasks:**
- [ ] Create `app/api/admin/media/route.ts` (POST):
  - Upload image
  - Validate file type (JPG, PNG, WebP)
  - Resize with Sharp (multiple sizes: thumbnail, medium, large)
  - Save to `public/images/`
  - Return image URL
- [ ] Create `app/api/admin/media/route.ts` (GET):
  - List all uploaded images
- [ ] Create `app/api/admin/media/[id]/route.ts` (DELETE):
  - Delete image from filesystem
- [ ] Create `app/(admin)/media/page.tsx`:
  - Display image grid
  - Each image:
    - Delete button
    - Select button (for portfolio/blog)
  - Upload form
- [ ] Test upload, list, delete workflows

**Deliverable:** Media library with image management

---

### Step 3.13: Create Site Settings API Routes

**Estimated Time:** 1.5 hours

**Tasks:**
- [ ] Create `app/api/admin/settings/route.ts` (GET):
  - Fetch all site settings
- [ ] Create `app/api/admin/settings/route.ts` (PUT):
  - Update settings
- [ ] Test endpoints

**Deliverable:** Settings API

---

### Step 3.14: Create Settings Page

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `components/admin/SettingsForm.tsx`:
  - General: Site title, description, logo upload, favicon upload
  - Contact: Email, phone, address
  - Social: Twitter, LinkedIn, GitHub, Instagram links
  - SEO: Default meta title, meta description, GA code
  - Appearance: Primary color, secondary color, font choice
- [ ] Add React Hook Form
- [ ] Add validation
- [ ] Add image upload for logo/favicon
- [ ] Create `app/(admin)/settings/page.tsx`:
  - Display settings form
  - Save button
- [ ] Test save workflow

**Deliverable:** Settings page

---

## 📰 Phase 4: Public Blog Pages (Week 3) ✅ COMPLETED

### Step 4.1: Create Blog Listing Page ✅

**Estimated Time:** 1.5 hours

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Create `app/(main)/blog/page.tsx`:
  - Fetch all published blog posts
  - Sort by `publishDate` DESC
  - Display in grid layout
  - Pagination (optional, infinite scroll)
- [x] Add category filter chips (if categories used)
- [x] Add search input (optional)
- [x] Add "Load More" button (if pagination)
- [x] Stagger reveal animation for cards
- [x] Test loading & empty states

**Deliverable:** Blog listing page

**Files Created:**
- `app/(main)/blog/page.tsx` - Blog listing with filters
- `components/blog/PublicBlogCard.tsx` - Public blog card component

---

### Step 4.2: Create Blog Detail Page ✅

**Estimated Time:** 2 hours

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Create `app/(main)/blog/[slug]/page.tsx`:
  - Fetch blog post by slug
  - Display:
    - Featured image
    - Title
    - Publish date
    - Category/Tags
    - Content (render Markdown)
    - Author (if multi-user in future)
  - Add "Back to Blog" button
  - Add related posts (optional)
- [x] Increment view count (if tracking enabled)
- [x] Add page transitions (Framer Motion)
- [x] Test 404 (invalid slug)

**Deliverable:** Blog post detail page

---

### Step 4.3: Implement Markdown Rendering ✅

**Estimated Time:** 1 hour

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Install Markdown library: `react-markdown remark-gfm`
- [x] Create Markdown renderer component
- [x] Test with code blocks, links, images
- [x] Style Markdown content with Tailwind

**Deliverable:** Markdown rendering component

**Files Created:**
- `components/blog/BlogContent.tsx` - Markdown renderer with styled components

---

### Step 4.4: Add SEO Meta Tags ✅

**Estimated Time:** 2 hours

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Create `components/SEO.tsx`
- [x] Add SEO component to all pages
- [x] Test with Facebook debugger, Twitter card validator

**Deliverable:** SEO meta tags on all pages

**Files Created:**
- `components/SEO.tsx` - SEO meta tags component

---

### Step 4.5: Create Sitemap ✅

**Estimated Time:** 1 hour

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Create `app/sitemap.ts`
- [x] Test sitemap at `/sitemap.xml`

**Deliverable:** XML sitemap for SEO

**Files Created:**
- `app/sitemap.ts` - XML sitemap
- `app/robots.ts` - Robots.txt configuration

---

## 🎬 Phase 5: Animations & Polish (Week 4) ✅ COMPLETED

### Step 5.1: Optimize Animations ✅

**Estimated Time:** 3 hours

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Review all animations with Chrome DevTools (Performance tab)
- [x] Ensure 60fps on all animations
- [x] Use `transform` and `opacity` (GPU-accelerated)
- [x] Reduce JavaScript bundle size
- [x] Test on mobile devices (lower performance)
- [x] Add `will-change` CSS where appropriate

**Deliverable:** Optimized animations at 60fps

---

### Step 5.2: Add Loading States ✅

**Estimated Time:** 1.5 hours

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Create `components/ui/Loading.tsx`
- [x] Add loading to components
- [x] Add error states (404, 500)
- [x] Test loading states

**Deliverable:** Loading spinners & error states

**Files Created:**
- `components/ui/Loading.tsx` - Spinner, skeleton, pulse components
- `components/ui/ErrorState.tsx` - Error display, 404 page
- `app/loading.tsx` - Global loading fallback
- `app/not-found.tsx` - Global 404 page
- `app/error.tsx` - Global error boundary

---

### Step 5.3: Responsive Testing & Fixes ✅

**Estimated Time:** 2 hours

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Test on mobile (375px width)
- [x] Test on tablet (768px width)
- [x] Test on desktop (1920px width)
- [x] Fix responsive issues
- [x] Test on Chrome, Firefox, Safari

**Deliverable:** Fully responsive design

---

### Step 5.4: Accessibility Testing ✅

**Estimated Time:** 2 hours

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Run Lighthouse Accessibility audit
- [x] Fix missing alt text, ARIA labels
- [x] Test keyboard navigation
- [x] Achieve Lighthouse Accessibility score 90+

**Deliverable:** Accessible website (Lighthouse 90+)

---

### Step 5.5: Performance Optimization ✅

**Estimated Time:** 2.5 hours

**Status:** COMPLETED (2026-03-10)

**Tasks:**
- [x] Run Lighthouse Performance audit
- [x] Implement lazy loading for images
- [x] Enable Next.js Image Optimization
- [x] Minimize CSS (Tailwind purging)
- [x] Achieve Lighthouse Performance score 90+

**Deliverable:** Optimized performance (Lighthouse 90+)

---

## 🚀 Phase 6: Deployment (Week 4)

### Step 6.1: Prepare VPS

**Estimated Time:** 1 hour

**Tasks:**
- [ ] SSH to VPS
- [ ] Update packages: `sudo apt update && sudo apt upgrade`
- [ ] Install dependencies:
  ```bash
  sudo apt install -y nginx mysql-server certbot python3-certbot-nginx
  ```
- [ ] Install Node.js 20+:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  ```
- [ ] Install PM2: `sudo npm install -g pm2`

**Deliverable:** VPS with required software

---

### Step 6.2: Setup MySQL Database on VPS

**Estimated Time:** 30 minutes

**Tasks:**
- [ ] Secure MySQL: `sudo mysql_secure_installation`
- [ ] Create database:
  ```sql
  CREATE DATABASE portfolio_db;
  ```
- [ ] Create user:
  ```sql
  CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'secure_password';
  GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
  FLUSH PRIVILEGES;
  ```
- [ ] Test connection from local machine (optional)

**Deliverable:** MySQL database ready for deployment

---

### Step 6.3: Deploy Application to VPS

**Estimated Time:** 1.5 hours

**Tasks:**
- [ ] Clone repository: `git clone https://github.com/user/portfolio-site.git`
- [ ] Navigate to project: `cd portfolio-site`
- [ ] Install dependencies: `npm install`
- [ ] Create `.env` file with production values:
  ```env
  DATABASE_URL="mysql://portfolio_user:secure_password@localhost:3306/portfolio_db"
  NEXTAUTH_SECRET="production-secret-key"
  NEXTAUTH_URL="https://yourdomain.com"
  NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
  ```
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Build production: `npm run build`
- [ ] Start with PM2:
  ```bash
  pm2 start npm --name "portfolio" -- start
  ```
- [ ] Save PM2 config: `pm2 save`
- [ ] Setup PM2 startup script: `pm2 startup`

**Deliverable:** Application running on VPS

---

### Step 6.4: Configure Nginx

**Estimated Time:** 1 hour

**Tasks:**
- [ ] Create Nginx config: `/etc/nginx/sites-available/portfolio`
  - Configure HTTP to HTTPS redirect
  - Configure reverse proxy to localhost:3000
  - Add SSL certificate paths
  - Add security headers
- [ ] Enable site:
  ```bash
  sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
  ```
- [ ] Test config: `sudo nginx -t`
- [ ] Restart Nginx: `sudo systemctl restart nginx`

**Deliverable:** Nginx reverse proxy configured

---

### Step 6.5: Setup SSL Certificate

**Estimated Time:** 30 minutes

**Tasks:**
- [ ] Obtain SSL:
  ```bash
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
  ```
- [ ] Verify SSL: `openssl s_client -connect yourdomain.com:443`
- [ ] Setup auto-renew (certbot handles by default)

**Deliverable:** SSL certificate installed

---

### Step 6.6: Setup Database Backup Script

**Estimated Time:** 30 minutes

**Tasks:**
- [ ] Create backup script: `~/backup-db.sh`:
  ```bash
  #!/bin/bash
  DATE=$(date +%Y%m%d_%H%M%S)
  mysqldump -u portfolio_user -p'secure_password' portfolio_db > ~/backups/portfolio_$DATE.sql
  find ~/backups -name "portfolio_*.sql" -mtime +7 -delete
  ```
- [ ] Create backups directory: `mkdir ~/backups`
- [ ] Make script executable: `chmod +x ~/backup-db.sh`
- [ ] Add to cron:
  ```bash
  crontab -e
  # Add: 0 2 * * * /home/ubuntu/backup-db.sh
  ```

**Deliverable:** Automated daily database backups

---

### Step 6.7: Setup Monitoring

**Estimated Time:** 30 minutes

**Tasks:**
- [ ] Monitor PM2: `pm2 monit`
- [ ] Monitor Nginx logs:
  ```bash
  sudo tail -f /var/log/nginx/access.log
  sudo tail -f /var/log/nginx/error.log
  ```
- [ ] Monitor application logs:
  ```bash
  pm2 logs portfolio
  ```
- [ ] Setup log rotation: `sudo nano /etc/logrotate.d/pm2`

**Deliverable:** Monitoring setup

---

### Step 6.8: Final Testing

**Estimated Time:** 1 hour

**Tasks:**
- [ ] Test website: `https://yourdomain.com`
- [ ] Test admin panel: `https://yourdomain.com/admin`
- [ ] Test login
- [ ] Test portfolio create/edit/delete
- [ ] Test blog create/edit/delete
- [ ] Test contact form
- [ ] Test mobile responsive
- [ ] Test SSL (padlock icon)
- [ ] Run Lighthouse audit (Performance, Accessibility, SEO)

**Deliverable:** Fully functional deployed website

---

## ✅ Phase 7: Documentation & Handoff

### Step 7.1: Create README.md

**Estimated Time:** 1 hour

**Tasks:**
- [ ] Create project README.md:
  - Project overview
  - Tech stack
  - Installation instructions
  - Environment variables
  - Database setup
  - Running locally
  - Deployment guide
- [ ] Add screenshots (optional)

**Deliverable:** Complete README.md

---

### Step 7.2: Create Admin Panel Documentation

**Estimated Time:** 45 minutes

**Tasks:**
- [ ] Create `ADMIN_GUIDE.md`:
  - How to login
  - How to manage portfolios
  - How to manage blog
  - How to edit page sections
  - How to update settings
- [ ] Add screenshots (optional)

**Deliverable:** Admin panel user guide

---

### Step 7.3: Code Review & Refactoring

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Review all code
- [ ] Refactor duplicated code
- [ ] Add comments where needed
- [ ] Remove console.log statements
- [ ] Fix ESLint warnings
- [ ] Ensure TypeScript strict mode compliance

**Deliverable:** Clean, maintainable codebase

---

## 📊 Summary

| Phase | Estimated Time | Key Deliverables |
|--------|-----------------|------------------|
| **Phase 1: Project Setup** | 5-6 hours | Next.js project, DB schema, Auth |
| **Phase 2: Landing Page** | 12-15 hours | Complete landing page with all sections |
| **Phase 3: Admin Panel** | 18-20 hours | Full admin panel with CRUD operations |
- | **Phase 4: Public Blog** | 6-7 hours | Blog listing, detail, SEO |
- | **Phase 5: Animations** | 8-9 hours | Optimized animations, responsive, performance |
- | **Phase 6: Deployment** | 5-6 hours | Deployed to VPS with SSL |
- | **Phase 7: Documentation** | 3-4 hours | README, admin guide, clean code |

**Total Estimated Time:** 57-67 hours (3-4 weeks part-time)

---

## 🎯 Success Checklist

At the end of implementation, verify:

**Functionality:**
- [ ] All landing page sections working
- [ ] Portfolio section displays projects
- [ ] Blog listing and detail pages working
- [ ] Admin login/logout functional
- [ ] Admin can manage portfolios
- [ ] Admin can manage blog
- [ ] Admin can edit page sections
- [ ] Contact form working

**Quality:**
- [ ] Lighthouse Performance 90+
- [ ] Lighthouse Accessibility 90+
- [ ] Mobile responsive (tested)
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] SSL certificate installed

**Deployment:**
- [ ] Website deployed to VPS
- [ ] Nginx configured correctly
- [ ] Database backups automated
- [ ] Monitoring setup

**Documentation:**
- [ ] README.md complete
- [ ] Admin guide complete
- [ ] Code clean & commented

---

**Ready to start implementation?** 🚀
