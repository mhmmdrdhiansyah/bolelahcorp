import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createPageSectionSchema } from '@/lib/validations/pageSection';
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
// GET /api/admin/pages/sections - Get all page sections
// ============================================================================

export async function GET(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const enabled = searchParams.get('enabled');

    const { prisma } = await import('@/lib/prisma');

    // Build where clause
    const where: Record<string, any> = {};

    if (page) {
      where.page = page;
    }

    if (enabled === 'true') {
      where.enabled = true;
    } else if (enabled === 'false') {
      where.enabled = false;
    }

    const sections = await prisma.pageSection.findMany({
      where,
      orderBy: [
        { page: 'asc' },
        { order: 'asc' },
      ],
    });

    return apiSuccess(sections);
  } catch (error) {
    console.error('Error fetching page sections:', error);
    return apiError('Failed to fetch page sections', 500);
  }
}

// ============================================================================
// POST /api/admin/pages/sections - Create a new page section
// ============================================================================

export async function POST(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    // Validate with Zod
    const validated = createPageSectionSchema.parse(body);

    const { prisma } = await import('@/lib/prisma');

    // Check for duplicate page+section combination
    const existing = await prisma.pageSection.findUnique({
      where: {
        page_section: {
          page: validated.page,
          section: validated.section,
        },
      },
    });

    if (existing) {
      return apiConflict('A section with this page and section name already exists');
    }

    // Create page section
    const section = await prisma.pageSection.create({
      data: {
        page: validated.page,
        section: validated.section,
        title: validated.title,
        content: validated.content,
        enabled: validated.enabled ?? true,
        order: validated.order ?? 0,
      },
    });

    return apiSuccess(section, 'Page section created successfully', 201);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof (await import('zod')).ZodError) {
      return apiValidationError(error);
    }

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return apiConflict('A section with this page and section name already exists');
    }

    console.error('Error creating page section:', error);
    return apiError('Failed to create page section', 500);
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
