import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createPortfolioSchema } from '@/lib/validations/portfolio';
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
// GET /api/admin/portfolios - Get all portfolios
// ============================================================================

export async function GET(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured');

    const { prisma } = await import('@/lib/prisma');

    const where = featured === 'true' ? { featured: true } : featured === 'false' ? { featured: false } : {};

    const [portfolios, total] = await Promise.all([
      prisma.portfolio.findMany({
        where,
        skip: offset,
        take: Math.min(limit, 100), // Max 100 per request
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
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
      }),
      prisma.portfolio.count({ where }),
    ]);

    return apiSuccess(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return apiError('Failed to fetch portfolios', 500);
  }
}

// ============================================================================
// POST /api/admin/portfolios - Create a new portfolio
// ============================================================================

export async function POST(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    // Validate with Zod
    const validated = createPortfolioSchema.parse(body);

    const { prisma } = await import('@/lib/prisma');
    const session = await getServerSession(authOptions);

    // Check for duplicate slug
    const existing = await prisma.portfolio.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return apiConflict('A portfolio with this slug already exists');
    }

    // Create portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        shortDesc: validated.shortDesc,
        coverImage: validated.coverImage,
        images: validated.images,
        technologies: validated.technologies,
        projectUrl: validated.projectUrl || null,
        githubUrl: validated.githubUrl || null,
        featured: validated.featured,
        order: validated.order,
        completedAt: validated.completedAt,
        metaTitle: validated.metaTitle,
        metaDescription: validated.metaDescription,
        authorId: (session?.user as any)?.id || '',
      },
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

    return apiSuccess(portfolio, 'Portfolio created successfully', 201);
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof (await import('zod')).ZodError) {
      return apiValidationError(error);
    }

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return apiConflict('A portfolio with this slug already exists');
    }

    console.error('Error creating portfolio:', error);
    return apiError('Failed to create portfolio', 500);
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
