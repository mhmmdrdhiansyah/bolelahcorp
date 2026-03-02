export default function Home() {
  return (
    <div className="min-h-screen bg-navy py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Bolehah Corp - Color Palette Test
          </h1>
          <p className="text-mist text-lg">
            Testing custom Tailwind colors from PRD
          </p>
        </div>

        {/* Main Colors */}
        <h2 className="section-title">Brand Colors (PRD)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Navy */}
          <div className="card card-hover">
            <div className="h-24 bg-navy rounded-lg mb-4"></div>
            <h3 className="font-bold text-lg text-off-white">Dark Navy</h3>
            <p className="text-mist text-sm font-mono">#1D3557</p>
            <p className="text-mist/70 text-xs mt-1">Primary Background</p>
          </div>

          {/* Steel */}
          <div className="card card-hover">
            <div className="h-24 bg-steel rounded-lg mb-4"></div>
            <h3 className="font-bold text-lg text-off-white">Steel Blue</h3>
            <p className="text-mist text-sm font-mono">#457B9D</p>
            <p className="text-mist/70 text-xs mt-1">Cards & Secondary</p>
          </div>

          {/* Coral */}
          <div className="card card-hover">
            <div className="h-24 bg-coral rounded-lg mb-4"></div>
            <h3 className="font-bold text-lg text-off-white">Coral Red</h3>
            <p className="text-mist text-sm font-mono">#E63946</p>
            <p className="text-mist/70 text-xs mt-1">CTA & Highlights</p>
          </div>

          {/* Off-White */}
          <div className="card card-hover">
            <div className="h-24 bg-off-white rounded-lg mb-4"></div>
            <h3 className="font-bold text-lg text-off-white">Off-White</h3>
            <p className="text-mist text-sm font-mono">#F1FAEE</p>
            <p className="text-mist/70 text-xs mt-1">Text Color</p>
          </div>

          {/* Mist */}
          <div className="card card-hover">
            <div className="h-24 bg-mist rounded-lg mb-4"></div>
            <h3 className="font-bold text-lg text-off-white">Mist Blue</h3>
            <p className="text-mist text-sm font-mono">#A8DADC</p>
            <p className="text-mist/70 text-xs mt-1">Accents & Borders</p>
          </div>

          {/* Navy Dark */}
          <div className="card card-hover">
            <div className="h-24 bg-navy-dark rounded-lg mb-4"></div>
            <h3 className="font-bold text-lg text-off-white">Navy Dark</h3>
            <p className="text-mist text-sm font-mono">#152540</p>
            <p className="text-mist/70 text-xs mt-1">Darker Background</p>
          </div>
        </div>

        {/* Buttons */}
        <h2 className="section-title">Button Styles</h2>
        <div className="flex flex-wrap gap-4 mb-12">
          <button className="btn-primary">Primary Button (Coral)</button>
          <button className="btn-secondary">Secondary Button (Mist)</button>
          <button className="btn-ghost">Ghost Button</button>
        </div>

        {/* Typography */}
        <h2 className="section-title">Typography</h2>
        <div className="card mb-4">
          <h1 className="text-hero font-bold text-gradient mb-4">
            Hero Heading (Responsive)
          </h1>
          <h2 className="text-section-title font-bold text-mist mb-3">
            Section Title
          </h2>
          <p className="text-off-white text-lg mb-2">
            Default paragraph text in off-white color.
          </p>
          <p className="text-mist">
            Secondary text in mist color for less emphasis.
          </p>
        </div>

        {/* Glass Effect */}
        <h2 className="section-title">Glass Effect</h2>
        <div className="glass rounded-xl p-6 mb-12">
          <p className="text-off-white">
            Glassmorphism effect with backdrop blur and semi-transparent background.
          </p>
        </div>

        {/* Custom Fonts */}
        <h2 className="section-title">Fonts</h2>
        <div className="grid gap-4">
          <div className="card">
            <p className="text-off-white font-sans">
              Sans Serif Font (Inter) - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="card">
            <p className="text-mist font-mono">
              Monospace Font (JetBrains Mono) - Code snippet example: const hello = "world";
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
