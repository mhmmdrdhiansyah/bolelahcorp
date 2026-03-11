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
// GET /api/admin/messages - Get all contact submissions
// ============================================================================

export async function GET(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const { prisma } = await import('@/lib/prisma');

    // Build where clause
    const where: Record<string, any> = {};
    if (unreadOnly) {
      where.read = false;
    }

    const [messages, total, unreadCount] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        skip: offset,
        take: Math.min(limit, 100),
        orderBy: [{ createdAt: 'desc' }],
      }),
      prisma.contactSubmission.count({ where }),
      prisma.contactSubmission.count({ where: { read: false } }),
    ]);

    return apiSuccess({
      messages,
      total,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return apiError('Failed to fetch messages', 500);
  }
}

// ============================================================================
// OPTIONS Handler - CORS Preflight
// ============================================================================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'GET, OPTIONS',
    },
  });
}
