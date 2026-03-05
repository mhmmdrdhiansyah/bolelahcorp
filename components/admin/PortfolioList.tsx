'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from './ConfirmDialog';

interface Portfolio {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  coverImage: string;
  technologies: string[];
  featured: boolean;
  order: number;
  createdAt: string;
}

interface PortfolioListResponse {
  success: boolean;
  data: Portfolio[];
}

export function PortfolioList() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    portfolioId: string;
    portfolioTitle: string;
  }>({ isOpen: false, portfolioId: '', portfolioTitle: '' });
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch portfolios on mount
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/admin/portfolios', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch portfolios');
        }

        const result: PortfolioListResponse = await response.json();
        setPortfolios(result.data);
        setFilteredPortfolios(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolios');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  // Filter portfolios based on search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = portfolios.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.slug.toLowerCase().includes(query.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredPortfolios(filtered);
    } else {
      setFilteredPortfolios(portfolios);
    }
  };

  // Delete portfolio
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    setError('');

    try {
      const response = await fetch(`/api/admin/portfolios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete portfolio');
      }

      // Update local state
      const updated = portfolios.filter((p) => p.id !== id);
      setPortfolios(updated);
      setFilteredPortfolios(
        searchQuery.trim()
          ? updated.filter(
              (p) =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.slug.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : updated
      );

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete portfolio');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    setActionLoading(id);
    setError('');

    try {
      const portfolio = portfolios.find((p) => p.id === id);
      if (!portfolio) return;

      const response = await fetch(`/api/admin/portfolios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (!response.ok) {
        throw new Error('Failed to update portfolio');
      }

      // Update local state
      const updated = portfolios.map((p) =>
        p.id === id ? { ...p, featured: !currentFeatured } : p
      );
      setPortfolios(updated);
      setFilteredPortfolios(
        searchQuery.trim()
          ? updated.filter(
              (p) =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.slug.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : updated
      );

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update portfolio');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-off-white">All Portfolios</h2>
        </div>
        <div className="h-12 bg-white/10 rounded-lg animate-pulse max-w-md" />
        <div className="bg-steel/30 rounded-xl border border-mist/20 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-coral border-r-transparent mb-4" />
          <p className="text-mist">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-off-white">All Portfolios</h2>
          <p className="text-mist text-sm mt-1">
            {filteredPortfolios.length} {filteredPortfolios.length === 1 ? 'portfolio' : 'portfolios'}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        <Button onClick={() => router.push('/admin/portfolios/new')}>
          <span className="text-lg mr-2">+</span> Add New Portfolio
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-coral/20 border border-coral/50 text-coral p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <div>
        <Input
          type="search"
          placeholder="Search portfolios by title, slug, or technology..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Empty state */}
      {filteredPortfolios.length === 0 && (
        <div className="bg-steel/30 rounded-xl border border-mist/20 p-12 text-center">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-off-white mb-2">
            {searchQuery ? 'No portfolios found' : 'No portfolios yet'}
          </h3>
          <p className="text-mist mb-6">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Create your first portfolio to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={() => router.push('/admin/portfolios/new')}>
              <span className="text-lg mr-2">+</span> Create Portfolio
            </Button>
          )}
        </div>
      )}

      {/* Portfolio list */}
      {filteredPortfolios.length > 0 && (
        <div className="bg-steel/30 rounded-xl border border-mist/20 overflow-hidden">
          {/* Desktop table view */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-mist/20 text-sm font-medium text-mist">
              <div className="col-span-1">Cover</div>
              <div className="col-span-3">Title</div>
              <div className="col-span-3">Technologies</div>
              <div className="col-span-2">Featured</div>
              <div className="col-span-1">Order</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-mist/10 last:border-b-0 hover:bg-white/5 transition-colors items-center"
              >
                {/* Cover image */}
                <div className="col-span-1">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                    {portfolio.coverImage ? (
                      <Image
                        src={portfolio.coverImage}
                        alt={portfolio.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-mist text-xs">
                        No img
                      </div>
                    )}
                  </div>
                </div>

                {/* Title and slug */}
                <div className="col-span-3">
                  <p className="font-medium text-off-white truncate">{portfolio.title}</p>
                  <p className="text-xs text-mist truncate">{portfolio.slug}</p>
                </div>

                {/* Technologies */}
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-1">
                    {portfolio.technologies.slice(0, 2).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs rounded-full bg-coral/20 text-coral"
                      >
                        {tech}
                      </span>
                    ))}
                    {portfolio.technologies.length > 2 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-mist/20 text-mist">
                        +{portfolio.technologies.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Featured badge */}
                <div className="col-span-2">
                  {portfolio.featured ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-coral/20 text-coral">
                      <span>★</span> Featured
                    </span>
                  ) : (
                    <span className="text-mist text-sm">—</span>
                  )}
                </div>

                {/* Order */}
                <div className="col-span-1">
                  <span className="text-mist text-sm">{portfolio.order}</span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex gap-2 justify-end">
                  <button
                    onClick={() => handleToggleFeatured(portfolio.id, portfolio.featured)}
                    disabled={actionLoading === portfolio.id}
                    className="p-2 rounded-lg hover:bg-white/10 text-mist hover:text-coral transition-colors disabled:opacity-50"
                    title={portfolio.featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    {portfolio.featured ? '★' : '☆'}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/portfolios/${portfolio.id}/edit`)}
                    className="p-2 rounded-lg hover:bg-white/10 text-mist hover:text-off-white transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() =>
                      setDeleteDialog({
                        isOpen: true,
                        portfolioId: portfolio.id,
                        portfolioTitle: portfolio.title,
                      })
                    }
                    disabled={actionLoading === portfolio.id}
                    className="p-2 rounded-lg hover:bg-coral/20 text-mist hover:text-coral transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile card view */}
          <div className="md:hidden">
            {filteredPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="p-4 border-b border-mist/10 last:border-b-0 hover:bg-white/5 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Cover image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                    {portfolio.coverImage ? (
                      <Image
                        src={portfolio.coverImage}
                        alt={portfolio.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-mist text-xs">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-off-white truncate">{portfolio.title}</p>
                        <p className="text-xs text-mist truncate">{portfolio.slug}</p>
                      </div>
                      {portfolio.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-coral/20 text-coral flex-shrink-0">
                          ★
                        </span>
                      )}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {portfolio.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full bg-coral/20 text-coral"
                        >
                          {tech}
                        </span>
                      ))}
                      {portfolio.technologies.length > 3 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-mist/20 text-mist">
                          +{portfolio.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleToggleFeatured(portfolio.id, portfolio.featured)}
                        disabled={actionLoading === portfolio.id}
                        className="p-2 rounded-lg bg-white/5 text-mist hover:text-coral transition-colors disabled:opacity-50 text-sm"
                      >
                        {portfolio.featured ? '★ Featured' : '☆ Mark Featured'}
                      </button>
                      <button
                        onClick={() => router.push(`/admin/portfolios/${portfolio.id}/edit`)}
                        className="p-2 rounded-lg bg-white/5 text-mist hover:text-off-white transition-colors text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            portfolioId: portfolio.id,
                            portfolioTitle: portfolio.title,
                          })
                        }
                        disabled={actionLoading === portfolio.id}
                        className="p-2 rounded-lg bg-white/5 text-mist hover:text-coral transition-colors disabled:opacity-50 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={() => handleDelete(deleteDialog.portfolioId)}
        title="Delete Portfolio"
        message={`Are you sure you want to delete "${deleteDialog.portfolioTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
