import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PageSectionEditorSkeleton() {
  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-mist/20 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-mist/20 rounded animate-pulse" />
            <div className="h-12 w-full bg-mist/10 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-mist/20 rounded animate-pulse" />
            <div className="h-12 w-full bg-mist/10 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-mist/20 rounded animate-pulse" />
            <div className="h-12 w-full bg-mist/10 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Content Section */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-mist/20 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-mist/20 rounded animate-pulse" />
            <div className="h-64 w-full bg-mist/10 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-mist/20 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-mist/20 rounded animate-pulse" />
              <div className="h-3 w-48 bg-mist/10 rounded animate-pulse" />
            </div>
            <div className="h-6 w-12 bg-mist/20 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-28 bg-mist/20 rounded animate-pulse" />
            <div className="h-12 w-24 bg-mist/10 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <div className="h-10 w-24 bg-mist/10 rounded animate-pulse" />
        <div className="h-10 w-32 bg-coral/30 rounded animate-pulse" />
      </div>
    </div>
  );
}
