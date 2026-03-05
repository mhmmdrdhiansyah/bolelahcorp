import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-sm font-medium text-mist mb-1', className)}
      {...props}
    >
      {children}
    </label>
  )
);

Label.displayName = 'Label';
