import { Suspense } from 'react';
import { PageSectionEditor } from '@/components/admin/PageSectionEditor';
import { PageSectionEditorSkeleton } from '@/components/admin/PageSectionEditorSkeleton';

export default function NewPageSectionPage() {
  return (
    <Suspense fallback={<PageSectionEditorSkeleton />}>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-off-white">New Page Section</h1>
          <p className="text-mist/50 mt-1">Create a new content section for your landing pages</p>
        </div>
        <PageSectionEditor />
      </div>
    </Suspense>
  );
}
