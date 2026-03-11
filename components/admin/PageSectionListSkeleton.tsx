import { Card, CardContent } from '@/components/ui/card';

export function PageSectionListSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 bg-mist/20 rounded animate-pulse" />
            <div className="h-4 w-20 bg-mist/10 rounded animate-pulse" />
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-24 bg-mist/10 rounded animate-pulse" />
                  <div className="h-6 w-48 bg-mist/20 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-mist/10 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-mist/10 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-mist/10 rounded animate-pulse" />
                  <div className="h-8 w-12 bg-mist/10 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-mist/10 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-mist/10 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
