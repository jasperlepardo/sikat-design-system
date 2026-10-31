import type { CSSProperties } from 'react';

/** A width value for the inline/responsive side-label column. Numbers are px. */
export type LabelWidth = number | string;

/**
 * Build the `--field-label-width` custom property for a field group. The CSS
 * (`src/components/Field/field.css`) reads it with a `12.5rem` fallback, and
 * because custom properties inherit, setting it on a `Form.Group` cascades to
 * every nested field's label column. Returns `undefined` when unset so the
 * fallback applies. Merge the result into the element's `style`.
 */
export function labelWidthStyle(labelWidth?: LabelWidth): CSSProperties | undefined {
  if (labelWidth == null) return undefined;
  const value = typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth;
  return { '--field-label-width': value } as CSSProperties;
}
