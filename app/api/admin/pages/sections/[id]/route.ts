import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { updatePageSectionSchema } from '@/lib/validations/pageSection';
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
// GET /api/admin/pages/sections/[id] - Get a single page section
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

    const section = await prisma.pageSection.findUnique({
      where: { id },
    });

    if (!section) {
      return apiNotFound('Page section not found');
    }

    return apiSuccess(section);
  } catch (error) {
    console.error('Error fetching page section:', error);
    return apiError('Failed to fetch page section', 500);
  }
}

// ============================================================================
// PUT /api/admin/pages/sections/[id] - Update a page section
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const { prisma } = await import('@/lib/prisma');

    // Check if section exists
    const existing = await prisma.pageSection.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiNotFound('Page section not found');
    }

    const body = await request.json();

    // Validate with Zod (partial)
    const validated = updatePageSectionSchema.parse(body);

    // Check for duplicate page+section if changing
    if ((validated.page && validated.page !== existing.page) ||
        (validated.section && validated.section !== existing.section)) {
      const duplicate = await prisma.pageSection.findUnique({
        where: {
          page_section: {
            page: validated.page ?? existing.page,
            section: validated.section ?? existing.section,
          },
        },
      });

      if (duplicate && duplicate.id !== id) {
        return apiError('A section with this page and section name already exists', 409);
      }
    }

    // Build update data object
    const updateData: Record<string, any> = {};
    const allowedFields = [
      'page', 'section', 'title', 'content', 'enabled', 'order'
    ];

    for (const field of allowedFields) {
      if (validated[field as keyof typeof validated] !== undefined) {
        updateData[field] = validated[field as keyof typeof validated];
      }
    }

    // Update section
    const section = await prisma.pageSection.update({
      where: { id },
      data: updateData,
    });

    return apiSuccess(section, 'Page section updated successfully');
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof (await import('zod')).ZodError) {
      return apiValidationError(error);
    }

    console.error('Error updating page section:', error);
    return apiError('Failed to update page section', 500);
  }
}

// ============================================================================
// DELETE /api/admin/pages/sections/[id] - Delete a page section
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

    // Check if section exists
    const existing = await prisma.pageSection.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiNotFound('Page section not found');
    }

    // Delete section
    await prisma.pageSection.delete({
      where: { id },
    });

    return apiSuccess({ id }, 'Page section deleted successfully');
  } catch (error) {
    console.error('Error deleting page section:', error);
    return apiError('Failed to delete page section', 500);
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
