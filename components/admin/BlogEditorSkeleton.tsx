import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function BlogEditorSkeleton() {
  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-steel/30 rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-16 animate-pulse" />
            <div className="h-12 bg-steel/20 rounded-lg animate-pulse" />
          </div>
          {/* Slug */}
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-12 animate-pulse" />
            <div className="h-12 bg-steel/20 rounded-lg animate-pulse" />
          </div>
          {/* Excerpt */}
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-14 animate-pulse" />
            <div className="h-24 bg-steel/20 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Images Section */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-steel/30 rounded w-20 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-24 animate-pulse" />
            <div className="h-48 bg-steel/20 rounded-lg animate-pulse" />
          </div>
          {/* OG Image */}
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-32 animate-pulse" />
            <div className="h-48 bg-steel/20 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Content Section */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-steel/30 rounded w-20 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-16 animate-pulse" />
            <div className="h-96 bg-steel/20 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Category & Tags Section */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-steel/30 rounded w-40 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-14 animate-pulse" />
            <div className="h-12 bg-steel/20 rounded-lg animate-pulse" />
          </div>
          {/* Tags */}
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-12 animate-pulse" />
            <div className="h-12 bg-steel/20 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Publishing Section */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-steel/30 rounded w-24 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-14 animate-pulse" />
            <div className="h-12 bg-steel/20 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* SEO Section */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-steel/30 rounded w-32 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-20 animate-pulse" />
            <div className="h-12 bg-steel/20 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-steel/20 rounded w-28 animate-pulse" />
            <div className="h-24 bg-steel/20 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <div className="h-12 bg-steel/20 rounded-lg w-24 animate-pulse" />
        <div className="h-12 bg-coral/30 rounded-lg w-32 animate-pulse" />
      </div>
    </div>
  );
}
