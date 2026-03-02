
📋 PRD - Portfolio & Blog Website

📋 Document Information

• Project Name: Company Portfolio Website
• Version: 1.0
• Created: 2025-02-24
• Status: Draft
• Author: Muhammad Ardhiansyah

───

🎯 Project Overview

Vision

Membangun website perusahaan profesional yang menampilkan portfolio, artikel/blog, dan dilengkapi admin panel untuk mengelola konten secara mandiri.

Mission

Menciptakan platform digital yang:

• Profesional & modern dengan animasi kontemporer
• Mudah dikelola melalui admin panel
• Showcase karya dan pemikiran (portfolio & blog)
• Mobile-friendly & performant

Goals

| Goal                     | Description                                    | Success Metric                             |
| ------------------------ | ---------------------------------------------- | ------------------------------------------ |
| Showcase Professionalism | Menampilkan portfolio dengan cara yang menarik | Portfolio section dengan animasi modern    |
| Content Management       | Mempermudah update konten tanpa coding         | Admin panel functional untuk semua content |
| SEO & Discoverability    | Blog & portfolio SEO-friendly                  | Meta tags, structured data, sitemap        |
| Mobile Experience        | Responsive di semua devices                    | Mobile-friendly, smooth animations         |

───

👥 Target Audience

Primary Audience

• Potential Clients: Mencari jasa development (web, mobile, UI/UX)
• Recruiters: Menilai skill & expertise
• Collaborators: Mencari partner untuk projects
• Blog Readers: Membaca artikel & insights teknis

Secondary Audience

• Personal Network: Colleagues, friends, family
• Community: Developer community, open-source contributors

───

🎨 Design & Branding

Color Palette

| Warna         | Hex     | Kegunaan                           |
| ------------- | ------- | ---------------------------------- |
| 🌊 Dark Navy  | #1D3557 | Background utama, hero section     |
| 💧 Steel Blue | #457B9D | Secondary backgrounds, cards       |
| 🌅 Coral Red  | #E63946 | Call-to-action buttons, highlights |
| 🏖️ Off-White | #F1FAEE | Text color, light backgrounds      |
| ☁️ Mist Blue  | #A8DADC | Borders, subtle accents            |

Design Principles

| Prinsip      | Deskripsi                                 |
| ------------ | ----------------------------------------- |
| Modern       | Animasi kontemporer, smooth transitions   |
| Clean        | Minimal clutter, clear hierarchy          |
| Creative     | Unique interactions, not generic template |
| Mobile-First | Responsive design, touch-friendly         |
| Performant   | Fast loading, smooth animations (60fps)   |

───

🚀 Tech Stack

Core Stack

| Component  | Technology                     | Version      | Why?                                                            |
| ---------- | ------------------------------ | ------------ | --------------------------------------------------------------- |
| Frontend   | Next.js (App Router)           | 16.1.6       | Modern SSR/SSG, API routes built-in, no separate backend needed |
| React      | React                          | 19.2.3       | Latest React with improved features                             |
| Database   | MySQL 8.0+                     | 8.0+         | Reliable, full-text search, JSON support                        |
| ORM        | Prisma                         | TBD          | Type-safe, migrations, excellent DX with TypeScript             |
| Styling    | Tailwind CSS v4                | v4           | New @theme-based config, utility-first CSS                      |
| Animations | Framer Motion                  | TBD          | Smooth animations, declarative API                              |
| Forms      | React Hook Form + Zod          | TBD          | Form validation, type-safe, great UX                            |
| Auth       | NextAuth.js (Auth.js)          | TBD          | Simple auth, session management                                 |
| Image Opt. | Sharp                          | TBD          | Server-side image optimization (resize, format conversion)      |
| Email      | Resend/SendGrid                | TBD          | Transactional emails (optional, for contact form)               |
| TypeScript | TypeScript                     | 5.x          | Type safety for better DX                                        |
| Linter     | ESLint                         | 9.x          | Code quality and consistency                                    |

Notes:
- **Tailwind CSS v4** uses `@theme` directive in CSS instead of `tailwind.config.ts`
- Custom colors defined in `app/globals.css` using CSS variables
- See `docs/best-practices/tailwind-v4.md` for v4-specific configuration

Deployment

