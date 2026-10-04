import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Inline label rendered after the box. */
  children?: ReactNode;
}

/** Checkbox — a native checkbox with an optional inline label. */
export function Checkbox({ children, className, disabled, ...rest }: CheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex select-none items-center gap-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <input type="checkbox" disabled={disabled} className="size-4 accent-primary" {...rest} />
      {children != null ? <span className="text-sm text-body">{children}</span> : null}
    </label>
  );
}
