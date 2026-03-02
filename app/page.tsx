export default function Home() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#1D3557' }}>
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4"
            style={{
              background: 'linear-gradient(to right, #A8DADC, #E63946)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Bolehah Corp - Color Palette Test
          </h1>
          <p style={{ color: '#A8DADC' }} className="text-lg">
            Testing custom colors from PRD
          </p>
        </div>

        {/* Main Colors */}
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#F1FAEE' }}>
          Brand Colors (PRD)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Navy */}
          <div className="card card-hover">
            <div className="h-24 rounded-lg mb-4" style={{ backgroundColor: '#1D3557' }}></div>
            <h3 className="font-bold text-lg" style={{ color: '#F1FAEE' }}>Dark Navy</h3>
            <p style={{ color: '#A8DADC' }} className="text-sm font-mono">#1D3557</p>
            <p style={{ color: 'rgba(168, 218, 220, 0.7)' }} className="text-xs mt-1">Primary Background</p>
          </div>

          {/* Steel */}
          <div className="card card-hover">
            <div className="h-24 rounded-lg mb-4" style={{ backgroundColor: '#457B9D' }}></div>
            <h3 className="font-bold text-lg" style={{ color: '#F1FAEE' }}>Steel Blue</h3>
            <p style={{ color: '#A8DADC' }} className="text-sm font-mono">#457B9D</p>
            <p style={{ color: 'rgba(168, 218, 220, 0.7)' }} className="text-xs mt-1">Cards & Secondary</p>
          </div>

          {/* Coral */}
          <div className="card card-hover">
            <div className="h-24 rounded-lg mb-4" style={{ backgroundColor: '#E63946' }}></div>
            <h3 className="font-bold text-lg" style={{ color: '#F1FAEE' }}>Coral Red</h3>
            <p style={{ color: '#A8DADC' }} className="text-sm font-mono">#E63946</p>
            <p style={{ color: 'rgba(168, 218, 220, 0.7)' }} className="text-xs mt-1">CTA & Highlights</p>
          </div>

          {/* Off-White */}
          <div className="card card-hover">
            <div className="h-24 rounded-lg mb-4" style={{ backgroundColor: '#F1FAEE' }}></div>
            <h3 className="font-bold text-lg" style={{ color: '#F1FAEE' }}>Off-White</h3>
            <p style={{ color: '#A8DADC' }} className="text-sm font-mono">#F1FAEE</p>
            <p style={{ color: 'rgba(168, 218, 220, 0.7)' }} className="text-xs mt-1">Text Color</p>
          </div>

          {/* Mist */}
          <div className="card card-hover">
            <div className="h-24 rounded-lg mb-4" style={{ backgroundColor: '#A8DADC' }}></div>
            <h3 className="font-bold text-lg" style={{ color: '#F1FAEE' }}>Mist Blue</h3>
            <p style={{ color: '#A8DADC' }} className="text-sm font-mono">#A8DADC</p>
            <p style={{ color: 'rgba(168, 218, 220, 0.7)' }} className="text-xs mt-1">Accents & Borders</p>
          </div>

          {/* Navy Dark */}
          <div className="card card-hover">
            <div className="h-24 rounded-lg mb-4" style={{ backgroundColor: '#152540' }}></div>
            <h3 className="font-bold text-lg" style={{ color: '#F1FAEE' }}>Navy Dark</h3>
            <p style={{ color: '#A8DADC' }} className="text-sm font-mono">#152540</p>
            <p style={{ color: 'rgba(168, 218, 220, 0.7)' }} className="text-xs mt-1">Darker Background</p>
          </div>
        </div>

        {/* Buttons */}
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#F1FAEE' }}>
          Button Styles
        </h2>
        <div className="flex flex-wrap gap-4 mb-12">
          <button className="btn btn-primary">Primary Button (Coral)</button>
          <button className="btn btn-secondary">Secondary Button (Mist)</button>
          <button className="btn btn-ghost">Ghost Button</button>
        </div>

        {/* Typography */}
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#F1FAEE' }}>
          Typography
        </h2>
        <div className="card mb-4">
          <h1
            className="font-bold mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)',
              background: 'linear-gradient(to right, #A8DADC, #E63946)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              lineHeight: '1.1'
            }}
          >
            Hero Heading (Responsive)
          </h1>
          <h2
            className="font-bold mb-3"
            style={{
              fontSize: 'clamp(1.8rem, 3vw + 1rem, 3rem)',
              color: '#A8DADC',
              lineHeight: '1.2'
            }}
          >
            Section Title
          </h2>
          <p className="text-lg mb-2" style={{ color: '#F1FAEE' }}>
            Default paragraph text in off-white color.
          </p>
          <p style={{ color: '#A8DADC' }}>
            Secondary text in mist color for less emphasis.
          </p>
        </div>

        {/* Glass Effect */}
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#F1FAEE' }}>
          Glass Effect
        </h2>
        <div className="glass rounded-xl p-6 mb-12">
          <p style={{ color: '#F1FAEE' }}>
            Glassmorphism effect with backdrop blur and semi-transparent background.
          </p>
        </div>

        {/* Custom Fonts */}
        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#F1FAEE' }}>
          Fonts
        </h2>
        <div className="grid gap-4">
          <div className="card">
            <p className="text-off-white" style={{ color: '#F1FAEE', fontFamily: 'var(--font-inter), sans-serif' }}>
              Sans Serif Font (Inter) - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="card">
            <p style={{ color: '#A8DADC', fontFamily: 'var(--font-jetbrains), monospace' }}>
              Monospace Font (JetBrains Mono) - Code snippet example: const hello = "world";
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
