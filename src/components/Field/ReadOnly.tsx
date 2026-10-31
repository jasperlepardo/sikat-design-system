import type { ReactNode } from 'react';
import { FieldShell, type FieldSize } from './FieldShell';
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
 * ReadOnly — a non-interactive field that displays a computed value.
 * Renders the borderless read-only shell (Figma Read-only: no border, no
 * background, dark value text, flush). Use inside a plain `<FormField>` (no
 * `disabled`) so the label stays plain — Figma's read-only has no lock icon.
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
    <FieldShell
      className={className}
      state={{ size, filled: value != null, readOnly: true }}
      adornments={{}}
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
    </FieldShell>
  );
}
