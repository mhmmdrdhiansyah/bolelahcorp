import { ServerHero, ServerAbout } from '@/components/sections';

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

      {/* Placeholder for other sections - coming soon in Phase 2 */}
      <section className="py-20 text-center">
        <div className="container">
          <p className="text-mist text-lg">
            More sections coming soon... 🚧
          </p>
          <p className="text-mist/60 text-sm mt-2">
            Steps 2.1-2.2: Hero & About Sections Complete
          </p>
        </div>
      </section>
    </main>
  );
}
