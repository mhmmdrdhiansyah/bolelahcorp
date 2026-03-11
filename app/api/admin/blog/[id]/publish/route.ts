import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from '@/lib/api-utils';

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
// POST /api/admin/blog/[id]/publish - Toggle publish status
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const { prisma } = await import('@/lib/prisma');

    // Check if post exists
    const existing = await prisma.post.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiNotFound('Blog post not found');
    }

    // Toggle between DRAFT and PUBLISHED
    const newStatus = existing.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

    // Set/clear publishedAt based on new status
    const updateData: Record<string, any> = {
      status: newStatus,
    };

    if (newStatus === 'PUBLISHED' && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (newStatus === 'DRAFT') {
      // Keep publishedAt when going back to draft
    }

    const post = await prisma.post.update({
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

    return apiSuccess(
      post,
      newStatus === 'PUBLISHED' ? 'Blog post published successfully' : 'Blog post unpublished successfully'
    );
  } catch (error) {
    console.error('Error toggling publish status:', error);
    return apiError('Failed to toggle publish status', 500);
  }
}

// ============================================================================
// OPTIONS Handler - CORS Preflight
// ============================================================================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  });
}
