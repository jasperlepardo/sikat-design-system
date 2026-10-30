import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactNode } from 'react';
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
  /**
   * Outer corner style of the joined pill — `pill` (fully rounded, default) or
   * `rounded` (button radius). Injected into the chips; only applies when `joined`.
   */
  shape?: 'pill' | 'rounded';
  /** One or more `<Chip>` elements (the group's values). */
  children?: ReactNode;
}

/**
 * Join the chip children: inject `data-attached` (first/middle/last/only) and the
 * group `shape` so each Chip flattens its own inner corners. The corner styling
 * lives in the Chip component — ChipGroup never styles `.sikat-chip`.
 */
function joinChildren(children: ReactNode, shape: 'pill' | 'rounded'): ReactNode {
  const items = Children.toArray(children).filter(isValidElement);
  const n = items.length;
  return items.map((child, i) => {
    const position = n === 1 ? 'only' : i === 0 ? 'first' : i === n - 1 ? 'last' : 'middle';
    const props: Record<string, unknown> = { shape, 'data-attached': position };
    return cloneElement(child, props);
  });
}

/**
 * ChipGroup — a filter token: an optional leading label paired with one or more
 * value `<Chip>`s (e.g. `Category is  [Laptops ×]`). With `joined`, the chips
 * attach into one big chip (segments sharing edges). Use it to group related
 * chips under a shared label, such as a condition in a filter bar. Pure
 * composition over `Chip`; no new tokens.
 */
export function ChipGroup({
  label,
  joined = false,
  shape = 'pill',
  className,
  children,
  ...rest
}: ChipGroupProps) {
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
      <span className="sikat-chip-group__values">
        {joined ? joinChildren(children, shape) : children}
      </span>
    </div>
  );
}
