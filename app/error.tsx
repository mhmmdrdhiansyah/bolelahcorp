'use client';

import { ErrorState } from '@/components/ui/ErrorState';
import { Header, Footer } from '@/components/layout';
import { useEffect } from 'react';

// ============================================================================
// Global Error Boundary
// ============================================================================

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy">
        <ErrorState
          title="Something went wrong"
          message="An unexpected error occurred. Please try again or contact support if the problem persists."
          onRetry={reset}
          retryText="Try Again"
          variant="server-error"
        />
      </main>
      <Footer />
    </>
  );
}
