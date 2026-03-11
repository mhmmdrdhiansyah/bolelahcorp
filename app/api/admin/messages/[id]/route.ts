import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from '@/lib/api-utils';
import { z } from 'zod';

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
// Validation Schema
// ============================================================================

const updateMessageSchema = z.object({
  read: z.boolean().optional(),
  replied: z.boolean().optional(),
});

// ============================================================================
// PATCH /api/admin/messages/[id] - Update message (mark as read/replied)
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validated = updateMessageSchema.parse(body);

    const { prisma } = await import('@/lib/prisma');

    // Check if message exists
    const existing = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiNotFound('Message not found');
    }

    // Update message
    const message = await prisma.contactSubmission.update({
      where: { id },
      data: {
        ...(validated.read !== undefined && { read: validated.read }),
        ...(validated.replied !== undefined && { replied: validated.replied }),
      },
    });

    return apiSuccess(message, 'Message updated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid request data', 400);
    }

    console.error('Error updating message:', error);
    return apiError('Failed to update message', 500);
  }
}

// ============================================================================
// DELETE /api/admin/messages/[id] - Delete a message
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

    // Check if message exists
    const existing = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiNotFound('Message not found');
    }

    // Delete message
    await prisma.contactSubmission.delete({
      where: { id },
    });

    return apiSuccess({ id }, 'Message deleted successfully');
  } catch (error) {
    console.error('Error deleting message:', error);
    return apiError('Failed to delete message', 500);
  }
}

// ============================================================================
// OPTIONS Handler - CORS Preflight
// ============================================================================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'PATCH, DELETE, OPTIONS',
    },
  });
}
