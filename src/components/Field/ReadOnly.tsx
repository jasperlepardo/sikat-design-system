import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { FieldSize } from './FieldShell';
import '../../styles/components/field.css';
import './field.css';

export interface ReadOnlyProps {
  /** Value to display. Accepts any ReactNode — text, formatted numbers, badges, etc. */
  value: ReactNode;
  subLabel?: ReactNode;
  subLabelPlacement?: 'top' | 'inline';
  /** Third line below the value (body/xs, muted). */
  description?: ReactNode;
  size?: FieldSize;
  className?: string;
}

/**
 * ReadOnly — a non-interactive field that displays a computed or locked value.
 * Renders the same shell as a disabled TextField so the appearance is identical.
 * Use inside `<FormField disabled>` so the label carries the lock icon.
 */
export function ReadOnly({
  value,
  subLabel,
  subLabelPlacement = 'top',
  description,
  size = 'md',
  className,
}: ReadOnlyProps) {
  const hasExtra = subLabel != null || description != null;
  return (
    <span
      className={cn('sikat-field sikat-field--shell', className)}
      data-size={size}
      data-disabled
    >
      <span className="sikat-field__display">
        {hasExtra ? (
          <span className="sikat-field__multiline">
            {subLabel != null && subLabelPlacement === 'top' ? (
              <span className="sikat-field__sublabel">{subLabel}</span>
            ) : null}
            <span>{value}</span>
            {subLabel != null && subLabelPlacement === 'inline' ? (
              <span className="sikat-field__sublabel">{subLabel}</span>
            ) : null}
            {description != null ? (
              <span className="sikat-field__description">{description}</span>
            ) : null}
          </span>
        ) : (
          value
        )}
      </span>
    </span>
  );
}
