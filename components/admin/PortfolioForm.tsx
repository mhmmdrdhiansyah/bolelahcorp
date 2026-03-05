'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createPortfolioSchema, type CreatePortfolioInput } from '@/lib/validations/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { TagInput } from '@/components/ui/TagInput';
import { Toggle } from '@/components/ui/Toggle';
import { DatePicker } from '@/components/ui/DatePicker';
import { Alert } from '@/components/ui/Alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface PortfolioFormProps {
  portfolio?: CreatePortfolioInput & { id?: string };
  onSuccess?: () => void;
}

const defaultFormValues = {
  title: '',
  slug: '',
  description: '',
  coverImage: '',
  technologies: [],
  images: [],
  featured: false,
  order: 0,
  shortDesc: '',
  projectUrl: '',
  githubUrl: '',
  completedAt: undefined,
  metaTitle: '',
  metaDescription: '',
};

export function PortfolioForm({ portfolio, onSuccess }: PortfolioFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagesText, setImagesText] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);
  const isEdit = !!portfolio?.id;

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
    setValue,
    setError: setFieldError,
    reset,
  } = useForm({
    resolver: zodResolver(createPortfolioSchema),
    defaultValues: defaultFormValues,
    mode: 'onBlur',
  });

  // Reset form when portfolio prop changes (for edit mode)
  useEffect(() => {
    if (portfolio) {
      reset(portfolio);
      setImagesText((portfolio.images || []).join('\n'));
    } else {
      reset(defaultFormValues);
      setImagesText('');
    }
  }, [portfolio, reset]);

  // Auto-generate slug from title
  const title = watch('title');
  useEffect(() => {
    if (title && !isEdit) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  }, [title, setValue, isEdit]);

  // Scroll to error when errors occur
  useEffect(() => {
    if (errors.length > 0 && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [errors]);

  const onSubmit = async (data: CreatePortfolioInput) => {
    setIsLoading(true);
    setErrors([]);

    try {
      const url = isEdit
        ? `/api/admin/portfolios/${portfolio.id}`
        : '/api/admin/portfolios';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors from API
        if (result.errors) {
          const errorMessages: string[] = [];

          // Convert Zod field errors to readable messages
          Object.entries(result.errors).forEach(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            msgArray.forEach((msg: string) => {
              // Format field name to readable
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

        // Handle other errors
        throw new Error(result.message || 'Failed to save portfolio. Please try again.');
      }

      // Success
      onSuccess?.();
      router.push('/admin/portfolios');
      router.refresh();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong';
      // Only add error if not already added from validation
      if (errorMsg !== 'Validation failed' && !errors.includes(errorMsg)) {
        setErrors(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          <h3 className="text-lg font-semibold text-off-white">Basic Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="My Awesome Project"
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
              placeholder="my-awesome-project"
              {...register('slug')}
              disabled={isLoading}
            />
            {formErrors.slug && (
              <p className="text-coral text-sm mt-1">{formErrors.slug.message}</p>
            )}
            <p className="text-mist/50 text-xs mt-1">
              Auto-generated from title. Lowercase, letters, numbers, hyphens only.
            </p>
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="shortDesc">Short Description</Label>
            <Input
              id="shortDesc"
              placeholder="Brief description for portfolio cards"
              {...register('shortDesc')}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed project description..."
              rows={5}
              {...register('description')}
              disabled={isLoading}
            />
            {formErrors.description && (
              <p className="text-coral text-sm mt-1">{formErrors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-off-white">Images</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cover Image */}
          <div>
            <Label htmlFor="coverImage">Cover Image URL *</Label>
            <Input
              id="coverImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register('coverImage')}
              disabled={isLoading}
            />
            {formErrors.coverImage && (
              <p className="text-coral text-sm mt-1">{formErrors.coverImage.message}</p>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <Label>Additional Images</Label>
            <p className="text-mist/50 text-xs mb-2">Enter one URL per line</p>
            <Textarea
              placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg"
              rows={3}
              value={imagesText}
              onChange={(e) => {
                const text = e.target.value;
                setImagesText(text);
                const urls = text
                  .split('\n')
                  .filter(url => url.trim())
                  .map(url => url.trim());
                setValue('images', urls);
              }}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tech & Links Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-off-white">Technologies & Links</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Technologies */}
          <div>
            <Label>Technologies * (at least 1)</Label>
            <TagInput
              value={watch('technologies') || []}
              onChange={(tags) => setValue('technologies', tags)}
              placeholder="Type technology name and press Enter..."
            />
            {formErrors.technologies && (
              <p className="text-coral text-sm mt-1">{formErrors.technologies.message as string}</p>
            )}
          </div>

          {/* Project URL */}
          <div>
            <Label htmlFor="projectUrl">Project URL</Label>
            <Input
              id="projectUrl"
              type="url"
              placeholder="https://myproject.com"
              {...register('projectUrl')}
              disabled={isLoading}
            />
          </div>

          {/* GitHub URL */}
          <div>
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/user/repo"
              {...register('githubUrl')}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-off-white">Settings</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Featured */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Featured Project</Label>
              <p className="text-mist/50 text-xs">
                Show in homepage featured section
              </p>
            </div>
            <Toggle
              checked={watch('featured')}
              onChange={(e) => setValue('featured', e.target.checked as boolean)}
            />
          </div>

          {/* Order */}
          <div>
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              min="0"
              {...register('order', { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>

          {/* Completed At */}
          <div>
            <Label htmlFor="completedAt">Completion Date</Label>
            <DatePicker
              id="completedAt"
              {...register('completedAt', { valueAsDate: true })}
              disabled={isLoading}
            />
          </div>
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
          {isLoading ? 'Saving...' : isEdit ? 'Update Portfolio' : 'Create Portfolio'}
        </Button>
      </div>
    </form>
  );
}
