import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized, apiValidationError } from '@/lib/api-utils';
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
// Validation Schema for Settings Update
// ============================================================================

const settingValueSchema = z.any();

const settingsUpdateSchema = z.object({
  settings: z.record(z.string(), settingValueSchema),
});

// ============================================================================
// GET /api/admin/settings - Get all site settings
// ============================================================================

export async function GET(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const { prisma } = await import('@/lib/prisma');

    // Build where clause (filter by key prefix if category provided)
    let where: Record<string, any> | undefined = undefined;

    if (category) {
      where = {
        key: {
          startsWith: `${category}.`,
        },
      };
    }

    const settings = await prisma.siteSetting.findMany({
      where,
      orderBy: {
        key: 'asc',
      },
    });

    // Convert array to key-value object
    const settingsObj: Record<string, any> = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });

    return apiSuccess(settingsObj);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return apiError('Failed to fetch site settings', 500);
  }
}

// ============================================================================
// PUT /api/admin/settings - Update site settings
// ============================================================================

export async function PUT(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    // Validate with Zod
    const validated = settingsUpdateSchema.parse(body);

    const { prisma } = await import('@/lib/prisma');

    // Process each setting
    const updatePromises = Object.entries(validated.settings).map(
      ([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
    );

    await Promise.all(updatePromises);

    // Return all settings after update
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });

    const settingsObj: Record<string, any> = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });

    return apiSuccess(settingsObj, 'Settings updated successfully');
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return apiValidationError(error);
    }

    console.error('Error updating site settings:', error);
    return apiError('Failed to update site settings', 500);
  }
}

// ============================================================================
// DELETE /api/admin/settings - Delete a setting
// ============================================================================

export async function DELETE(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return apiError('Setting key is required', 400);
  }

  try {
    const { prisma } = await import('@/lib/prisma');

    await prisma.siteSetting.delete({
      where: { key },
    });

    return apiSuccess({ key }, 'Setting deleted successfully');
  } catch (error) {
    // Ignore not found errors
    if (error instanceof Error && error.message.includes('Record to delete not found')) {
      return apiSuccess({ key }, 'Setting already removed');
    }

    console.error('Error deleting site setting:', error);
    return apiError('Failed to delete site setting', 500);
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
