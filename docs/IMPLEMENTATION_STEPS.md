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

### Step 1.3: Setup Project Structure

**Estimated Time:** 1 hour

**Tasks:**
- [ ] Create folder structure:
  ```
  app/
  ├── (public)/
  ├── (admin)/
  ├── components/
  │   ├── ui/
  │   ├── sections/
  │   ├── portfolio/
  │   ├── blog/
  │   └── admin/
  ├── lib/
  ├── styles/
  ├── types/
  └── public/images/
  ```
- [ ] Create basic layout files:
  - `app/(public)/layout.tsx` (root layout)
  - `app/(admin)/layout.tsx` (admin layout)
- [ ] Create `types/index.ts` for TypeScript interfaces
- [ ] Create `lib/constants.ts` for color palette & constants

**Deliverable:** Complete folder structure matching architecture

---

### Step 1.4: Install Dependencies

**Estimated Time:** 30 minutes

**Tasks:**
- [ ] Install core dependencies:
  ```bash
  npm install framer-motion react-hook-form zod @hookform/resolvers next-auth
  npm install @prisma/client
  npm install -D prisma
  npm install sharp
  ```
- [ ] Verify all packages in `package.json`
- [ ] Test import framer-motion: `import { motion } from 'framer-motion'`

**Deliverable:** All required dependencies installed

---

### Step 1.5: Setup Prisma

**Estimated Time:** 45 minutes

**Tasks:**
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Create `prisma/schema.prisma` with all models (from PRD):
  - `User` model
  - `Portfolio` model
  - `BlogPost` model
  - `PageSection` model
  - `SiteSetting` model
- [ ] Create `.env` file:
  ```env
  DATABASE_URL="mysql://user:password@localhost:3306/portfolio_db"
  NEXTAUTH_SECRET="your-secret-key-here"
  NEXTAUTH_URL="http://localhost:3000"
  ```
- [ ] Run Prisma migration: `npx prisma migrate dev --name init`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Create `lib/prisma.ts` singleton for database connection

**Deliverable:** Database schema defined & migrated

---

### Step 1.6: Setup MySQL Database (Local)

**Estimated Time:** 30 minutes

**Tasks:**
- [ ] Ensure MySQL is installed (or use Docker):
  ```bash
  docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=portfolio_db mysql:8.0
  ```
- [ ] Create database user (if not using Docker):
  ```sql
  CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'password';
  GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
  FLUSH PRIVILEGES;
  ```
- [ ] Test database connection with Prisma
- [ ] Verify tables created in MySQL

**Deliverable:** Working MySQL database connection

---

### Step 1.7: Setup NextAuth.js

**Estimated Time:** 1 hour

**Tasks:**
- [ ] Create `lib/auth.ts` with NextAuth configuration
- [ ] Configure Credentials provider (email/password)
- [ ] Create `app/api/auth/[...nextauth]/route.ts`
- [ ] Create admin login page: `app/(admin)/login/page.tsx`
- [ ] Create login form with email & password inputs
- [ ] Add form validation with Zod
- [ ] Test login flow (invalid credentials, valid credentials)
- [ ] Test logout flow

**Deliverable:** Working admin authentication

---

### Step 1.8: Seed Default Admin User

**Estimated Time:** 30 minutes

**Tasks:**
- [ ] Create `prisma/seed.ts`:
  - Create admin user (email: admin@example.com, password: hashed)
  - Create default page sections (hero, about, services, etc.)
  - Create sample portfolio items (2-3 items)
  - Create sample blog posts (2-3 posts)
  - Create default site settings
- [ ] Add seed script to `package.json`:
  ```json
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
  ```
- [ ] Run seed: `npx prisma db seed`
- [ ] Verify data in database via Prisma Studio or MySQL client

**Deliverable:** Database seeded with initial data

---

### Step 1.9: Create Git Repository

**Estimated Time:** 15 minutes

**Tasks:**
- [ ] Initialize Git: `git init`
- [ ] Create `.gitignore` file (exclude .env, node_modules, .next, etc.)
- [ ] Commit initial setup: `git commit -m "Initial project setup"`
- [ ] Create GitHub repository
- [ ] Push to remote: `git remote add origin <repo-url>`
- [ ] Push: `git push -u origin main`

**Deliverable:** Project version controlled in GitHub

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

### Step 2.4: Create Services Section Component

**Estimated Time:** 1.5 hours

**Tasks:**
- [ ] Create `components/sections/Services.tsx`
- [ ] Define services (Full-Stack, UI/UX, Database, API)
- [ ] Create service cards:
  - Icon (emoji or Lucide React icon)
  - Service title
  - Description
- [ ] Add hover animations:
  - Cards fade in stagger
  - Icon hover: Rotate or scale
  - Card hover: Lift effect
