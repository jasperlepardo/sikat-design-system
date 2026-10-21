/**
 * The option model shared by every option-based field control (Select,
 * Combobox, MultiSelect, Autocomplete, CardField's list, AffixSelect) and the
 * one place an option becomes a Dropdown row. Add an option feature here and
 * every control gets it.
 */
import type { ReactNode } from 'react';
import { DropdownItem } from '../Dropdown/Dropdown';

export interface FieldOption {
  value: string;
  label?: ReactNode;
  /** Plain text for type-ahead + the closed display (when `label` is a node). */
  text?: string;
  /**
   * Leading media for the option — an `<Icon>`, `<Avatar>` or `<DecorativeIcon>`.
   * Shown in its dropdown row and, when selected, in the field's leading slot
   * (unless the field sets its own `leadingIcon`).
   */
  icon?: ReactNode;
  /** Short secondary text shown in the dropdown. */
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

/** Plain text of an option: `text`, else a string `label`, else its `value`. */
export const optionText = (o: FieldOption) =>
  o.text ?? (typeof o.label === 'string' ? o.label : o.value);

/** A bare string is shorthand for `{ value }`. */
export const toOption = (o: FieldOption | string): FieldOption =>
  typeof o === 'string' ? { value: o } : o;

/** One option as a Dropdown row. */
export function OptionItem({
  option: o,
  id,
  selected,
  active,
  trailingIcon,
  onSelect,
}: {
  option: FieldOption;
  id: string;
  selected?: boolean;
  active?: boolean;
  /** Row-level trailing media (e.g. MultiSelect's check). */
  trailingIcon?: ReactNode;
  onSelect: () => void;
}) {
  return (
    <DropdownItem
      id={id}
      selected={selected}
      active={active}
      disabled={o.disabled}
      leadingIcon={o.icon}
      prefix={o.prefix}
      suffix={o.suffix}
      subLabel={o.subLabel}
      subLabelPlacement={o.subLabelPlacement}
      description={o.description}
      trailingIcon={trailingIcon}
      onSelect={onSelect}
    >
      {o.label ?? optionText(o)}
    </DropdownItem>
  );
}