| Component   | Technology              |
[02/03/2026 11:26] Jeremmy: | ----------- | ----------------------- |
| Hosting     | VPS (Ubuntu 24.04)      |
| Web Server  | Nginx (reverse proxy)   |
| SSL         | Let's Encrypt (Certbot) |
| Process Mgr | PM2                     |
| Database    | MySQL 8.0+ (on VPS)     |
| Backup      | Cron jobs + mysqldump   |

───

📊 Database Schema

Tables Overview

| Table         | Purpose                              |
| ------------- | ------------------------------------ |
| users         | Admin account (login)                |
| portfolios    | Portfolio items (projects)           |
| blog_posts    | Blog articles                        |
| page_sections | Landing page content sections        |
| site_settings | Global settings (SEO, contact, etc.) |

───

🎯 Features Overview

Public Pages

| Feature              | Priority | Description                              |
| -------------------- | -------- | ---------------------------------------- |
| Hero Section         | P0       | Animated hero with headline, CTA buttons |
| About Section        | P0       | Personal info, skills, social links      |
| Portfolio Section    | P0       | Grid of projects with animations         |
| Services Section     | P0       | Services offered with icons              |
| Testimonials Section | P1       | Client reviews (optional content)        |
| Blog Preview Section | P1       | Recent articles preview                  |
| Contact Section      | P1       | Contact form & info                      |
| Footer               | P1       | Social links, copyright                  |

Admin Panel

| Feature              | Priority | Description                                    |
| -------------------- | -------- | ---------------------------------------------- |
| Login/Logout         | P0       | Secure admin authentication                    |
| Dashboard            | P1       | Overview stats (portfolios, posts, views)      |
| Portfolio Management | P0       | CRUD portfolios (create, read, update, delete) |
| Blog Management      | P0       | CRUD blog posts, publish/draft, schedule       |
| Page Sections        | P1       | Edit landing page content (hero, about, etc.)  |
| Media Library        | P1       | Upload & manage images                         |
| Site Settings        | P1       | Global settings (SEO, contact, social)         |

Blog Features

| Feature          | Priority | Description                         |
| ---------------- | -------- | ----------------------------------- |
| Markdown Editor  | P0       | Write content in Markdown           |
| Rich Text Toggle | P1       | WYSIWYG option (optional)           |
| Categories       | P1       | Group articles by category          |
| Tags             | P2       | Multi-tags per post                 |
| Featured Image   | P1       | Thumbnail for listings              |
| SEO Metadata     | P1       | Custom title, description, OG image |
| Draft/Publish    | P0       | Save draft, publish later           |
| Schedule Publish | P2       | Auto-publish at specific date       |
| View Counter     | P2       | Track article views                 |

───

📱 User Personas

Persona 1: Visitor (Potential Client)

Goals:

• Explore portfolio to assess capabilities
• Read blog to gauge expertise
• Contact for project inquiry

Pain Points:

• Difficult to find relevant projects
• Blog not searchable or organized
• Contact form unclear or broken

Needs:

• Clear portfolio categorization
• Searchable blog
• Easy contact form

───

Persona 2: Admin (You)

Goals:

• Quickly add new portfolio items
• Publish blog posts with ease
• Update landing page content without coding

Pain Points:

• Manual HTML editing for content
• Slow image upload/optimization
• Hard to see draft vs published

Needs:

• Intuitive admin panel
• WYSIWYG or Markdown editor
• Media library for easy image management
• Draft/publish workflow

───

🎬 Animation Requirements

Types of Animations
[02/03/2026 11:26] Jeremmy: | Animation Type     | Component       | Description                                      |
| ------------------ | --------------- | ------------------------------------------------ |
| Scroll Reveal      | All sections    | Sections appear smoothly when scrolled into view |
| Stagger Effect     | Grid cards      | Cards appear one-by-one with delay               |
| Hover Effects      | Buttons, cards  | Scale, shadow, color transition on hover         |
| Text Animation     | Hero section    | Text reveal, typing effect                       |
| Page Transitions   | Navigation      | Smooth fade/slide between pages                  |
| Micro-interactions | Buttons, inputs | Feedback on click, focus, blur                   |

Performance Requirements

• Target 60fps for animations
• Avoid layout shift (CLS)
• Use transform and opacity (GPU-accelerated)
• Reduce JavaScript bundle size
• Lazy load images

