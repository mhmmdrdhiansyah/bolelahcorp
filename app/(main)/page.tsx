import { ServerHero, ServerAbout, ServerServices, ServerTestimonials, ServerContact } from '@/components/sections';
import { ServerPortfolioGrid } from '@/components/portfolio';
import { ServerBlogList } from '@/components/blog';
import { Header, Footer } from '@/components/layout';

// ============================================================================
// Home Page
// ============================================================================

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <Header />

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

        {/* Blog Preview Section */}
        <ServerBlogList />

        {/* Contact Section */}
        <ServerContact />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
