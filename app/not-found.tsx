import { NotFound404 } from '@/components/ui/ErrorState';
import { Header, Footer } from '@/components/layout';

// ============================================================================
// Global 404 Not Found Page
// ============================================================================

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy">
        <NotFound404 showBackButton homeHref="/" />
      </main>
      <Footer />
    </>
  );
}