───

🔒 Security Requirements

| Requirement              | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| Admin Authentication     | Only authenticated admin can access /admin            |
| Password Hashing         | bcrypt or argon2 for passwords                        |
| SQL Injection Prevention | Parameterized queries (Prisma handles this)           |
| XSS Prevention           | Sanitize user inputs, escape in HTML                  |
| CSRF Protection          | CSRF tokens for forms (NextAuth handles this)         |
| Rate Limiting            | Limit API requests (login attempts, form submissions) |
| HTTPS Only               | Force SSL on all routes                               |
| Secure Headers           | X-Frame-Options, CSP, etc.                            |

───

📈 Performance Requirements

| Metric                         | Target                   |
| ------------------------------ | ------------------------ |
| Lighthouse Performance         | 90+                      |
| First Contentful Paint (FCP)   | < 1.8s                   |
| Largest Contentful Paint (LCP) | < 2.5s                   |
| Time to Interactive (TTI)      | < 3.8s                   |
| Cumulative Layout Shift (CLS)  | < 0.1                    |
| Mobile Performance             | No jank on 3G connection |

───

🌐 SEO Requirements

| Requirement     | Description                                |
| --------------- | ------------------------------------------ |
| Meta Tags       | Title, description, keywords for all pages |
| Open Graph      | OG tags for social sharing                 |
| Twitter Cards   | Twitter card meta tags                     |
| Structured Data | JSON-LD for Blog (Article)                 |
| Sitemap         | XML sitemap for search engines             |
| Robots.txt      | Crawl instructions                         |
| Canonical URLs  | Prevent duplicate content                  |
| Alt Text        | All images have descriptive alt text       |

───

✅ Success Criteria

Functional Requirements

• [ ] All landing page sections functional and animated
• [ ] Portfolio section displays projects with screenshots
• [ ] Blog listing and detail pages working
• [ ] Admin panel login/logout working
• [ ] Admin can create/edit/delete portfolios
• [ ] Admin can create/edit/delete blog posts
• [ ] Admin can edit landing page sections
• [ ] Contact form sends email (or logs submissions)

Non-Functional Requirements

• [ ] Mobile-responsive (375px - 1920px)
• [ ] Lighthouse Performance score 90+
• [ ] Lighthouse Accessibility score 90+
• [ ] Lighthouse Best Practices score 90+
• [ ] SSL certificate installed
• [ ] Database backups automated
• [ ] Admin panel accessible only to authenticated user

───

🚫 Out of Scope

| Feature              | Status       | Reason                                       |
| -------------------- | ------------ | -------------------------------------------- |
[02/03/2026 11:26] Jeremmy: | Comments on Blog     | Out of Scope | Adds complexity, not in initial requirements |
| Search Functionality | Out of Scope | Can be added in future iteration             |
| User Registration    | Out of Scope | Only admin login needed                      |
| Multi-language       | Out of Scope | Single language (Indonesian/English) for now |
| Real-time Features   | Out of Scope | No WebSocket needed for v1.0                 |
| Analytics Dashboard  | Out of Scope | Use external tool (Google Analytics)         |

───

📅 Milestones

| Milestone           | Deadline | Deliverables                             |
| ------------------- | -------- | ---------------------------------------- |
| M1: Project Setup   | Week 1   | Next.js project, Prisma setup, DB schema |
| M2: Core Features   | Week 2   | Landing page, portfolio, admin auth      |
| M3: Admin Panel     | Week 3   | Portfolio & blog management              |
| M4: Blog Features   | Week 4   | Blog listing, detail pages, editor       |
| M5: Polish & Deploy | Week 5   | Animations, SEO, deployment              |

───

🔗 External Dependencies

| Service         | Purpose                         |
| --------------- | ------------------------------- |
| MySQL 8.0+      | Database                        |
| Let's Encrypt   | SSL certificates                |
| Nginx           | Reverse proxy                   |
| PM2             | Process management              |
| GitHub          | Code repository                 |
| Resend/SendGrid | Transactional emails (optional) |

───

📝 Changelog

| Date       | Version | Changes             |
| ---------- | ------- | ------------------- |
| 2025-02-24 | 1.0     | Initial PRD created |
