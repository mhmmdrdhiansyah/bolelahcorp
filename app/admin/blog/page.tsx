import { Suspense } from 'react';
import { BlogList } from '@/components/admin/BlogList';
import { BlogListSkeleton } from '@/components/admin/BlogListSkeleton';

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogListSkeleton />}>
      <BlogList />
    </Suspense>
  );
}
