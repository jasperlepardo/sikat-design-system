import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import './choice.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Inline label rendered after the dot. */
  children?: ReactNode;
}

/**
 * Radio — the Figma Radio (20855:138378): a 20px native radio (Default / Hover /
 * Active / Disable / Read-Only) with an optional inline label. `readOnly` keeps the
 * value visible but blocks changes.
 */
export function Radio({ readOnly, children, className, disabled, onClick, ...rest }: RadioProps) {
  return (
    <label
      className={cn(
        'inline-flex select-none items-center gap-2',
        disabled ? 'cursor-not-allowed' : !readOnly && 'cursor-pointer',
        className,
      )}
    >
      <input
        type="radio"
        className="sikat-radio"
        disabled={disabled}
        data-readonly={readOnly || undefined}
        onClick={readOnly ? (e) => e.preventDefault() : onClick}
        {...rest}
      />
      {children != null ? (
        <span className={cn('text-sm', disabled ? 'text-disabled' : 'text-body')}>{children}</span>
      ) : null}
    </label>
  );
}
