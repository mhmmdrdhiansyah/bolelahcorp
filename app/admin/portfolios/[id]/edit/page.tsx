import { notFound } from 'next/navigation';
import { PortfolioForm } from '@/components/admin/PortfolioForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return notFound();
  }

  const { id } = await params;

  try {
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
      return notFound();
    }

    // Format the portfolio data for the form
    // Convert null values to undefined for optional fields
    const formData = {
      id: portfolio.id,
      title: portfolio.title,
      slug: portfolio.slug,
      description: portfolio.description,
      shortDesc: portfolio.shortDesc ?? undefined,
      coverImage: portfolio.coverImage,
      images: (Array.isArray(portfolio.images) ? portfolio.images : []).map(String),
      technologies: (Array.isArray(portfolio.technologies) ? portfolio.technologies : []).map(String),
      projectUrl: portfolio.projectUrl ?? undefined,
      githubUrl: portfolio.githubUrl ?? undefined,
      featured: portfolio.featured,
      order: portfolio.order,
      completedAt: portfolio.completedAt ? new Date(portfolio.completedAt) : undefined,
      metaTitle: portfolio.metaTitle ?? undefined,
      metaDescription: portfolio.metaDescription ?? undefined,
    };

    return (
      <div className="max-w-3xl">
        <div className="mb-6">
          <a
            href="/admin/portfolios"
            className="text-mist hover:text-coral transition-colors text-sm mb-2 inline-block"
          >
            ← Back to Portfolios
          </a>
          <h2 className="text-2xl font-bold text-off-white">Edit Portfolio</h2>
          <p className="text-mist text-sm mt-1">{portfolio.title}</p>
        </div>
        <PortfolioForm portfolio={formData} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return notFound();
  }
}
