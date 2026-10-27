import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import './choice.css';

// Mirrors the Figma Toggle › Type axis (Pill / Soft Edge).
export const toggleShapes = ['pill', 'soft-edge'] as const;
export type ToggleShape = (typeof toggleShapes)[number];

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Track and thumb corners: fully round (`pill`) or 6px (`soft-edge`). */
  shape?: ToggleShape;
  /** Inline label rendered after the switch. */
  children?: ReactNode;
}

/**
 * Toggle — the Figma Toggle (20855:130165): a 32×20 on/off switch (a native checkbox
 * with `role="switch"`; Default / Hover / Active / Disable / Read-Only) with an
 * optional inline label. `readOnly` keeps the value visible but blocks changes.
 */
export function Toggle({
  shape = 'pill',
  readOnly,
  children,
  className,
  disabled,
  onClick,
  ...rest
}: ToggleProps) {
  return (
    <label
      className={cn(
        'inline-flex select-none items-center gap-2',
        disabled ? 'cursor-not-allowed' : !readOnly && 'cursor-pointer',
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        className="sikat-switch"
        data-shape={shape}
        disabled={disabled}
        aria-readonly={readOnly || undefined}
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
