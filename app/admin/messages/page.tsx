import { Suspense } from 'react';
import { MessageList } from '@/components/admin/MessageList';
import { MessageListSkeleton } from '@/components/admin/MessageListSkeleton';

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessageListSkeleton />}>
      <MessageList />
    </Suspense>
  );
}
