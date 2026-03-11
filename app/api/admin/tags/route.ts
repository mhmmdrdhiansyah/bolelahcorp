import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api-utils';

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
// GET /api/admin/tags - Get all tags
// ============================================================================

export async function GET(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const { prisma } = await import('@/lib/prisma');

    const where = search
      ? { name: { contains: search } }
      : {};

    const tags = await prisma.tag.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { postTags: true },
        },
      },
    });

    return apiSuccess(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return apiError('Failed to fetch tags', 500);
  }
}

// ============================================================================
// POST /api/admin/tags - Create a new tag
// ============================================================================

export async function POST(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return apiError('Name must be at least 2 characters', 400);
    }

    // Generate slug if not provided
    const tagSlug = slug || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const { prisma } = await import('@/lib/prisma');

    // Check for duplicate slug
    const existing = await prisma.tag.findUnique({
      where: { slug: tagSlug },
    });

    if (existing) {
      return apiError('A tag with this slug already exists', 409);
    }

    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        slug: tagSlug,
      },
    });

    return apiSuccess(tag, 'Tag created successfully', 201);
  } catch (error) {
    console.error('Error creating tag:', error);
    return apiError('Failed to create tag', 500);
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
