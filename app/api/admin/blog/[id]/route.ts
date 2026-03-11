import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { updateBlogSchema } from '@/lib/validations/blog';
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
// GET /api/admin/blog/[id] - Get a single blog post
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

    const post = await prisma.post.findUnique({
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

    if (!post) {
      return apiNotFound('Blog post not found');
    }

    return apiSuccess(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return apiError('Failed to fetch blog post', 500);
  }
}

// ============================================================================
// PUT /api/admin/blog/[id] - Update a blog post
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

    // Check if post exists
    const existing = await prisma.post.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiNotFound('Blog post not found');
    }

    const body = await request.json();

    // Validate with Zod (partial)
    const validated = updateBlogSchema.parse(body);

    // Check for duplicate slug if slug is being changed
    if (validated.slug && validated.slug !== existing.slug) {
      const duplicate = await prisma.post.findUnique({
        where: { slug: validated.slug },
      });

      if (duplicate) {
        return apiError('A post with this slug already exists', 409);
      }
    }

    // Build update data object
    const updateData: Record<string, any> = {};
    const allowedFields = [
      'title', 'slug', 'excerpt', 'content', 'coverImage',
      'status', 'categoryId', 'scheduledAt',
      'metaTitle', 'metaDescription', 'ogImage'
    ];

    for (const field of allowedFields) {
      if (validated[field as keyof typeof validated] !== undefined) {
        updateData[field] = validated[field as keyof typeof validated];
      }
    }

    // Handle publishedAt when status changes to PUBLISHED
    if (validated.status === 'PUBLISHED' && existing.status !== 'PUBLISHED' && !validated.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (validated.publishedAt !== undefined) {
      updateData.publishedAt = validated.publishedAt;
    }

    // Handle tags update
    if (validated.tagIds !== undefined) {
      // Disconnect all existing tags
      await prisma.postTag.deleteMany({
        where: { postId: id },
      });

      // Connect new tags if provided
      if (validated.tagIds.length > 0) {
        await prisma.postTag.createMany({
          data: validated.tagIds.map((tagId) => ({
            postId: id,
            tagId,
          })),
        });
      }
    }

    // Update post
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

    return apiSuccess(post, 'Blog post updated successfully');
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof (await import('zod')).ZodError) {
      return apiValidationError(error);
    }

    console.error('Error updating blog post:', error);
    return apiError('Failed to update blog post', 500);
  }
}

// ============================================================================
// DELETE /api/admin/blog/[id] - Delete a blog post
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

    // Check if post exists
    const existing = await prisma.post.findUnique({
      where: { id },
    });

    if (!existing) {
      return apiNotFound('Blog post not found');
    }

    // Delete post (PostTag will be cascade deleted)
    await prisma.post.delete({
      where: { id },
    });

    return apiSuccess({ id }, 'Blog post deleted successfully');
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return apiError('Failed to delete blog post', 500);
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
