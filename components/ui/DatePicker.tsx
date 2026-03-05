'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, ...props }, ref) => (
    <input
      type="date"
      ref={ref}
      className={cn(
        'w-full px-4 py-3 rounded-lg border-2 border-mist/30 bg-steel/20',
        'text-off-white placeholder-mist/50',
        'focus:outline-none focus:border-coral transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        '[&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert',
        className
      )}
      {...props}
    />
  )
);

DatePicker.displayName = 'DatePicker';
