import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { updatePortfolioSchema } from '@/lib/validations/portfolio';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError, apiNotFound } from '@/lib/api-utils';

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
// GET /api/admin/portfolios/[id] - Get a single portfolio
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const { prisma } = await import('@/lib/prisma');

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!portfolio) {
      return apiNotFound('Portfolio not found');
    }

    return apiSuccess(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return apiError('Failed to fetch portfolio', 500);
  }
}

// ============================================================================
// PUT /api/admin/portfolios/[id] - Update a portfolio
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    // Check if portfolio exists
    const { prisma } = await import('@/lib/prisma');

    const existing = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiNotFound('Portfolio not found');
    }

    const body = await request.json();

    // Validate with Zod (partial)
    const validated = updatePortfolioSchema.parse(body);

    // Check for duplicate slug if slug is being changed
    if (validated.slug && validated.slug !== existing.slug) {
      const duplicate = await prisma.portfolio.findUnique({
        where: { slug: validated.slug },
      });

      if (duplicate) {
        return apiError('A portfolio with this slug already exists', 409);
      }
    }

    // Build update data object (only include defined fields)
    const updateData: Record<string, any> = {};
    const allowedFields = [
      'title', 'slug', 'description', 'shortDesc', 'coverImage',
      'images', 'technologies', 'projectUrl', 'githubUrl',
      'featured', 'order', 'completedAt', 'metaTitle', 'metaDescription'
    ];

    for (const field of allowedFields) {
      if (validated[field as keyof typeof validated] !== undefined) {
        updateData[field] = validated[field as keyof typeof validated];
      }
    }

    // Handle null for optional URL fields
    if (validated.projectUrl === '') updateData.projectUrl = null;
    if (validated.githubUrl === '') updateData.githubUrl = null;

    // Update portfolio
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return apiSuccess(portfolio, 'Portfolio updated successfully');
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof (await import('zod')).ZodError) {
      return apiValidationError(error);
    }

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return apiError('A portfolio with this slug already exists', 409);
    }

    console.error('Error updating portfolio:', error);
    return apiError('Failed to update portfolio', 500);
  }
}

// ============================================================================
// DELETE /api/admin/portfolios/[id] - Delete a portfolio
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const { prisma } = await import('@/lib/prisma');

    // Check if portfolio exists
    const existing = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiNotFound('Portfolio not found');
    }

    // Delete portfolio (cascade delete is handled by Prisma)
    await prisma.portfolio.delete({
      where: { id },
    });

    return apiSuccess({ id }, 'Portfolio deleted successfully');
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return apiError('Failed to delete portfolio', 500);
  }
}

// ============================================================================
// OPTIONS Handler - CORS Preflight
// ============================================================================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'GET, PUT, DELETE, OPTIONS',
    },
  });
}
