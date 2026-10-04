import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Inline label rendered after the dot. */
  children?: ReactNode;
}

/** Radio — a native radio with an optional inline label. */
export function Radio({ children, className, disabled, ...rest }: RadioProps) {
  return (
    <label
      className={cn(
        'inline-flex select-none items-center gap-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <input type="radio" disabled={disabled} className="size-4 accent-primary" {...rest} />
      {children != null ? <span className="text-sm text-body">{children}</span> : null}
    </label>
  );
}
