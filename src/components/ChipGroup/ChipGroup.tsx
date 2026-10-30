import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import './chip-group.css';

export interface ChipGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional leading label that names the group, e.g. "Category is". */
  label?: ReactNode;
  /**
   * Join the value chips flush into one connected pill (shared edges, only the
   * outer corners rounded) — e.g. `[ Category | Laptops ]` as a single big chip.
   */
  joined?: boolean;
  /** One or more `<Chip>` elements (the group's values). */
  children?: ReactNode;
}

/**
 * ChipGroup — a filter token: an optional leading label paired with one or more
 * value `<Chip>`s (e.g. `Category is  [Laptops ×]`). With `joined`, the chips
 * attach into one big chip (segments sharing edges). Use it to group related
 * chips under a shared label, such as a condition in a filter bar. Pure
 * composition over `Chip`; no new tokens.
 */
export function ChipGroup({ label, joined = false, className, children, ...rest }: ChipGroupProps) {
  const ariaLabel = typeof label === 'string' ? label : undefined;
  return (
    <div
      className={cn('sikat-chip-group', className)}
      role="group"
      aria-label={ariaLabel}
      data-joined={joined || undefined}
      {...rest}
    >
      {label != null ? <span className="sikat-chip-group__label">{label}</span> : null}
      <span className="sikat-chip-group__values">{children}</span>
    </div>
  );
}
