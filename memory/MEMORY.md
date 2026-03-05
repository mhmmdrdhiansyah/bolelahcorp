# 📋 MEMORY.md - Ringkasan

## Current Status
- Phase: 2.5 - Landing Page Redesign
- Last Completed: Phase 2 Assembly
- Next Step: Redesign Hero Section (Phase 2.5)

## Project Context
- Tech Stack: Next.js 14, Prisma, MySQL, Tailwind CSS, Framer Motion
- Route Groups: (main) untuk public, (admin) untuk admin
- Database: MySQL dengan Prisma ORM
- Styling: Tailwind dengan ocean palette (navy, steel, coral, off-white, mist)

## Critical Rules
1. Root Layout: app/layout.tsx adalah SATU-SATUNYA tempat dengan tag <html> dan <body>
2. Route Groups: Gunakan (main) BUKAN (public)
3. Components: Server Components secara default, 'use client' hanya jika perlu
4. Ocean Palette Colors:
  - Navy: #1D3557 (background)
  - Steel: #457B9D (cards)
  - Coral: #E63946 (accents)
  - Mist: #A8DADC (borders, subtle text)
  - Off-white: #F1FAEE (text)

## 🔑 Login Credentials (untuk Admin)
Email: admin@bolelahcorp.com
Password: admin123

## 📊 Database Schema Summary
Tabel-tabel utama:
- users - Admin accounts
- portfolios - Portfolio projects
- posts - Blog posts
- categories - Blog categories
- tags - Blog tags
- page_sections - CMS content
- contact_submissions - Contact form submissions
- site_settings - Global settings
