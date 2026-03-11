import { Suspense } from 'react';
import { PageSectionList } from '@/components/admin/PageSectionList';
import { PageSectionListSkeleton } from '@/components/admin/PageSectionListSkeleton';

export default function AdminPagesPage() {
  return (
    <Suspense fallback={<PageSectionListSkeleton />}>
      <PageSectionList />
    </Suspense>
  );
}
