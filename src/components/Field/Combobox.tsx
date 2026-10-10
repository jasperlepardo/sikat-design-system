import type { ReactNode } from 'react';
import { Select } from './Select';
import type { FieldAdornments, FieldSize } from './FieldShell';

export interface ComboboxOption {
  value: string;
  label?: ReactNode;
  /** Plain text for filtering + the closed display (when `label` is a node). */
  text?: string;
  subLabel?: ReactNode;
  subLabelPlacement?: 'top' | 'inline';
  /** Third line shown below the label in the dropdown (body/xs, muted). */
  description?: ReactNode;
  /** Text before the label in the dropdown item (text/muted). */
  prefix?: ReactNode;
  /** Text after the label in the dropdown item (text/muted). */
  suffix?: ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps extends FieldAdornments {
  options: ComboboxOption[];
  /** Controlled selected value (`null` = none). */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  /**
   * Show a ✕ while a value is set; clicking it resets to none and calls
   * `onValueChange(null)`, so the `placeholder` shows again. Use for optional
   * fields instead of a "None" option.
   */
  clearable?: boolean;
  size?: FieldSize;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Applied to the input, so a `<label htmlFor>` focuses it. */
  id?: string;
  className?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-invalid'?: boolean;
  /** Replaces the default "No results" message when the filtered list is empty.
   *  Pass a function to receive a `close` callback — use it to dismiss the dropdown
   *  before opening a modal or navigating away. */
  emptyContent?: ReactNode | ((close: () => void) => ReactNode);
  /** Always rendered at the bottom of the open dropdown, regardless of results. */
  footer?: ReactNode;
  /** Called whenever the filter query changes (the raw text the user is typing). */
  onQueryChange?: (query: string) => void;
}

/**
 * Combobox — a searchable, single-select picker: `<Select searchable>` with a
 * nullable value. The open panel covers the field and starts with a search
 * field over it; type to filter, ↑/↓ + Enter to choose, Escape to close.
 */
export function Combobox({
  value,
  defaultValue = null,
  onValueChange,
  placeholder,
  leadingIcon,
  prefix,
  suffix,
  trailingIcon,
  ...rest
}: ComboboxProps) {
  return (
    <Select
      {...rest}
      leadingIcon={leadingIcon}
      prefix={prefix}
      suffix={suffix}
      trailingIcon={trailingIcon}
      searchable
      placeholder={placeholder}
      searchPlaceholder={placeholder}
      value={value === undefined ? undefined : (value ?? '')}
      defaultValue={defaultValue ?? ''}
      onValueChange={(v) => onValueChange?.(v === '' ? null : v)}
    />
  );
}
