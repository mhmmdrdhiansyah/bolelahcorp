import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

// ============================================================================
// GET /api/portfolios/[slug] - Get single portfolio by slug
// ============================================================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
      },
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: portfolio });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/portfolios/[slug] - Increment view count
// ============================================================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { incrementViews = false } = body;

    if (incrementViews) {
      const portfolio = await prisma.portfolio.update({
        where: { slug },
        data: { views: { increment: 1 } },
        select: { views: true },
      });

      return NextResponse.json({ data: portfolio });
    }

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}
