import { createPortal } from 'react-dom';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { DropdownAnchor } from '../../lib/useDropdown';
import './dropdown.css';

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /** ARIA role for the panel (default `listbox`). */
  role?: 'listbox' | 'menu';
  /** Sets `aria-multiselectable` (e.g. MultiSelect). */
  multiselectable?: boolean;
  /**
   * When provided, portals the panel to `document.body` using `position: fixed`.
   * Pass `anchor` from `useDropdown` to fix clipping inside tables or
   * `overflow: hidden` containers.
   */
  anchor?: DropdownAnchor | null;
  /** Vertical side — `'bottom'` (default) or `'top'`. Pass `side` from `useDropdown`. */
  side?: 'top' | 'bottom';
  /** Horizontal alignment — `'left'` (default) or `'right'`. Pass `hSide` from `useDropdown`. */
  hSide?: 'left' | 'right';
  children: ReactNode;
}

/**
 * Dropdown — the floating panel of a listbox/menu (the items container). Pair
 * with `useDropdown` (open/close, outside-click, Escape) and `useListbox`
 * (keyboard model).
 *
 * Default: renders absolutely inside a `position: relative` root.
 * Portaled: pass `anchor` + `side` from `useDropdown` to escape clipping
 * containers (tables, `overflow: hidden` wrappers).
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  {
    role = 'listbox',
    multiselectable,
    anchor,
    side = 'bottom',
    hSide = 'left',
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  let fixedStyle: React.CSSProperties | undefined = style;
  if (anchor) {
    const w =
      typeof style?.width === 'number'
        ? style.width
        : typeof style?.width === 'string'
          ? parseFloat(style.width)
          : anchor.width;
    fixedStyle = {
      position: 'fixed',
      width: w,
      left: hSide === 'left' ? anchor.left : anchor.right - w,
      right: 'auto',
      ...(side === 'bottom'
        ? { top: anchor.bottom + 4, bottom: 'auto' }
        : { top: 'auto', bottom: window.innerHeight - anchor.top + 4 }),
      maxHeight: Math.max(
        80,
        side === 'bottom' ? window.innerHeight - anchor.bottom - 8 : anchor.top - 8,
      ),
      ...style,
    };
  }

  const panel = (
    <div
      ref={ref}
      role={role}
      aria-multiselectable={multiselectable || undefined}
      data-side={side}
      data-theme={anchor?.theme}
      className={cn('sikat-dropdown', anchor && 'sikat-dropdown--fixed', className)}
      style={fixedStyle}
      {...rest}
    >
      {children}
    </div>
  );

  if (anchor) return createPortal(panel, document.body);
  return panel;
});

export interface DropdownItemProps {
  id?: string;
  /** Leading icon / media (20px, fg/primary) — Figma "Show Leading". */
  leadingIcon?: ReactNode;
  /** Text before the label (text/muted) — Figma "Prefix". */
  prefix?: ReactNode;
  /** Text after the label (text/muted) — Figma "Suffix". */
  suffix?: ReactNode;
  /** Trailing icon / media (20px, fg/primary) — Figma "Show Trailing". */
  trailingIcon?: ReactNode;
  /** Short secondary text: `'top'` renders it above the label, `'inline'` renders it after (default `'top'`). */
  subLabel?: ReactNode;
  subLabelPlacement?: 'top' | 'inline';
  /** Third line below the label (body/xs, muted). */
  description?: ReactNode;
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
  subLabel,
  subLabelPlacement = 'top',
  description,
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
      className={cn('sikat-dropdown__item', className)}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onSelect?.();
      }}
    >
      {leadingIcon ? <span className="sikat-dropdown__icon">{leadingIcon}</span> : null}
      {prefix != null ? <span className="sikat-dropdown__affix">{prefix}</span> : null}
      <span className="sikat-dropdown__label">
        {subLabel != null && subLabelPlacement === 'top' ? (
          <span className="sikat-dropdown__sublabel">{subLabel}</span>
        ) : null}
        {children}
        {subLabel != null && subLabelPlacement === 'inline' ? (
          <span className="sikat-dropdown__sublabel">{subLabel}</span>
        ) : null}
        {description != null ? (
          <span className="sikat-dropdown__description">{description}</span>
        ) : null}
      </span>
      {suffix != null ? <span className="sikat-dropdown__affix">{suffix}</span> : null}
      {trailingIcon ? <span className="sikat-dropdown__icon">{trailingIcon}</span> : null}
    </div>
  );
}
