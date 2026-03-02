# Next.js Best Practices

## Project Structure

```
bolelahcorp/
├── app/                    # App Router (Next.js 14+)
│   ├── (auth)/            # Route groups (auth routes)
│   │   └── login/
│   ├── (main)/            # Main public routes
│   │   ├── about/
│   │   ├── blog/
│   │   ├── portfolio/
│   │   └── page.tsx       # Landing page
│   ├── admin/             # Protected admin routes
│   │   ├── layout.tsx     # Admin layout wrapper
│   │   ├── portfolios/
│   │   └── posts/
│   ├── api/               # API Routes
│   │   ├── auth/
│   │   └── webhooks/
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions
│   ├── db.ts             # Database client
│   ├── auth.ts           # Auth utilities
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma
├── public/               # Static assets
│   └── images/
├── styles/               # Global styles
├── types/                # TypeScript types
└── middleware.ts         # Next.js middleware
```

## App Router Best Practices

### 1. Use Server Components by Default

```tsx
// ✅ Good - Server Component (default)
export default function BlogList() {
  const posts = await prisma.post.findMany() // Direct DB access
  return <div>{/* ... */}</div>
}

// ❌ Bad - Unnecessary Client Component
'use client'
export default function BlogList() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts)
  }, [])
  return <div>{/* ... */}</div>
}
```

### 2. Client Components Only When Needed

```tsx
// ✅ Good - Extract only interactive part to Client Component
import { PostForm } from '@/components/forms/post-form'

export default function NewPostPage() {
  return (
    <div>
      <h1>Create Post</h1>
      <PostForm /> {/* Only this is client component */}
    </div>
  )
}

// ❌ Bad - Entire page as Client Component
'use client'
export default function NewPostPage() {
  return <div><h1>Create Post</h1><form>{/* ... */}</form></div>
}
```

### 3. Proper File Naming

```
app/
├── blog/
│   ├── page.tsx           # /blog
│   ├── [slug]/            # Dynamic route
│   │   └── page.tsx       # /blog/my-post
│   ├── page.tsx           # /blog (pagination)
│   └── layout.tsx         # Layout for all blog routes
```

### 4. Loading & Error States

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <div>Loading posts...</div>
}

// app/blog/error.tsx
'use client'
export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Data Fetching

### 1. Server Components (Preferred)

```tsx
// ✅ Good - Direct DB access in Server Component
import { prisma } from '@/lib/db'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, slug: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      {posts.map(post => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      ))}
    </div>
  )
}
```

### 2. Force Dynamic Data

```tsx
// Force fresh data on every request
export const dynamic = 'force-dynamic'

// Or set revalidation time
export const revalidate = 60 // seconds
```

### 3. Parallel Data Fetching

```tsx
// ✅ Good - Parallel fetching
const [posts, categories, featured] = await Promise.all([
  prisma.post.findMany(),
  prisma.category.findMany(),
  prisma.post.findFirst({ where: { featured: true } })
])

// ❌ Bad - Sequential fetching
const posts = await prisma.post.findMany()
const categories = await prisma.category.findMany()
const featured = await prisma.post.findFirst({ where: { featured: true } })
```

## Performance Optimization

### 1. Image Optimization

```tsx
// ✅ Good - Use next/image
import Image from 'next/image'

export function ProjectImage({ src, alt }: { src: string, alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      priority={false} // LCP images should be true
      placeholder="blur" // or "blurDataURL"
    />
  )
}
```

### 2. Font Optimization

```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

### 3. Dynamic Imports

```tsx
// ✅ Good - Lazy load heavy components
import dynamic from 'next/dynamic'

const AdminChart = dynamic(() => import('@/components/admin/chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false // For client-only components
})

export default function AdminDashboard() {
  return <AdminChart />
}
```

### 4. Route Segment Config

```tsx
// Static generation (default)
export const dynamic = 'force-static'

// Server-side rendering
export const dynamic = 'force-dynamic'

