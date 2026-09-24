import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import './dropdown.css';

export interface DropdownProps {
  id?: string;
  /** ARIA role for the panel (default `listbox`). */
  role?: 'listbox' | 'menu';
  /** Sets `aria-multiselectable` (e.g. MultiSelect). */
  multiselectable?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Dropdown — the floating panel of a listbox/menu (the items container). Pair
 * with `useDropdown` (open/close, outside-click, Escape) and `useListbox`
 * (keyboard model). Render it inside a `position: relative` root that also holds
 * the trigger.
 */
export function Dropdown({
  id,
  role = 'listbox',
  multiselectable,
  className,
  children,
}: DropdownProps) {
  return (
    <div
      id={id}
      role={role}
      aria-multiselectable={multiselectable || undefined}
      className={cn('jspr-dropdown', className)}
    >
      {children}
    </div>
  );
}

export interface DropdownItemProps {
  id?: string;
  /** Leading icon / media (24px, fg/primary) — Figma "Show Leading". */
  leadingIcon?: ReactNode;
  /** Text before the label (text/muted) — Figma "Prefix". */
  prefix?: ReactNode;
  /** Text after the label (text/muted) — Figma "Suffix". */
  suffix?: ReactNode;
  /** Trailing icon / media (24px, fg/primary) — Figma "Show Trailing". */
  trailingIcon?: ReactNode;
  selected?: boolean;
  /** Keyboard-highlighted (drives `aria-activedescendant` styling). */
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
  children: ReactNode;
}

/**
 * DropdownItem — a single selectable row (Figma Dropdown Item): optional leading
 * / trailing icon and prefix / suffix around the label; hover or keyboard-active
 * tints it primary-subtle, `selected` bolds the label. Uses `onMouseDown` +
 * preventDefault so selecting doesn't blur (and close) the trigger first.
 */
export function DropdownItem({
  id,
  leadingIcon,
  prefix,
  suffix,
  trailingIcon,
  selected,
  active,
  disabled,
  onSelect,
  className,
  children,
}: DropdownItemProps) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      data-active={active ? 'true' : undefined}
      className={cn('jspr-dropdown__item', className)}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onSelect?.();
      }}
    >
      {leadingIcon ? <span className="jspr-dropdown__icon">{leadingIcon}</span> : null}
      {prefix != null ? <span className="jspr-dropdown__affix">{prefix}</span> : null}
      <span className="jspr-dropdown__label">{children}</span>
      {suffix != null ? <span className="jspr-dropdown__affix">{suffix}</span> : null}
      {trailingIcon ? <span className="jspr-dropdown__icon">{trailingIcon}</span> : null}
    </div>
  );
}
