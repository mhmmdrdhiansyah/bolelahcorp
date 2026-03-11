'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  icon?: ReactNode;
  variant?: 'default' | 'not-found' | 'server-error' | 'network-error';
  className?: string;
}

// ============================================================================
// Icons for different error types
// ============================================================================

const ErrorIcons = {
  default: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  'not-found': (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>
  ),
  'server-error': (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  'network-error': (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
  ),
};

// ============================================================================
// Default Messages
// ============================================================================

const DefaultMessages = {
  default: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
  'not-found': {
    title: 'Not Found',
    message: 'The page or resource you are looking for does not exist.',
  },
  'server-error': {
    title: 'Server Error',
    message: 'Our servers are experiencing issues. Please try again later.',
  },
  'network-error': {
    title: 'Connection Error',
    message: 'Unable to connect. Please check your internet connection.',
  },
};

// ============================================================================
// Retry Button Component
// ============================================================================

interface RetryButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function RetryButton({ children, className, onClick }: RetryButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coral text-white hover:bg-coral-dark transition-colors font-semibold shadow-lg shadow-coral/20',
        className
      )}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      {children}
    </motion.button>
  );
}

// ============================================================================
// Error State Component
// ============================================================================

export function ErrorState({
  title,
  message,
  onRetry,
  retryText = 'Try Again',
  icon,
  variant = 'default',
  className,
}: ErrorStateProps) {
  const defaultConfig = DefaultMessages[variant];
  const displayTitle = title || defaultConfig.title;
  const displayMessage = message || defaultConfig.message;
  const displayIcon = icon || ErrorIcons[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-4',
        className
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: 'spring' }}
        className="text-coral/70 mb-6"
      >
        {displayIcon}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-off-white mb-3"
      >
        {displayTitle}
      </motion.h2>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-mist/70 max-w-md mb-8"
      >
        {displayMessage}
      </motion.p>

      {/* Retry Button */}
      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <RetryButton onClick={onRetry}>{retryText}</RetryButton>
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================================================
// Inline Error Component (smaller, for cards/sections)
// ============================================================================

interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400',
        className
      )}
      role="alert"
    >
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm">{message}</span>
    </div>
  );
}

// ============================================================================
// 404 Page Component
// ============================================================================

export function NotFound404({
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist or has been moved.',
  showBackButton = true,
  homeHref = '/',
  className,
}: {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  homeHref?: string;
  className?: string;
}) {
  return (
    <div className={cn('min-h-[60vh] flex items-center justify-center', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        {/* 404 Number */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-8xl md:text-9xl font-black text-coral/20 mb-4"
        >
          404
        </motion.h1>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-coral mb-6"
        >
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-off-white mb-3"
        >
          {title}
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-mist/70 max-w-md mx-auto mb-8"
        >
          {message}
        </motion.p>

        {/* Back Button */}
        {showBackButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href={homeHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coral text-white hover:bg-coral-dark transition-colors font-semibold shadow-lg shadow-coral/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
