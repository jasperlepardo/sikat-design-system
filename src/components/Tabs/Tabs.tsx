import {
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { BadgeCounter } from '../Badge/Badge';
import './tabs.css';

export const tabsVariants = ['solid', 'outline'] as const;
export type TabsVariant = (typeof tabsVariants)[number];

export interface TabItem {
  value: string;
  label: ReactNode;
  /** 20px leading icon (Figma "Tab Icon"). */
  icon?: ReactNode;
  /** Badge Counter content (Figma "Show Badge"), e.g. `"+9"` or a number. */
  badge?: ReactNode;
  disabled?: boolean;
  /** id of the panel this tab controls (sets `aria-controls`). */
  controls?: string;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  /**
   * Figma "Style": Solid (filled chips — active is primary/muted with
   * text/primary and a primary badge) or Outline (no fill; a 3px accent bar
   * under the active tab, grey on hover).
   */
  variant?: TabsVariant;
  /** Controlled selected value. */
  value?: string;
  /** Initially selected value (uncontrolled); defaults to the first enabled tab. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Tabs — the Figma Tab Item row (Components › Tabs, 17251:5692): tabs with an
 * optional 20px icon, a 14/20 Medium label and a Badge Counter, over a 3px
 * accent bar. `variant="solid"` (default) renders filled chips with an inner
 * shadow — Default white, Hover `bg/quarternary`, Active `bg/primary-muted` with
 * `text/primary` text and a Primary badge, Disabled `bg/neutral-muted`.
 * `"outline"` drops the fill for a shared bottom divider and a per-tab accent
 * bar: `fg/primary` on the active tab, grey on hover. WAI-ARIA tabs: `tablist` /
 * `tab` with roving focus — ←/→/Home/End move and select, skipping disabled tabs.
 */
export function Tabs({
  items,
  variant = 'solid',
  value,
  defaultValue,
  onValueChange,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(
    () => defaultValue ?? items.find((t) => !t.disabled)?.value,
  );
  const selected = isControlled ? value : internal;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabled = items.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
    const pos = enabled.indexOf(index);
    const target =
      e.key === 'ArrowRight'
        ? enabled[(pos + 1) % enabled.length]
        : e.key === 'ArrowLeft'
          ? enabled[(pos - 1 + enabled.length) % enabled.length]
          : e.key === 'Home'
            ? enabled[0]
            : e.key === 'End'
              ? enabled[enabled.length - 1]
              : undefined;
    if (target === undefined) return;
    e.preventDefault();
    refs.current[target]?.focus();
    select(items[target].value);
  };

  // Roving tabindex: the selected tab (or the first enabled one) is focusable.
  const focusable = items.some((t) => t.value === selected && !t.disabled)
    ? selected
    : items.find((t) => !t.disabled)?.value;

  return (
    <div className={cn('sikat-tabs-scroll', className)} {...rest}>
      <div
        role="tablist"
        data-variant={variant}
        className="sikat-tabs"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        {items.map((tab, i) => {
          const active = tab.value === selected;
          return (
            <button
              key={tab.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${baseId}-tab-${i}`}
              type="button"
              role="tab"
              className="sikat-tabs__tab"
              aria-selected={active}
              aria-controls={tab.controls}
              disabled={tab.disabled}
              tabIndex={tab.value === focusable ? 0 : -1}
              onClick={() => select(tab.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="sikat-tabs__content">
                {tab.icon ? <span className="sikat-tabs__icon">{tab.icon}</span> : null}
                <span className="sikat-tabs__label">{tab.label}</span>
                {tab.badge != null ? (
                  <BadgeCounter
                    intent={variant === 'solid' && active ? 'primary' : 'default'}
                    variant="solid"
                  >
                    {tab.badge}
                  </BadgeCounter>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
