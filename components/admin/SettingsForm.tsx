'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { settingsSchema, type SiteSettings, defaultSettings, settingsCategories } from '@/lib/validations/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Alert } from '@/components/ui/Alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SettingsFormProps {
  initialSettings?: SiteSettings;
  onSuccess?: () => void;
}

export function SettingsForm({ initialSettings, onSuccess }: SettingsFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, dirtyFields },
    watch,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialSettings || defaultSettings,
    mode: 'onBlur',
  });

  // Watch for changes
  useEffect(() => {
    const subscription = watch(() => {
      setHasChanges(Object.keys(dirtyFields).length > 0);
    });
    return () => subscription.unsubscribe();
  }, [watch, dirtyFields]);

  // Reset form when initialSettings changes
  useEffect(() => {
    if (initialSettings) {
      reset(initialSettings);
    }
  }, [initialSettings, reset]);

  // Scroll to error when errors occur
  useEffect(() => {
    if (errors.length > 0 && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [errors]);

  const onSubmit = async (data: SiteSettings) => {
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: data }),
      });

      const result = await response.json();

      if (!response.ok) {
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

        throw new Error(result.message || 'Failed to save settings. Please try again.');
      }

      // Success
      setHasChanges(false);
      onSuccess?.();
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

  const handleReset = () => {
    reset(initialSettings || defaultSettings);
    setHasChanges(false);
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

      {/* Tab Navigation */}
      <div className="border-b border-mist/20">
        <nav className="flex gap-6">
          {settingsCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveTab(category.id)}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === category.id
                  ? 'border-coral text-off-white'
                  : 'border-transparent text-mist hover:text-off-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-lg font-semibold text-off-white">General Settings</h3>
              <p className="text-sm text-mist/50 mt-1">Basic site information</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Site Name */}
            <div>
              <Label htmlFor="site.name">Site Name *</Label>
              <Input
                id="site.name"
                placeholder="Bolehah Corp"
                {...register('site.name')}
                disabled={isLoading}
              />
              {formErrors['site.name'] && (
                <p className="text-coral text-sm mt-1">{formErrors['site.name'].message as string}</p>
              )}
            </div>

            {/* Site Description */}
            <div>
              <Label htmlFor="site.description">Site Description</Label>
              <Textarea
                id="site.description"
                placeholder="Professional portfolio and tech blog"
                rows={3}
                {...register('site.description')}
                disabled={isLoading}
              />
            </div>

            {/* Site Logo */}
            <div>
              <Label htmlFor="site.logo">Site Logo URL</Label>
              <Input
                id="site.logo"
                type="url"
                placeholder="/images/logo.png"
                {...register('site.logo')}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'contact' && (
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-lg font-semibold text-off-white">Contact Settings</h3>
              <p className="text-sm text-mist/50 mt-1">Contact information displayed on the site</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="contact.email">Email Address</Label>
              <Input
                id="contact.email"
                type="email"
                placeholder="contact@example.com"
                {...register('contact.email')}
                disabled={isLoading}
              />
              {formErrors['contact.email'] && (
                <p className="text-coral text-sm mt-1">{formErrors['contact.email'].message as string}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="contact.phone">Phone Number</Label>
              <Input
                id="contact.phone"
                type="tel"
                placeholder="+62 123 4567 8900"
                {...register('contact.phone')}
                disabled={isLoading}
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="contact.address">Address</Label>
              <Textarea
                id="contact.address"
                placeholder="Jakarta, Indonesia"
                rows={3}
                {...register('contact.address')}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'social' && (
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-lg font-semibold text-off-white">Social Media Links</h3>
              <p className="text-sm text-mist/50 mt-1">Links to your social media profiles</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* GitHub */}
            <div>
              <Label htmlFor="social.github">GitHub URL</Label>
              <Input
                id="social.github"
                type="url"
                placeholder="https://github.com/username"
                {...register('social.github')}
                disabled={isLoading}
              />
              {formErrors['social.github'] && (
                <p className="text-coral text-sm mt-1">{formErrors['social.github'].message as string}</p>
              )}
            </div>

            {/* LinkedIn */}
            <div>
              <Label htmlFor="social.linkedin">LinkedIn URL</Label>
              <Input
                id="social.linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
                {...register('social.linkedin')}
                disabled={isLoading}
              />
              {formErrors['social.linkedin'] && (
                <p className="text-coral text-sm mt-1">{formErrors['social.linkedin'].message as string}</p>
              )}
            </div>

            {/* Twitter */}
            <div>
              <Label htmlFor="social.twitter">Twitter/X URL</Label>
              <Input
                id="social.twitter"
                type="url"
                placeholder="https://twitter.com/username"
                {...register('social.twitter')}
                disabled={isLoading}
              />
              {formErrors['social.twitter'] && (
                <p className="text-coral text-sm mt-1">{formErrors['social.twitter'].message as string}</p>
              )}
            </div>

            {/* Instagram */}
            <div>
              <Label htmlFor="social.instagram">Instagram URL</Label>
              <Input
                id="social.instagram"
                type="url"
                placeholder="https://instagram.com/username"
                {...register('social.instagram')}
                disabled={isLoading}
              />
              {formErrors['social.instagram'] && (
                <p className="text-coral text-sm mt-1">{formErrors['social.instagram'].message as string}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'seo' && (
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-lg font-semibold text-off-white">SEO Settings</h3>
              <p className="text-sm text-mist/50 mt-1">Search engine optimization settings</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Meta Title */}
            <div>
              <Label htmlFor="seo.metaTitle">Meta Title</Label>
              <Input
                id="seo.metaTitle"
                placeholder="Bolehah Corp - Portfolio & Tech Blog"
                {...register('seo.metaTitle')}
                disabled={isLoading}
              />
              <p className="text-mist/50 text-xs mt-1">
                Recommended: 50-60 characters. Leave empty to use site name.
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <Label htmlFor="seo.metaDescription">Meta Description</Label>
              <Textarea
                id="seo.metaDescription"
                placeholder="Professional portfolio and tech blog showcasing web development projects..."
                rows={3}
                {...register('seo.metaDescription')}
                disabled={isLoading}
              />
              <p className="text-mist/50 text-xs mt-1">
                Recommended: 150-160 characters.
              </p>
            </div>

            {/* Google Analytics */}
            <div>
              <Label htmlFor="seo.googleAnalytics">Google Analytics ID</Label>
              <Input
                id="seo.googleAnalytics"
                placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                {...register('seo.googleAnalytics')}
                disabled={isLoading}
              />
              <p className="text-mist/50 text-xs mt-1">
                Enter your Google Analytics tracking ID (e.g., G-XXXXXXXXXX)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-between items-center">
        {hasChanges && (
          <span className="text-sm text-coral">
            You have unsaved changes
          </span>
        )}
        {!hasChanges && <span />}
        <div className="flex gap-4">
          {hasChanges && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </form>
  );
}
