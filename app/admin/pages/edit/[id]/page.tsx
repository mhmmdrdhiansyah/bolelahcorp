import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PageSectionEditor } from '@/components/admin/PageSectionEditor';
import { PageSectionEditorSkeleton } from '@/components/admin/PageSectionEditorSkeleton';

async function getPageSection(id: string) {
  const section = await prisma.pageSection.findUnique({
    where: { id },
  });

  if (!section) {
    return null;
  }

  return {
    ...section,
    page: section.page as 'home' | 'about' | 'contact',
    content: section.content as Record<string, unknown>,
    createdAt: section.createdAt.toISOString(),
    updatedAt: section.updatedAt.toISOString(),
  };
}

export default async function EditPageSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    notFound();
  }

  const { id } = await params;
  const section = await getPageSection(id);

  if (!section) {
    notFound();
  }

  return (
    <Suspense fallback={<PageSectionEditorSkeleton />}>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-off-white">Edit Page Section</h1>
          <p className="text-mist/50 mt-1">Edit content section: {section.title}</p>
        </div>
        <PageSectionEditor section={section} />
      </div>
    </Suspense>
  );
}
