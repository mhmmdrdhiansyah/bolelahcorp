'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from './ConfirmDialog';

type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: PostStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  postTags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
}

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'SCHEDULED', label: 'Scheduled' },
];

const getStatusColor = (status: PostStatus) => {
  switch (status) {
    case 'PUBLISHED': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'SCHEDULED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default: return 'bg-mist/20 text-mist border-mist/30';
  }
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function BlogList() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    postId: string;
    postTitle: string;
  }>({ isOpen: false, postId: '', postTitle: '' });
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/admin/blog', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const result: BlogListResponse = await response.json();
        setPosts(result.data);
        setFilteredPosts(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search and status
  useEffect(() => {
    let filtered = posts;

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query) ||
          p.excerpt?.toLowerCase().includes(query) ||
          p.category?.name.toLowerCase().includes(query) ||
          p.postTags.some(pt => pt.tag.name.toLowerCase().includes(query))
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, statusFilter, posts]);

  // Delete post
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    setError('');

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }

      // Update local state
      const updated = posts.filter((p) => p.id !== id);
      setPosts(updated);

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog post');
    } finally {
      setActionLoading(null);
    }
  };

  // Change post status
  const handleChangeStatus = async (id: string, newStatus: PostStatus) => {
    setActionLoading(id);
    setError('');

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      // Update local state
      const updated = posts.map((p) =>
        p.id === id
          ? {
              ...p,
              status: newStatus,
              publishedAt: newStatus === 'PUBLISHED' && !p.publishedAt ? new Date().toISOString() : p.publishedAt,
            }
          : p
      );
      setPosts(updated);

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update blog post');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-off-white">All Blog Posts</h2>
        </div>
        <div className="h-12 bg-white/10 rounded-lg animate-pulse max-w-md" />
        <div className="bg-steel/30 rounded-xl border border-mist/20 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-coral border-r-transparent mb-4" />
          <p className="text-mist">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-off-white">All Blog Posts</h2>
          <p className="text-mist text-sm mt-1">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        <Button onClick={() => router.push('/admin/blog/new')}>
          <span className="text-lg mr-2">+</span> Add New Post
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
        <Input
          type="search"
          placeholder="Search posts by title, category, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md flex-1"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="max-w-[180px]"
        />
      </div>

      {/* Empty state */}
      {filteredPosts.length === 0 && (
        <div className="bg-steel/30 rounded-xl border border-mist/20 p-12 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-off-white mb-2">
            {searchQuery || statusFilter ? 'No posts found' : 'No blog posts yet'}
          </h3>
          <p className="text-mist mb-6">
            {searchQuery || statusFilter
              ? 'Try adjusting your filters'
              : 'Create your first blog post to get started'}
          </p>
          {!searchQuery && !statusFilter && (
            <Button onClick={() => router.push('/admin/blog/new')}>
              <span className="text-lg mr-2">+</span> Create Post
            </Button>
          )}
        </div>
      )}

      {/* Blog post list */}
      {filteredPosts.length > 0 && (
        <div className="bg-steel/30 rounded-xl border border-mist/20 overflow-hidden">
          {/* Desktop table view */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-mist/20 text-sm font-medium text-mist">
              <div className="col-span-1">Cover</div>
              <div className="col-span-3">Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-mist/10 last:border-b-0 hover:bg-white/5 transition-colors items-center"
              >
                {/* Cover image */}
                <div className="col-span-1">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-mist text-xs">
                        📝
                      </div>
                    )}
                  </div>
                </div>

                {/* Title and excerpt */}
                <div className="col-span-3">
                  <p className="font-medium text-off-white truncate">{post.title}</p>
                  <p className="text-xs text-mist truncate">{post.excerpt || 'No excerpt'}</p>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full border ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  {post.category ? (
                    <span className="text-sm text-mist">{post.category.name}</span>
                  ) : (
                    <span className="text-sm text-mist/50">—</span>
                  )}
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <span className="text-sm text-mist">
                    {post.status === 'PUBLISHED' ? formatDate(post.publishedAt) : formatDate(post.scheduledAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex gap-2 justify-end">
                  {/* Quick status toggle */}
                  <select
                    value={post.status}
                    onChange={(e) => handleChangeStatus(post.id, e.target.value as PostStatus)}
                    disabled={actionLoading === post.id}
                    className="text-xs px-2 py-1 rounded bg-mist/10 border border-mist/30 text-mist focus:outline-none focus:border-coral disabled:opacity-50"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Publish</option>
                    <option value="SCHEDULED">Schedule</option>
                  </select>
                  <button
                    onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                    className="p-2 rounded-lg hover:bg-white/10 text-mist hover:text-off-white transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() =>
                      setDeleteDialog({
                        isOpen: true,
                        postId: post.id,
                        postTitle: post.title,
                      })
                    }
                    disabled={actionLoading === post.id}
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
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 border-b border-mist/10 last:border-b-0 hover:bg-white/5 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Cover image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-mist text-xl">
                        📝
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-off-white truncate">{post.title}</p>
                        <p className="text-xs text-mist truncate">{post.excerpt || 'No excerpt'}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${getStatusColor(post.status)} flex-shrink-0`}>
                        {post.status}
                      </span>
                    </div>

                    {/* Category and Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {post.category && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-steel/50 text-mist">
                          {post.category.name}
                        </span>
                      )}
                      {post.postTags.slice(0, 2).map((pt) => (
                        <span
                          key={pt.tag.id}
                          className="px-2 py-0.5 text-xs rounded-full bg-coral/20 text-coral"
                        >
                          #{pt.tag.name}
                        </span>
                      ))}
                      {post.postTags.length > 2 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-mist/20 text-mist">
                          +{post.postTags.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={post.status}
                        onChange={(e) => handleChangeStatus(post.id, e.target.value as PostStatus)}
                        disabled={actionLoading === post.id}
                        className="text-xs px-3 py-1.5 rounded bg-white/5 border border-mist/30 text-mist focus:outline-none focus:border-coral disabled:opacity-50"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Publish</option>
                        <option value="SCHEDULED">Schedule</option>
                      </select>
                      <button
                        onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                        className="px-3 py-1.5 rounded bg-white/5 text-mist hover:text-off-white transition-colors text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            postId: post.id,
                            postTitle: post.title,
                          })
                        }
                        disabled={actionLoading === post.id}
                        className="px-3 py-1.5 rounded bg-white/5 text-mist hover:text-coral transition-colors disabled:opacity-50 text-sm"
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
        onConfirm={() => handleDelete(deleteDialog.postId)}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteDialog.postTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
