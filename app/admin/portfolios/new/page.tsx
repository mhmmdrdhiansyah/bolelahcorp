import { PortfolioForm } from '@/components/admin/PortfolioForm';

export default function NewPortfolioPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <a
          href="/admin/portfolios"
          className="text-mist hover:text-coral transition-colors text-sm mb-2 inline-block"
        >
          ← Back to Portfolios
        </a>
        <h2 className="text-2xl font-bold text-off-white">New Portfolio</h2>
        <p className="text-mist text-sm mt-1">Create a new portfolio item to showcase your work</p>
      </div>
      <PortfolioForm />
    </div>
  );
}