- [ ] Fetch services content from database

**Deliverable:** Services section with hover effects

---

### Step 2.5: Create Testimonials Section Component

**Estimated Time:** 1.5 hours

**Tasks:**
- [ ] Create `components/sections/Testimonials.tsx`
- [ ] Create testimonial cards:
  - Client photo/avatar
  - Client name & company
  - Testimonial text
  - Rating (stars)
- [ ] Horizontal scroll snap for mobile
- [ ] Grid layout for desktop
- [ ] Add animations:
  - Cards stagger reveal
  - Horizontal scroll animation

**Deliverable:** Testimonials section with scroll/grid layout

---

### Step 2.6: Create Blog Preview Section Component

**Estimated Time:** 1.5 hours

**Tasks:**
- [ ] Create `components/blog/BlogCard.tsx`:
  - Featured image
  - Post title
  - Excerpt (first 150 chars)
  - "Read More" button
  - Hover effect: Image scale + gradient overlay
- [ ] Create `components/blog/BlogList.tsx`:
  - Grid of 3-6 recent posts
  - Filter by `published: true`
  - Sort by `publishDate` DESC
  - Stagger reveal animation
- [ ] Add "View All Articles" CTA button

**Deliverable:** Blog preview section

---

### Step 2.7: Create Contact Section Component

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `components/sections/Contact.tsx`
- [ ] Add contact info:
  - Email (with icon)
  - Phone (optional)
  - Location (optional)
- [ ] Create contact form:
  - Name input (required)
  - Email input (required, email validation)
  - Subject dropdown or input
  - Message textarea (required)
  - Submit button
- [ ] Add React Hook Form for form handling
- [ ] Add Zod validation
- [ ] Add animations:
  - Form fields stagger reveal
  - Submit button hover animation
  - Success message animation (checkmark)
- [ ] Add social links row (horizontal)
- [ ] Create API route: `app/api/contact/route.ts`
- [ ] Test form submission

**Deliverable:** Working contact form with animations

---

### Step 2.8: Create Footer Component

**Estimated Time:** 30 minutes

**Tasks:**
- [ ] Create `components/layout/Footer.tsx`
- [ ] Add social links:
  - GitHub
  - LinkedIn
  - Twitter
  - Instagram
  - Email
- [ ] Add hover effect: Icon scale + color change
- [ ] Add copyright text

**Deliverable:** Footer with social links

---

### Step 2.9: Create Header Component

**Estimated Time:** 1 hour

