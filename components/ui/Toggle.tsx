'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, checked, onChange, ...props }, ref) => (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          ref={ref}
          className="sr-only"
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <div className={cn(
          'w-12 h-6 rounded-full transition-colors duration-200',
          checked ? 'bg-coral' : 'bg-mist/30'
        )} />
        <div className={cn(
          'absolute top-0.5 left-0.5 w-5 h-5 bg-off-white rounded-full shadow transition-transform duration-200',
          checked && 'translate-x-6'
        )} />
      </div>
      {label && (
        <span className="text-sm text-mist">{label}</span>
      )}
    </label>
  )
);

Toggle.displayName = 'Toggle';
