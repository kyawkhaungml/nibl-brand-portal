import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-soft',
      'transition-[border-color,box-shadow,transform] duration-150 placeholder:text-muted-foreground',
      'hover:border-foreground',
      'focus:border-foreground focus:shadow-flat-sm focus:outline-none focus:ring-2 focus:ring-foreground/15',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';
