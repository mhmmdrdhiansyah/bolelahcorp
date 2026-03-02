# Prisma Best Practices

## Schema Design

### 1. Schema Organization

```prisma
// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
  // Binary target for production deployment
  binaryTargets   = ["native", "linux-musl-openssl-3.0.x"]
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// === Base Models ===

enum Role {
  ADMIN
  USER
}

enum PostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
}

// === User Model ===
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // Hashed password
  image     String?
  role      Role     @default(USER)
  bio       String?  @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts     Post[]
  portfolios Portfolio[]

  @@index([email])
  @@map("users")
}

// === Post Model ===
model Post {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  excerpt     String?    @db.Text
  content     String     @db.Text
  coverImage  String?
  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  scheduledAt DateTime?

  // SEO
  metaTitle       String?
  metaDescription String?    @db.Text
  ogImage         String?

  // Stats
  views Int @default(0)

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  tags      Tag[]
  postTags  PostTag[]

  @@index([status, publishedAt])
  @@index([slug])
  @@index([authorId])
  @@index([categoryId])
  @@map("blog_posts")
}

// === Category Model ===
model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  posts Post[]

  @@index([slug])
  @@map("categories")
}

// === Tag Model ===
model Tag {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique

  posts     Post[]    @relation("TagPosts")
  postTags  PostTag[] @relation("TagPosts")

  @@index([slug])
  @@map("tags")
}

// === PostTag Junction Table ===
model PostTag {
  postId String
  tagId  String

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@index([postId])
  @@index([tagId])
  @@map("post_tags")
}

// === Portfolio Model ===
model Portfolio {
  id           String   @id @default(cuid())
  title        String
  slug         String   @unique
  description  String   @db.Text
  shortDesc    String?  @db.Text
  coverImage   String
  images       Json     // Array of image URLs
  technologies Json     // Array of tech stack names
  projectUrl   String?
  githubUrl    String?
  featured     Boolean  @default(false)
  order        Int      @default(0)
  completedAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // SEO
  metaTitle       String?
  metaDescription String?  @db.Text

  // Relations
  authorId String
  author   User    @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([featured, order])
  @@index([slug])
  @@index([authorId])
  @@map("portfolios")
}

// === PageSection Model ===
model PageSection {
  id        String   @id @default(cuid())
  page      String   // 'home', 'about', 'contact'
  section   String   // 'hero', 'about', 'services'
  title     String
  content   Json     // Flexible content structure
  enabled   Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([page, section])
  @@index([page, enabled])
  @@map("page_sections")
}

// === SiteSettings Model ===
model SiteSettings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  updatedAt DateTime @updatedAt

  @@index([key])
  @@map("site_settings")
}

// === ContactSubmission Model ===
model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String   @db.Text
  read      Boolean  @default(false)
  replied   Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([read, createdAt])
  @@map("contact_submissions")
}
```

## Best Practices

### 1. Always Use Transactions for Multi-Step Operations

```ts
// ✅ Good - Using transaction
import { prisma } from '@/lib/db'

async function createPostWithTag(data: CreatePostInput) {
  return await prisma.$transaction(async (tx) => {
    // Create post
    const post = await tx.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        authorId: data.authorId
      }
    })

    // Create or connect tags
    if (data.tags?.length) {
      for (const tagName of data.tags) {
        const tag = await tx.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName, slug: slugify(tagName) }
        })

        await tx.postTag.create({
          data: { postId: post.id, tagId: tag.id }
        })
      }
    }

    return post
  })
}

// ❌ Bad - No transaction (data inconsistency risk)
async function createPostWithTag(data: CreatePostInput) {
  const post = await prisma.post.create({ /* ... */ })

  // If this fails, post is created but tags aren't
  for (const tagName of data.tags || []) {
    await prisma.postTag.create({ /* ... */ })
  }

  return post
}
```

### 2. Use Select for Partial Data

```ts
// ✅ Good - Only select needed fields
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    coverImage: true,
    publishedAt: true,
    author: {
      select: {
        id: true,
        name: true,
        image: true
      }
    }
  },
  where: { status: 'PUBLISHED' },
  orderBy: { publishedAt: 'desc' },
  take: 10
})

// ❌ Bad - Selects all fields (including large content)
const posts = await prisma.post.findMany({
  where: { status: 'PUBLISHED' }
})
```

### 3. Pagination

```ts
// ✅ Good - Cursor-based pagination (for infinite scroll)
async function getPosts(cursor?: string) {
  return await prisma.post.findMany({
    take: 10,
    ...(cursor && {
      skip: 1, // Skip the cursor itself
      cursor: { id: cursor }
    }),
    orderBy: { publishedAt: 'desc' }
  })
}

// ✅ Good - Offset-based pagination (for traditional pagination)
async function getPosts(page: number, perPage: number) {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { publishedAt: 'desc' }
    }),
    prisma.post.count()
  ])

  return { posts, total, pages: Math.ceil(total / perPage) }
}
```

### 4. Proper Indexing

```prisma
// ✅ Good - Indexes for common queries
model Post {
  // Single column index
  @@index([slug])

  // Composite index for status + publishedAt queries
  @@index([status, publishedAt])

  // Composite index for filtering + sorting
  @@index([authorId, publishedAt])
}

// ❌ Bad - No indexes (slow queries)
model Post {
  // No indexes - queries will be slow on large datasets
}
```

### 5. Soft Deletes

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  deletedAt DateTime? // Soft delete timestamp

  @@index([deletedAt]) // Important for filtering
}
```

```ts
// Query excluding soft-deleted records
const posts = await prisma.post.findMany({
  where: { deletedAt: null }
})

