'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createBlogSchema, type CreateBlogInput } from '@/lib/validations/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { TagInput } from '@/components/ui/TagInput';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Alert } from '@/components/ui/Alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';

// Types for category and tag
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface BlogEditorProps {
  post?: CreateBlogInput & { id?: string; tagNames?: string[] };
  onSuccess?: () => void;
}

// Status options
const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'SCHEDULED', label: 'Scheduled' },
];

const defaultFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  ogImage: '',
  status: 'DRAFT' as const,
  categoryId: '',
  publishedAt: undefined,
  scheduledAt: undefined,
  metaTitle: '',
  metaDescription: '',
  tagIds: [],
};

export function BlogEditor({ post, onSuccess }: BlogEditorProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [contentWordCount, setContentWordCount] = useState(0);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const isEdit = !!post?.id;

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
    setValue,
    setError: setFieldError,
    reset,
  } = useForm({
    resolver: zodResolver(createBlogSchema),
    defaultValues: defaultFormValues,
    mode: 'onBlur',
  });

  // Watch values for auto-slug and content count
  const title = watch('title');
  const content = watch('content');
  const status = watch('status');
  const slug = watch('slug');

  // Reset form when post prop changes (for edit mode)
  useEffect(() => {
    if (post) {
      reset(post);
      setTagNames(post.tagNames || []);
    } else {
      reset(defaultFormValues);
      setTagNames([]);
    }
  }, [post, reset]);

  // Auto-generate slug from title (only if not manually edited and not in edit mode)
  useEffect(() => {
    if (title && !isEdit && !slugManuallyEdited) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', generatedSlug);
    }
  }, [title, setValue, isEdit, slugManuallyEdited]);

  // Reset slug manual edit flag when post prop changes
  useEffect(() => {
    setSlugManuallyEdited(false);
  }, [post]);

  // Calculate word count for content
  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).filter(w => w.length > 0);
      setContentWordCount(words.length);
    } else {
      setContentWordCount(0);
    }
  }, [content]);

  // Auto-set publishedAt when status changes to PUBLISHED
  useEffect(() => {
    if (status === 'PUBLISHED' && !watch('publishedAt')) {
      setValue('publishedAt', new Date());
    }
  }, [status, setValue, watch]);

  // Scroll to error when errors occur
  useEffect(() => {
    if (errors.length > 0 && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [errors]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const result = await response.json();
          setCategories(result.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/admin/tags');
        if (response.ok) {
          const result = await response.json();
          setAvailableTags(result.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      } finally {
        setIsLoadingTags(false);
      }
    };
    fetchTags();
  }, []);

  // Convert tag names to IDs
  const convertTagNamesToIds = useCallback(async (names: string[]): Promise<string[]> => {
    if (!names || names.length === 0) return [];

    const tagIds: string[] = [];

    for (const name of names) {
      // Check if tag already exists
      const existingTag = availableTags.find(t => t.name.toLowerCase() === name.toLowerCase());
      if (existingTag) {
        tagIds.push(existingTag.id);
        continue;
      }

      // Create new tag
      try {
        const response = await fetch('/api/admin/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          }),
        });

        if (response.ok) {
          const result = await response.json();
          tagIds.push(result.data.id);
          // Add to available tags
          setAvailableTags(prev => [...prev, result.data]);
        }
      } catch (err) {
        console.error('Failed to create tag:', err);
      }
    }

    return tagIds;
  }, [availableTags]);

  const onSubmit = async (data: CreateBlogInput) => {
    setIsLoading(true);
    setErrors([]);

    try {
      // Convert tag names to IDs
      const tagIds = await convertTagNamesToIds(tagNames);

      const url = isEdit
        ? `/api/admin/blog/${post.id}`
        : '/api/admin/blog';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tagIds,
          // Convert empty strings to undefined
          excerpt: data.excerpt || undefined,
          categoryId: data.categoryId || undefined,
          coverImage: data.coverImage || undefined,
          ogImage: data.ogImage || undefined,
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
          metaTitle: data.metaTitle || undefined,
          metaDescription: data.metaDescription || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors from API
        if (result.errors) {
          const errorMessages: string[] = [];

          Object.entries(result.errors).forEach(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            msgArray.forEach((msg: string) => {
              const fieldName = field
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
              errorMessages.push(`${fieldName}: ${msg}`);
            });
          });

          setErrors(errorMessages.length > 0 ? errorMessages : ['Validation failed. Please check your inputs.']);
          throw new Error('Validation failed');
        }

        throw new Error(result.message || 'Failed to save blog post. Please try again.');
      }

      // Success
      onSuccess?.();
      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
      if (errorMsg !== 'Validation failed' && !errors.includes(errorMsg)) {
        setErrors(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Status badge color
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'PUBLISHED': return 'bg-green-500/20 text-green-400';
      case 'SCHEDULED': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-mist/20 text-mist';
    }
  };

  // Build category options
  const categoryOptions = [
    { value: '', label: isLoadingCategories ? 'Loading categories...' : 'No category' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Alerts */}
      {errors.length > 0 && (
        <div ref={errorRef} className="space-y-3">
          {errors.map((error, index) => (
            <Alert key={index} variant="error">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold">Error{errors.length > 1 ? 's' : ''} occurred:</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-off-white">Basic Information</h3>
            {status && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="My Awesome Blog Post"
              {...register('title')}
              disabled={isLoading}
            />
            {formErrors.title && (
              <p className="text-coral text-sm mt-1">{formErrors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              placeholder="my-awesome-blog-post"
              {...register('slug')}
              onBlur={(e) => {
                // Mark as manually edited if user changes the slug
                if (e.target.value && e.target.value !== slug) {
                  setSlugManuallyEdited(true);
                }
                // Call the original onBlur from register
                register('slug').onBlur?.(e);
              }}
              disabled={isLoading}
            />
            {formErrors.slug && (
              <p className="text-coral text-sm mt-1">{formErrors.slug.message}</p>
            )}
            <p className="text-mist/50 text-xs mt-1">
              Auto-generated from title. Lowercase, letters, numbers, hyphens only.
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief description for blog cards and social media..."
              rows={3}
              {...register('excerpt')}
              disabled={isLoading}
            />
            <p className="text-mist/50 text-xs mt-1">
              Short summary shown in blog cards and meta description (if not set).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cover & OG Images Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-off-white">Images</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cover Image */}
          <div>
            <ImageUpload
              label="Cover Image"
              value={watch('coverImage')}
              onChange={(url) => setValue('coverImage', url)}
              onRemove={() => setValue('coverImage', '')}
              disabled={isLoading}
            />
            {formErrors.coverImage && (
              <p className="text-coral text-sm mt-1">{formErrors.coverImage.message}</p>
            )}
            <p className="text-mist/50 text-xs mt-1">
              Featured image shown at the top of your blog post.
            </p>
          </div>

          {/* OG Image */}
          <div>
            <ImageUpload
              label="OG Image (Social Share)"
              value={watch('ogImage')}
              onChange={(url) => setValue('ogImage', url)}
              onRemove={() => setValue('ogImage', '')}
              disabled={isLoading}
            />
            <p className="text-mist/50 text-xs mt-1">
              Image shown when sharing on social media (defaults to cover image).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-off-white">Content</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your blog content in Markdown...

# Heading 1
## Heading 2

**Bold** and *italic* text

- List item 1
- List item 2

[Link text](https://example.com)

![Image alt](/path/to/image.jpg)"
              rows={15}
              {...register('content')}
              disabled={isLoading}
              className="font-mono text-sm"
            />
            {formErrors.content && (
              <p className="text-coral text-sm mt-1">{formErrors.content.message}</p>
            )}
            <div className="flex items-center justify-between mt-1">
              <p className="text-mist/50 text-xs">
                Supports Markdown syntax for formatting.
              </p>
              <p className="text-mist/50 text-xs">
                {contentWordCount} word{contentWordCount !== 1 ? 's' : ''} · {content?.length || 0} characters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category & Tags Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-off-white">Category & Tags</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category */}
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select
              id="categoryId"
              options={categoryOptions}
              {...register('categoryId')}
              disabled={isLoading || isLoadingCategories}
            />
            {categories.length === 0 && !isLoadingCategories && (
              <p className="text-mist/50 text-xs mt-1">
                No categories found. Create categories first to organize your posts.
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <TagInput
              value={tagNames}
              onChange={setTagNames}
              placeholder="Type tag name and press Enter..."
            />
            <p className="text-mist/50 text-xs mt-1">
              Add tags to help readers find related posts. New tags will be created automatically.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-off-white">Publishing</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              options={statusOptions}
              {...register('status')}
              disabled={isLoading}
            />
            <p className="text-mist/50 text-xs mt-1">
              {status === 'DRAFT' && 'Save as draft to continue editing later.'}
              {status === 'PUBLISHED' && 'Post will be immediately visible to readers.'}
              {status === 'SCHEDULED' && 'Post will be published automatically at the scheduled date.'}
            </p>
          </div>

          {/* Published At */}
          {status === 'PUBLISHED' && (
            <div>
              <Label htmlFor="publishedAt">Published Date</Label>
              <DatePicker
                id="publishedAt"
                {...register('publishedAt', { valueAsDate: true })}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Scheduled At */}
          {status === 'SCHEDULED' && (
            <div>
              <Label htmlFor="scheduledAt">Schedule Date *</Label>
              <DatePicker
                id="scheduledAt"
                {...register('scheduledAt', { valueAsDate: true })}
                disabled={isLoading}
              />
              {formErrors.scheduledAt && (
                <p className="text-coral text-sm mt-1">{formErrors.scheduledAt.message}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-off-white">SEO (Optional)</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              placeholder="SEO title for search engines"
              {...register('metaTitle')}
              disabled={isLoading}
            />
            <p className="text-mist/50 text-xs mt-1">
              Recommended: 50-60 characters. Leave empty to use the post title.
            </p>
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              placeholder="SEO description for search engines"
              rows={3}
              {...register('metaDescription')}
              disabled={isLoading}
            />
            <p className="text-mist/50 text-xs mt-1">
              Recommended: 150-160 characters. Leave empty to use the excerpt.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}
