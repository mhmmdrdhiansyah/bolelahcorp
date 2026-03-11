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
// GET /api/admin/categories - Get all categories
// ============================================================================

export async function GET(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { prisma } = await import('@/lib/prisma');

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return apiSuccess(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return apiError('Failed to fetch categories', 500);
  }
}

// ============================================================================
// POST /api/admin/categories - Create a new category
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
    const categorySlug = slug || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const { prisma } = await import('@/lib/prisma');

    // Check for duplicate slug
    const existing = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existing) {
      return apiError('A category with this slug already exists', 409);
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: categorySlug,
      },
    });

    return apiSuccess(category, 'Category created successfully', 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return apiError('Failed to create category', 500);
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
