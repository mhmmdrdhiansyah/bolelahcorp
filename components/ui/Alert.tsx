'use client';

import { cn } from '@/lib/utils';

export interface AlertProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', children, className }: AlertProps) {
  const variants = {
    error: 'bg-coral/20 border-coral/50 text-coral',
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    info: 'bg-steel/20 border-steel/50 text-mist',
  };

  return (
    <div className={cn('p-4 rounded-lg border', variants[variant], className)}>
      {children}
    </div>
  );
}