// Soft delete
await prisma.post.update({
  where: { id },
  data: { deletedAt: new Date() }
})
```

### 6. Connection Pooling

```ts
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
    errorFormat: 'minimal'
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// For production, configure pool via DATABASE_URL:
// DATABASE_URL="mysql://user:pass@host:3306/db?connection_limit=10&pool_timeout=20"
```

### 7. Use Enums for Fixed Values

```prisma
// ✅ Good - Using enum
enum PostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
}

model Post {
  status PostStatus @default(DRAFT)
}

// ❌ Bad - Using string
model Post {
  status String @default("draft") // Prone to typos
}
```

### 8. JSON Field Usage

```ts
// ✅ Good - Storing array as JSON
const portfolio = await prisma.portfolio.create({
  data: {
    title: 'My Project',
    technologies: ['Next.js', 'Prisma', 'Tailwind'], // Stored as JSON
    images: [
      { url: '/img1.jpg', caption: 'Homepage' },
      { url: '/img2.jpg', caption: 'Dashboard' }
    ]
  }
})

// Querying JSON fields (MySQL 8.0+)
const results = await prisma.$queryRaw`
  SELECT * FROM portfolios
  WHERE JSON_CONTAINS(technologies, '"Next.js"')
`
```

### 9. Validation at Database Level

```prisma
model User {
  email    String  @unique
  password String  @db.VarChar(255) // Hash should fit

  @@index([email])
}

model Post {
  title   String @db.VarChar(255)
  slug    String @unique @db.VarChar(255)
  content String @db.Text // For long content
}
```

### 10. Migration Best Practices

```bash
# Create migration
npx prisma migrate dev --name add_featured_to_portfolios

# Reset in development (WARNING: destroys data)
npx prisma migrate reset

# Deploy to production
npx prisma migrate deploy

# Generate client after schema changes
npx prisma generate

# Seed database
npx prisma db seed
```

## Query Optimization

### 1. Avoid N+1 Queries

```ts
// ✅ Good - Use include for relations
const posts = await prisma.post.findMany({
  include: {
    author: true,      // Single query with JOIN
    category: true,
    tags: {
      include: {
        tag: true
      }
    }
  }
})

// ❌ Bad - N+1 query problem
const posts = await prisma.post.findMany()
for (const post of posts) {
  post.author = await prisma.user.findUnique({ where: { id: post.authorId } })
}
```

### 2. Use Aggregate Functions

```ts
// ✅ Good - Single query for counts
const stats = await prisma.post.aggregate({
  _count: { id: true },
  where: { status: 'PUBLISHED' }
})

// ✅ Good - Group by
const postsByAuthor = await prisma.post.groupBy({
  by: ['authorId'],
  _count: { id: true },
  where: { status: 'PUBLISHED' }
})
```

### 3. Raw Queries When Needed

```ts
// Full-text search with Prisma
import { Prisma } from '@prisma/client'

const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: query } },
      { content: { contains: query } },
      { excerpt: { contains: query } }
    ]
  }
})

// Or with raw query (better for full-text)
const posts = await prisma.$queryRaw`
  SELECT * FROM blog_posts
  WHERE MATCH(title, content) AGAINST(${query} IN NATURAL LANGUAGE MODE)
  AND status = 'PUBLISHED'
  LIMIT 20
`
```

## Seeding

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('your-secure-password', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bolelahcorp.com' },
    update: {},
    create: {
      email: 'admin@bolelahcorp.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: { name: 'Web Development', slug: 'web-development' }
    }),
    prisma.category.upsert({
      where: { slug: 'mobile-development' },
      update: {},
      create: { name: 'Mobile Development', slug: 'mobile-development' }
    })
  ])

  // Create sample posts
  await prisma.post.create({
    data: {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      excerpt: 'Learn the fundamentals of Next.js 14 App Router',
      content: '# Getting Started\n\n...',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[0].id
    }
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

```json
// package.json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## Environment Variables

```bash
# .env
DATABASE_URL="mysql://user:password@localhost:3306/bolelahcorp?schema=public&connection_limit=10&pool_timeout=20"

# For production with connection pooling
# DATABASE_URL="mysql://user:password@host:3306/dbname?connection_limit=10&pool_timeout=20&socket_timeout=5"
```

## Common Patterns

### 1. Repository Pattern

```ts
// lib/repositories/post.repository.ts
import { prisma } from '@/lib/db'
import type { Post, Prisma } from '@prisma/client'

export type PostWithRelations = Prisma.PostGetPayload<{
  include: { author: true; category: true; tags: { include: { tag: true } } }
}>

export class PostRepository {
  async findAll(params: {
    skip?: number
    take?: number
    status?: string
    categoryId?: string
  }) {
    const { skip = 0, take = 10, status, categoryId } = params

    const where: Prisma.PostWhereInput = {}
    if (status) where.status = status as any
    if (categoryId) where.categoryId = categoryId

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: { select: { id: true, name: true, slug: true } } } }
        },
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.post.count({ where })
    ])

    return { posts, total }
  }

  async findBySlug(slug: string) {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true, bio: true } },
        category: true,
        tags: { include: { tag: true } }
      }
    })
  }

  async incrementViews(id: string) {
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } }
    })
  }
}

export const postRepository = new PostRepository()
```

### 2. Slug Generation

```ts
// lib/utils.ts
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Ensure unique slug
export async function generateUniqueSlug(title: string, table: 'post' | 'portfolio') {
  const baseSlug = generateSlug(title)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const exists = await prisma[table].findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!exists) return slug

    slug = `${baseSlug}-${counter}`
    counter++
  }
}
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [MySQL Reference](https://dev.mysql.com/doc/refman/8.0/en/)
