import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createBlogSchema } from '@/lib/validations/blog';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError, apiConflict } from '@/lib/api-utils';

// ============================================================================
// Auth Check Helper
// ============================================================================

async function checkAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return apiUnauthorized('Not authenticated');
  }

  if (session.user?.role !== 'ADMIN') {
    return apiUnauthorized('Admin access required');
  }

  return null;
}

// ============================================================================
// GET /api/admin/blog - Get all blog posts
// ============================================================================

export async function GET(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    const { prisma } = await import('@/lib/prisma');

    // Build where clause
    const where: Record<string, any> = {};

    if (status === 'DRAFT' || status === 'PUBLISHED' || status === 'SCHEDULED') {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip: offset,
        take: Math.min(limit, 100),
        orderBy: [{ createdAt: 'desc' }],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          postTags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return apiSuccess(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return apiError('Failed to fetch blog posts', 500);
  }
}

// ============================================================================
// POST /api/admin/blog - Create a new blog post
// ============================================================================

export async function POST(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    // Validate with Zod
    const validated = createBlogSchema.parse(body);

    const { prisma } = await import('@/lib/prisma');
    const session = await getServerSession(authOptions);

    // Check for duplicate slug
    const existing = await prisma.post.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return apiConflict('A post with this slug already exists');
    }

    // Auto-set publishedAt if status is PUBLISHED and not set
    let publishedAt = validated.publishedAt;
    if (validated.status === 'PUBLISHED' && !publishedAt) {
      publishedAt = new Date();
    }

    // Create post with tags
    const post = await prisma.post.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt || null,
        content: validated.content,
        coverImage: validated.coverImage || null,
        status: validated.status,
        categoryId: validated.categoryId || null,
        publishedAt,
        scheduledAt: validated.scheduledAt,
        metaTitle: validated.metaTitle || null,
        metaDescription: validated.metaDescription || null,
        ogImage: validated.ogImage || null,
        authorId: (session?.user as any)?.id || '',
        postTags: validated.tagIds && validated.tagIds.length > 0
          ? {
              create: validated.tagIds.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        postTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return apiSuccess(post, 'Blog post created successfully', 201);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof (await import('zod')).ZodError) {
      return apiValidationError(error);
    }

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return apiConflict('A post with this slug already exists');
    }

    console.error('Error creating blog post:', error);
    return apiError('Failed to create blog post', 500);
  }
}

// ============================================================================
// OPTIONS Handler - CORS Preflight
// ============================================================================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}