// Incremental Static Regeneration
export const revalidate = 3600 // 1 hour
```

## API Routes

### 1. Proper HTTP Methods

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const posts = await prisma.post.findMany()
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const post = await prisma.post.create({ data: body })
  return NextResponse.json(post, { status: 201 })
}
```

### 2. Route Handlers with Dynamic Params

```tsx
// app/api/posts/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id }
  })

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(post)
}
```

## Authentication

### 1. Middleware for Protected Routes

```ts
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const protectedPaths = ['/admin']
      return protectedPaths.some(path =>
        req.nextUrl.pathname.startsWith(path)
      ) ? !!token : true
    }
  }
})

export const config = {
  matcher: ['/admin/:path*']
}
```

### 2. Server Actions (Next.js 14+)

```tsx
// app/actions/posts.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function createPost(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  const post = await prisma.post.create({
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      authorId: session.user.id
    }
  })

  revalidatePath('/blog')
  revalidatePath('/admin/posts')

  return { success: true, post }
}
```

## Error Handling

### 1. Error Boundaries

```tsx
// app/blog/error.tsx
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Blog error:', error)
  }, [error])

  return (
    <div>
      <h2>Failed to load blog</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### 2. not-found.tsx

```tsx
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Page not found</h2>
      <Link href="/">Return home</Link>
    </div>
  )
}
```

## SEO Best Practices

### 1. Metadata API

```tsx
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bolehah Corp - Portfolio & Blog',
  description: 'Professional portfolio and tech blog',
  openGraph: {
    title: 'Bolehah Corp',
    description: 'Professional portfolio and tech blog',
    url: 'https://bolelahcorp.com',
    siteName: 'Bolehah Corp',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630
    }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bolehah Corp',
    description: 'Professional portfolio and tech blog',
    images: ['/og-image.png']
  }
}
```

### 2. Dynamic Metadata

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })

  return {
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: post?.coverImage ? [post.coverImage] : []
    }
  }
}
```

### 3. Structured Data

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: { '@type': 'Person', name: post.author.name },
    datePublished: post.createdAt
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>{/* ... */}</article>
    </>
  )
}
```

## Styling Best Practices

### 1. Tailwind CSS + CSS Variables

```tsx
// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-navy: #1D3557;
    --color-steel: #457B9D;
    --color-coral: #E63946;
    --color-off-white: #F1FAEE;
    --color-mist: #A8DADC;
  }
}

// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        navy: 'var(--color-navy)',
        steel: 'var(--color-steel)',
        coral: 'var(--color-coral)',
        'off-white': 'var(--color-off-white)',
        mist: 'var(--color-mist)'
      }
    }
  }
}
```

### 2. CSS Modules for Complex Components

```tsx
// components/portfolio/portfolio-card.module.css
.card {
  @apply rounded-lg overflow-hidden shadow-lg transition-transform;
}

.card:hover {
  @apply scale-105 shadow-xl;
}

// components/portfolio/portfolio-card.tsx
import styles from './portfolio-card.module.css'

export function PortfolioCard({ project }: { project: Project }) {
  return <div className={styles.card}>{/* ... */}</div>
}
```

## TypeScript Best Practices

### 1. Type Definitions

```ts
// types/index.ts
export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: 'admin' | 'user'
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  author: User
}

export interface Portfolio {
  id: string
  title: string
  description: string
  imageUrl: string
  technologies: string[]
  projectUrl: string | null
  githubUrl: string | null
  featured: boolean
  order: number
}
```

### 2. Prisma Type Generation

```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Types are auto-generated by Prisma
import type { Post, User, Portfolio } from '@prisma/client'
```

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Enable database connection pooling
- [ ] Configure CORS for API routes
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (GA, Plausible)
- [ ] Set up CDN for static assets
- [ ] Enable compression (gzip/brotli)
- [ ] Configure caching headers
- [ ] Set up monitoring (uptime, logs)
- [ ] Run `prisma generate` before build
- [ ] Use `next build` for production build

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)
- [App Router Migration](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
