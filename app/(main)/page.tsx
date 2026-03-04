import { ServerHero, ServerAbout, ServerServices, ServerTestimonials } from '@/components/sections';
import { ServerPortfolioGrid } from '@/components/portfolio';

// ============================================================================
// Home Page
// ============================================================================

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <ServerHero />

      {/* About Section */}
      <ServerAbout />

      {/* Portfolio Section */}
      <ServerPortfolioGrid />

      {/* Services Section */}
      <ServerServices />

      {/* Testimonials Section */}
      <ServerTestimonials />

      {/* Placeholder for other sections - coming soon in Phase 2 */}
      <section className="py-20 text-center">
        <div className="container">
          <p className="text-mist text-lg">
            More sections coming soon... 🚧
          </p>
          <p className="text-mist/60 text-sm mt-2">
            Steps 2.1-2.5: Hero, About, Portfolio, Services & Testimonials Sections Complete
          </p>
        </div>
      </section>
    </main>
  );
}
