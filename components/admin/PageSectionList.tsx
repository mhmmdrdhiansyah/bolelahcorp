'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from './ConfirmDialog';

interface PageSection {
  id: string;
  page: string;
  section: string;
  title: string;
  content: Record<string, unknown>;
  enabled: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface PageSectionListResponse {
  success: boolean;
  data: PageSection[];
}

const pageOptions = [
  { value: '', label: 'All Pages' },
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'contact', label: 'Contact' },
];

const pageLabels: Record<string, string> = {
  home: 'Home',
  about: 'About',
  contact: 'Contact',
};

export function PageSectionList() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sections, setSections] = useState<PageSection[]>([]);
  const [filteredSections, setFilteredSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageFilter, setPageFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    sectionId: string;
    sectionTitle: string;
  }>({ isOpen: false, sectionId: '', sectionTitle: '' });
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch sections on mount
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('/api/admin/pages/sections', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch page sections');
        }

        const result: PageSectionListResponse = await response.json();
        setSections(result.data);
        setFilteredSections(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page sections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  // Filter sections based on page
  useEffect(() => {
    let filtered = sections;

    if (pageFilter) {
      filtered = filtered.filter(s => s.page === pageFilter);
    }

    setFilteredSections(filtered);
  }, [pageFilter, sections]);

  // Delete section
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    setError('');

    try {
      const response = await fetch(`/api/admin/pages/sections/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete page section');
      }

      // Update local state
      const updated = sections.filter((s) => s.id !== id);
      setSections(updated);

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page section');
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle enabled
  const handleToggleEnabled = async (section: PageSection) => {
    setActionLoading(section.id);
    setError('');

    try {
      const response = await fetch(`/api/admin/pages/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !section.enabled }),
      });

      if (!response.ok) {
        throw new Error('Failed to update page section');
      }

      // Update local state
      const updated = sections.map((s) =>
        s.id === section.id ? { ...s, enabled: !s.enabled } : s
      );
      setSections(updated);

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update page section');
    } finally {
      setActionLoading(null);
    }
  };

  // Move order
  const handleMoveOrder = async (section: PageSection, direction: 'up' | 'down') => {
    const pageSections = filteredSections.filter(s => s.page === section.page);
    const currentIndex = pageSections.findIndex(s => s.id === section.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= pageSections.length) return;

    const targetSection = pageSections[targetIndex];
    setActionLoading(section.id);

    try {
      await Promise.all([
        fetch(`/api/admin/pages/sections/${section.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: targetSection.order }),
        }),
        fetch(`/api/admin/pages/sections/${targetSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: section.order }),
        }),
      ]);

      // Refetch sections to get correct order
      const response = await fetch('/api/admin/pages/sections');
      if (response.ok) {
        const result: PageSectionListResponse = await response.json();
        setSections(result.data);
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder sections');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-off-white">All Page Sections</h2>
        </div>
        <div className="h-12 bg-white/10 rounded-lg animate-pulse max-w-md" />
        <div className="bg-steel/30 rounded-xl border border-mist/20 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-coral border-r-transparent mb-4" />
          <p className="text-mist">Loading page sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-off-white">All Page Sections</h2>
          <p className="text-mist text-sm mt-1">
            {filteredSections.length} {filteredSections.length === 1 ? 'section' : 'sections'}
            {pageFilter && ` on ${pageLabels[pageFilter] || pageFilter}`}
          </p>
        </div>
        <Button onClick={() => router.push('/admin/pages/new')}>
          <span className="text-lg mr-2">+</span> Add New Section
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-coral/20 border border-coral/50 text-coral p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          options={pageOptions}
          value={pageFilter}
          onChange={(e) => setPageFilter(e.target.value)}
          className="max-w-[180px]"
        />
      </div>

      {/* Empty state */}
      {filteredSections.length === 0 && (
        <div className="bg-steel/30 rounded-xl border border-mist/20 p-12 text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-off-white mb-2">
            {pageFilter ? `No sections on ${pageLabels[pageFilter] || pageFilter} page` : 'No page sections yet'}
          </h3>
          <p className="text-mist mb-6">
            {pageFilter
              ? 'Create sections for this page to customize its content'
              : 'Create your first page section to get started'}
          </p>
          <Button onClick={() => router.push('/admin/pages/new')}>
            <span className="text-lg mr-2">+</span> Create Section
          </Button>
        </div>
      )}

      {/* Section list */}
      {filteredSections.length > 0 && (
        <div className="space-y-6">
          {Object.entries(
            filteredSections.reduce((acc, section) => {
              if (!acc[section.page]) {
                acc[section.page] = [];
              }
              acc[section.page].push(section);
              return acc;
            }, {} as Record<string, PageSection[]>)
          ).map(([page, pageSections]) => (
            <div key={page}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-off-white">
                  {pageLabels[page] || page}
                </h3>
                <span className="text-sm text-mist/50">
                  {pageSections.length} section{pageSections.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="bg-steel/30 rounded-xl border border-mist/20 overflow-hidden">
                {pageSections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`p-4 border-b border-mist/10 last:border-b-0 hover:bg-white/5 transition-colors ${
                      !section.enabled ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-mist/50 px-2 py-1 bg-mist/10 rounded">
                            {section.section}
                          </span>
                          {!section.enabled && (
                            <span className="text-xs text-mist/50">(disabled)</span>
                          )}
                        </div>
                        <h4 className="text-lg font-medium text-off-white mt-2">
                          {section.title}
                        </h4>
                        <p className="text-sm text-mist/50 mt-1">
                          Order: {section.order}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Move Up */}
                        <button
                          onClick={() => handleMoveOrder(section, 'up')}
                          disabled={index === 0 || actionLoading === section.id}
                          className="p-2 text-mist hover:text-off-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                        >
                          ↑
                        </button>

                        {/* Move Down */}
                        <button
                          onClick={() => handleMoveOrder(section, 'down')}
                          disabled={index === pageSections.length - 1 || actionLoading === section.id}
                          className="p-2 text-mist hover:text-off-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                        >
                          ↓
                        </button>

                        {/* Toggle */}
                        <button
                          onClick={() => handleToggleEnabled(section)}
                          disabled={actionLoading === section.id}
                          className={`px-3 py-1.5 text-sm rounded transition-colors ${
                            section.enabled
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-mist/20 text-mist hover:bg-mist/30'
                          } disabled:opacity-50`}
                        >
                          {section.enabled ? 'On' : 'Off'}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => router.push(`/admin/pages/edit/${section.id}`)}
                          className="p-2 rounded-lg hover:bg-white/10 text-mist hover:text-off-white transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              isOpen: true,
                              sectionId: section.id,
                              sectionTitle: section.title,
                            })
                          }
                          disabled={actionLoading === section.id}
                          className="p-2 rounded-lg hover:bg-coral/20 text-mist hover:text-coral transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={() => handleDelete(deleteDialog.sectionId)}
        title="Delete Page Section"
        message={`Are you sure you want to delete "${deleteDialog.sectionTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