**Tasks:**
- [ ] Create `components/layout/Header.tsx`
- [ ] Add navigation links:
  - Home (/)
  - Portfolio (/portfolio)
  - Blog (/blog)
  - Contact (/#contact)
- [ ] Add logo or name
- [ ] Add mobile hamburger menu
- [ ] Add smooth scroll to sections
- [ ] Add sticky header (visible on scroll)
- [ ] Style with ocean palette

**Deliverable:** Responsive header with navigation

---

### Step 2.10: Assemble Landing Page

**Estimated Time:** 1 hour

**Tasks:**
- [ ] Update `app/(public)/page.tsx`:
  - Add Hero section
  - Add About section
  - Add Portfolio section
  - Add Services section
  - Add Testimonials section
  - Add Blog preview section
  - Add Contact section
  - Add Footer
- [ ] Ensure smooth scroll behavior between sections
- [ ] Test all sections render correctly
- [ ] Test animations on scroll
- [ ] Responsive test (mobile, tablet, desktop)

**Deliverable:** Complete landing page with all sections

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

### Step 3.5: Create Portfolio Management Page

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `app/(admin)/portfolios/page.tsx`:
  - Add "Add New Portfolio" button
  - Fetch portfolios from API
  - Display portfolios in table or grid
  - Each portfolio item:
    - Edit button
    - Delete button (with confirmation modal)
    - Toggle publish button
- [ ] Add search/filter (optional)
- [ ] Add loading state
- [ ] Test create, edit, delete, toggle publish workflows

**Deliverable:** Portfolio management page

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

## 📰 Phase 4: Public Blog Pages (Week 3)

### Step 4.1: Create Blog Listing Page

**Estimated Time:** 1.5 hours

**Tasks:**
- [ ] Create `app/(public)/blog/page.tsx`:
  - Fetch all published blog posts
  - Sort by `publishDate` DESC
  - Display in grid layout
  - Pagination (optional, infinite scroll)
- [ ] Add category filter chips (if categories used)
- [ ] Add search input (optional)
- [ ] Add "Load More" button (if pagination)
- [ ] Stagger reveal animation for cards
- [ ] Test loading & empty states

**Deliverable:** Blog listing page

---

### Step 4.2: Create Blog Detail Page

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `app/(public)/blog/[slug]/page.tsx`:
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
- [ ] Increment view count (if tracking enabled)
- [ ] Add page transitions (Framer Motion)
- [ ] Test 404 (invalid slug)

**Deliverable:** Blog post detail page

---

### Step 4.3: Implement Markdown Rendering

**Estimated Time:** 1 hour

**Tasks:**
- [ ] Install Markdown library:
  ```bash
  npm install react-markdown remark-gfm
  ```
- [ ] Create Markdown renderer component:
  ```typescript
  const MarkdownRenderer = ({ content }: { content: string }) => {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  }
  ```
- [ ] Test with code blocks, links, images
- [ ] Style Markdown content with Tailwind

**Deliverable:** Markdown rendering component

---

### Step 4.4: Add SEO Meta Tags

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `components/SEO.tsx`:
  - Accept title, description, OG image, URL
  - Render meta tags:
    ```html
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="twitter:card" content="summary_large_image" />
    ```
- [ ] Add SEO component to all pages:
  - Landing page (default settings)
  - Blog listing
  - Blog detail (post-specific)
- [ ] Test with Facebook debugger, Twitter card validator

**Deliverable:** SEO meta tags on all pages

---

### Step 4.5: Create Sitemap

**Estimated Time:** 1 hour

**Tasks:**
- [ ] Create `app/sitemap.ts` (Next.js 13+ supports this):
  ```typescript
  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await prisma.blogPost.findMany({ where: { published: true } })
    return [
      { url: 'https://yourdomain.com', lastModified: new Date() },
      { url: 'https://yourdomain.com/portfolio', lastModified: new Date() },
      { url: 'https://yourdomain.com/blog', lastModified: new Date() },
      ...posts.map(post => ({
        url: `https://yourdomain.com/blog/${post.slug}`,
        lastModified: post.publishDate,
      })),
    ]
  }
  ```
- [ ] Test sitemap at `/sitemap.xml`

**Deliverable:** XML sitemap for SEO

---

## 🎬 Phase 5: Animations & Polish (Week 4)

### Step 5.1: Optimize Animations

**Estimated Time:** 3 hours

**Tasks:**
- [ ] Review all animations with Chrome DevTools (Performance tab)
- [ ] Ensure 60fps on all animations
- [ ] Use `transform` and `opacity` (GPU-accelerated)
- [ ] Reduce JavaScript bundle size:
  - Code splitting for Framer Motion
  - Lazy load heavy components
- [ ] Test on mobile devices (lower performance)
- [ ] Add `will-change` CSS where appropriate

**Deliverable:** Optimized animations at 60fps

---

### Step 5.2: Add Loading States

**Estimated Time:** 1.5 hours

**Tasks:**
- [ ] Create `components/ui/Loading.tsx`:
  - Animated spinner or skeleton loader
  - Use ocean palette colors
- [ ] Add loading to:
  - Portfolio section (fetching)
  - Blog listing (fetching)
  - Admin pages (fetching)
- [ ] Add error states (404, 500)
- [ ] Test loading states

**Deliverable:** Loading spinners & error states

---

### Step 5.3: Responsive Testing & Fixes

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Test on mobile (375px width):
  - Hero section
  - Portfolio grid (1 column)
  - Navigation (hamburger menu)
  - Admin panel (sidebar hidden)
- [ ] Test on tablet (768px width):
  - Portfolio grid (2 columns)
  - Navigation (visible)
- [ ] Test on desktop (1920px width):
  - All grids (3 columns)
  - Full experience
- [ ] Fix responsive issues
- [ ] Test on Chrome, Firefox, Safari

**Deliverable:** Fully responsive design

---

### Step 5.4: Accessibility Testing

**Estimated Time:** 2 hours

**Tasks:**
- [ ] Run Lighthouse Accessibility audit
- [ ] Fix:
  - Missing alt text for images
  - Poor color contrast ratios
  - Missing ARIA labels
  - Keyboard navigation issues
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Achieve Lighthouse Accessibility score 90+

**Deliverable:** Accessible website (Lighthouse 90+)

---

### Step 5.5: Performance Optimization

**Estimated Time:** 2.5 hours

**Tasks:**
- [ ] Run Lighthouse Performance audit
- [ ] Fix:
  - Large images (optimize with Sharp)
  - Unused JavaScript
  - Render-blocking resources
  - Large bundle sizes
- [ ] Implement lazy loading for images:
  ```typescript
  import Image from 'next/image'
  <Image src={imageUrl} loading="lazy" />
  ```
- [ ] Enable Next.js Image Optimization
- [ ] Minimize CSS (Tailwind purging)
- [ ] Achieve Lighthouse Performance score 90+

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
