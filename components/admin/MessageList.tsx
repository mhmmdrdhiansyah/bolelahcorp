'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from './ConfirmDialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

interface MessageListResponse {
  success: boolean;
  data: {
    messages: ContactMessage[];
    total: number;
    unreadCount: number;
  };
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
};

export function MessageList() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    messageId: string;
    messageName: string;
  }>({ isOpen: false, messageId: '', messageName: '' });
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/admin/messages', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const result: MessageListResponse = await response.json();
        setMessages(result.data.messages);
        setFilteredMessages(result.data.messages);
        setUnreadCount(result.data.unreadCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Filter messages based on search and unread status
  useEffect(() => {
    let filtered = messages;

    if (filterUnreadOnly) {
      filtered = filtered.filter(m => !m.read);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.subject?.toLowerCase().includes(query) ||
          m.message.toLowerCase().includes(query)
      );
    }

    setFilteredMessages(filtered);
  }, [searchQuery, filterUnreadOnly, messages]);

  // Mark as read
  const handleMarkAsRead = async (id: string) => {
    setActionLoading(id);
    setError('');

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }

      // Update local state
      const updated = messages.map((m) =>
        m.id === id ? { ...m, read: true } : m
      );
      setMessages(updated);

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    } finally {
      setActionLoading(null);
    }
  };

  // Mark as replied
  const handleMarkAsReplied = async (id: string) => {
    setActionLoading(id);
    setError('');

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replied: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark as replied');
      }

      // Update local state
      const updated = messages.map((m) =>
        m.id === id ? { ...m, replied: true } : m
      );
      setMessages(updated);

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as replied');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete message
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    setError('');

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      // Update local state
      const deletedMessage = messages.find(m => m.id === id);
      const updated = messages.filter((m) => m.id !== id);
      setMessages(updated);

      // Update unread count if deleted message was unread
      if (deletedMessage && !deletedMessage.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Close detail view if deleting selected message
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    } finally {
      setActionLoading(null);
    }
  };

  // View message details
  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    // Auto-mark as read when viewing
    if (!message.read) {
      handleMarkAsRead(message.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-off-white">Messages</h2>
        </div>
        <div className="h-12 bg-white/10 rounded-lg animate-pulse max-w-md" />
        <div className="bg-steel/30 rounded-xl border border-mist/20 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-coral border-r-transparent mb-4" />
          <p className="text-mist">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-off-white">Messages</h2>
          <p className="text-mist text-sm mt-1">
            {unreadCount > 0 && (
              <span className="text-coral font-semibold">{unreadCount} unread</span>
            )}
            {unreadCount > 0 && filteredMessages.length > 0 && ' • '}
            {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
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
          placeholder="Search by name, email, or message..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md flex-1"
        />
        <label className="flex items-center gap-2 text-sm text-mist cursor-pointer">
          <input
            type="checkbox"
            checked={filterUnreadOnly}
            onChange={(e) => setFilterUnreadOnly(e.target.checked)}
            className="w-4 h-4 rounded border-mist/30 bg-white/5 text-coral focus:ring-coral"
          />
          Unread only
        </label>
      </div>

      {/* Empty state */}
      {filteredMessages.length === 0 && (
        <div className="bg-steel/30 rounded-xl border border-mist/20 p-12 text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h3 className="text-lg font-semibold text-off-white mb-2">
            {searchQuery || filterUnreadOnly ? 'No messages found' : 'No messages yet'}
          </h3>
          <p className="text-mist">
            {searchQuery || filterUnreadOnly
              ? 'Try adjusting your filters'
              : 'Messages from the contact form will appear here'}
          </p>
        </div>
      )}

      {/* Messages list */}
      {filteredMessages.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Message list */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => handleViewMessage(message)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedMessage?.id === message.id
                    ? 'bg-coral/10 border-coral/30'
                    : message.read
                    ? 'bg-steel/20 border-mist/10 hover:bg-white/5'
                    : 'bg-white/5 border-coral/30 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-off-white truncate">
                        {message.name}
                      </p>
                      {!message.read && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-coral" />
                      )}
                    </div>
                    <p className="text-xs text-mist truncate">{message.email}</p>
                    {message.subject && (
                      <p className="text-sm text-mist/80 truncate mt-1">
                        {message.subject}
                      </p>
                    )}
                    <p className="text-xs text-mist/50 mt-2">
                      {formatRelativeTime(message.createdAt)}
                    </p>
                  </div>
                  {message.replied && (
                    <span className="flex-shrink-0 text-green-400" title="Replied">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-steel/30 rounded-xl border border-mist/20 p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-mist/10">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-off-white mb-1">
                      {selectedMessage.subject || '(No Subject)'}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-mist mt-2">
                      <span>From: <span className="text-off-white">{selectedMessage.name}</span></span>
                      <span>{selectedMessage.email}</span>
                    </div>
                    <p className="text-xs text-mist/50 mt-2">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || ''}`}
                      className="px-3 py-2 rounded-lg bg-coral/20 text-coral hover:bg-coral hover:text-white transition-colors text-sm font-medium"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>

                {/* Message body */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-mist mb-2">Message:</h4>
                  <div className="bg-white/5 rounded-lg p-4 text-off-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Status badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedMessage.read
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-coral/20 text-coral border border-coral/30'
                  }`}>
                    {selectedMessage.read ? '✓ Read' : 'Unread'}
                  </span>
                  {selectedMessage.replied && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      ✓ Replied
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {!selectedMessage.read && (
                    <Button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      disabled={actionLoading === selectedMessage.id}
                      variant="secondary"
                      className="text-sm"
                    >
                      Mark as Read
                    </Button>
                  )}
                  {!selectedMessage.replied && (
                    <Button
                      onClick={() => handleMarkAsReplied(selectedMessage.id)}
                      disabled={actionLoading === selectedMessage.id}
                      variant="secondary"
                      className="text-sm"
                    >
                      Mark as Replied
                    </Button>
                  )}
                  <button
                    onClick={() =>
                      setDeleteDialog({
                        isOpen: true,
                        messageId: selectedMessage.id,
                        messageName: selectedMessage.name,
                      })
                    }
                    disabled={actionLoading === selectedMessage.id}
                    className="px-4 py-2 rounded-lg bg-coral/10 text-coral hover:bg-coral hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-steel/30 rounded-xl border border-mist/20 p-12 text-center">
                <div className="text-4xl mb-4">📨</div>
                <h3 className="text-lg font-semibold text-off-white mb-2">
                  Select a message
                </h3>
                <p className="text-mist">
                  Choose a message from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={() => handleDelete(deleteDialog.messageId)}
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${deleteDialog.messageName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
