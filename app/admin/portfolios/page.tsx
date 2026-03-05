import { Suspense } from 'react';
import { PortfolioList } from '@/components/admin/PortfolioList';
import { PortfolioListSkeleton } from '@/components/admin/PortfolioListSkeleton';

export default function PortfoliosPage() {
  return (
    <Suspense fallback={<PortfolioListSkeleton />}>
      <PortfolioList />
    </Suspense>
  );
}
