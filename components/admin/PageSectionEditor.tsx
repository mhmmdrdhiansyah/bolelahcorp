'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createPageSectionSchema, type CreatePageSectionInput, pageOptions } from '@/lib/validations/pageSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Alert } from '@/components/ui/Alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface PageSectionEditorProps {
  section?: CreatePageSectionInput & { id?: string };
  onSuccess?: () => void;
}

const pageOptionsList = [
  { value: 'home', label: 'Home Page' },
  { value: 'about', label: 'About Page' },
  { value: 'contact', label: 'Contact Page' },
];

const defaultFormValues = {
  page: 'home' as const,
  section: '',
  title: '',
  content: {},
  enabled: true,
  order: 0,
};

export function PageSectionEditor({ section, onSuccess }: PageSectionEditorProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonError, setJsonError] = useState<string>('');
  const errorRef = useRef<HTMLDivElement>(null);
  const isEdit = !!section?.id;

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
    setValue,
    setError: setFieldError,
    reset,
  } = useForm({
    resolver: zodResolver(createPageSectionSchema),
    defaultValues: defaultFormValues,
    mode: 'onBlur',
  });

  // Watch content for JSON validation
  const contentJson = watch('content');

  // Reset form when section prop changes (for edit mode)
  useEffect(() => {
    if (section) {
      reset({
        ...section,
        content: section.content || {},
      });
    } else {
      reset(defaultFormValues);
    }
  }, [section, reset]);

  // Scroll to error when errors occur
  useEffect(() => {
    if (errors.length > 0 && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [errors]);

  // Validate JSON content
  const validateContentJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      setJsonError('');
      return true;
    } catch (err) {
      setJsonError('Invalid JSON format');
      return false;
    }
  };

  const onSubmit = async (data: CreatePageSectionInput) => {
    setIsLoading(true);
    setErrors([]);

    try {
      const url = isEdit
        ? `/api/admin/pages/sections/${section.id}`
        : '/api/admin/pages/sections';

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

        throw new Error(result.message || 'Failed to save page section. Please try again.');
      }

      // Success
      onSuccess?.();
      router.push('/admin/pages');
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

  // Format JSON for display
  const formatContentForDisplay = (): string => {
    try {
      if (typeof contentJson === 'string') {
        return contentJson;
      }
      return JSON.stringify(contentJson, null, 2);
    } catch {
      return '{}';
    }
  };

  // Handle content JSON change
  const handleContentChange = (value: string) => {
    if (validateContentJson(value)) {
      try {
        setValue('content', JSON.parse(value));
      } catch {
        // Keep as string for now
      }
    }
  };

  // Get suggested content structure based on section name
  const getSuggestedContent = (sectionName: string): string => {
    const suggestions: Record<string, Record<string, unknown>> = {
      hero: {
        subtitle: 'Building digital experiences',
        description: 'Full-stack developer specializing in modern web technologies',
        buttonText: 'View Projects',
        buttonLink: '/portfolio',
        backgroundImage: '/images/hero-bg.jpg',
      },
      about: {
        heading: 'About Me',
        description: 'I am a passionate developer with expertise in...',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        image: '/images/about.jpg',
      },
      services: {
        heading: 'What I Do',
        services: [
          { title: 'Web Development', icon: 'code', description: 'Building modern web applications' },
          { title: 'UI/UX Design', icon: 'palette', description: 'Creating beautiful user interfaces' },
        ],
      },
      portfolio: {
        heading: 'Featured Work',
        showCount: 6,
      },
      testimonials: {
        heading: 'What Clients Say',
        testimonials: [
          { name: 'John Doe', role: 'CEO', content: 'Great work!', rating: 5 },
        ],
      },
      contact: {
        heading: 'Get In Touch',
        email: 'contact@example.com',
        showSocialLinks: true,
      },
      cta: {
        heading: 'Ready to work together?',
        description: 'Let\'s build something amazing',
        buttonText: 'Contact Me',
        buttonLink: '/contact',
      },
      stats: {
        stats: [
          { label: 'Projects', value: '50+' },
          { label: 'Clients', value: '30+' },
          { label: 'Years', value: '5+' },
        ],
      },
    };

    const suggestion = suggestions[sectionName.toLowerCase()];
    return suggestion ? JSON.stringify(suggestion, null, 2) : '{}';
  };

  const currentSectionName = watch('section');

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
          {/* Page */}
          <div>
            <Label htmlFor="page">Page *</Label>
            <Select
              id="page"
              options={pageOptionsList}
              {...register('page')}
              disabled={isLoading}
            />
            {formErrors.page && (
              <p className="text-coral text-sm mt-1">{formErrors.page.message}</p>
            )}
          </div>

          {/* Section */}
          <div>
            <Label htmlFor="section">Section Name *</Label>
            <Input
              id="section"
              placeholder="hero, about, services, etc."
              {...register('section')}
              disabled={isLoading}
            />
            {formErrors.section && (
              <p className="text-coral text-sm mt-1">{formErrors.section.message}</p>
            )}
            <p className="text-mist/50 text-xs mt-1">
              Lowercase, letters, numbers, hyphens only. Examples: hero, about, services, testimonials
            </p>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Section Title *</Label>
            <Input
              id="title"
              placeholder="Hero Section"
              {...register('title')}
              disabled={isLoading}
            />
            {formErrors.title && (
              <p className="text-coral text-sm mt-1">{formErrors.title.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-off-white">Section Content (JSON)</h3>
            <button
              type="button"
              onClick={() => {
                const suggested = getSuggestedContent(currentSectionName);
                setValue('content', JSON.parse(suggested));
              }}
              className="text-sm text-coral hover:underline disabled:opacity-50"
              disabled={isLoading || !currentSectionName}
            >
              Fill with Template
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="content">Content Configuration</Label>
            <p className="text-mist/50 text-xs mb-2">
              JSON object containing section-specific data. Click "Fill with Template" for a starting point.
            </p>
            <Textarea
              id="content"
              value={formatContentForDisplay()}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={15}
              disabled={isLoading}
              className="font-mono text-sm"
              placeholder='{
  "subtitle": "Building digital experiences",
  "description": "Full-stack developer...",
  "buttonText": "View Projects",
  "buttonLink": "/portfolio"
}'
            />
            {jsonError && (
              <p className="text-coral text-sm mt-1">{jsonError}</p>
            )}
          </div>

          {/* Content structure guide */}
          <div className="bg-navy-light/50 p-4 rounded-lg border border-mist/10">
            <p className="text-sm font-medium text-off-white mb-2">Common Section Types:</p>
            <ul className="text-xs text-mist/70 space-y-1">
              <li><code className="text-coral">hero</code> - subtitle, description, buttonText, buttonLink, backgroundImage</li>
              <li><code className="text-coral">about</code> - heading, description, skills[], image</li>
              <li><code className="text-coral">services</code> - heading, services[]</li>
              <li><code className="text-coral">testimonials</code> - heading, testimonials[]</li>
              <li><code className="text-coral">stats</code> - stats[]</li>
              <li><code className="text-coral">cta</code> - heading, description, buttonText, buttonLink</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-off-white">Settings</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enabled */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Enabled</Label>
              <p className="text-mist/50 text-xs">
                Show this section on the page
              </p>
            </div>
            <Toggle
              checked={watch('enabled')}
              onChange={(e) => setValue('enabled', e.target.checked as boolean)}
              disabled={isLoading}
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
            {formErrors.order && (
              <p className="text-coral text-sm mt-1">{formErrors.order.message}</p>
            )}
            <p className="text-mist/50 text-xs mt-1">
              Lower numbers appear first on the page
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
          disabled={isLoading || !!jsonError}
        >
          {isLoading ? 'Saving...' : isEdit ? 'Update Section' : 'Create Section'}
        </Button>
      </div>
    </form>
  );
}
