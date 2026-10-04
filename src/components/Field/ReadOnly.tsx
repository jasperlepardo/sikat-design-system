import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { FieldSize } from './FieldShell';
import '../../styles/components/field.css';
import './field.css';

export interface ReadOnlyProps {
  /** Value to display. Accepts any ReactNode — text, formatted numbers, badges, etc. */
  value: ReactNode;
  size?: FieldSize;
  className?: string;
}

/**
 * ReadOnly — a non-interactive field that displays a computed or locked value.
 * Renders the same shell as a disabled TextField so the appearance is identical.
 * Use inside `<FormField disabled>` so the label carries the lock icon.
 */
export function ReadOnly({ value, size = 'md', className }: ReadOnlyProps) {
  return (
    <span
      className={cn('sikat-field sikat-field--shell', className)}
      data-size={size}
      data-disabled
    >
      <span className="sikat-field__display">{value}</span>
    </span>
  );
}
