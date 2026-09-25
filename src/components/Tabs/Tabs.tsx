import {
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { BadgeCounter } from '../Badge/BadgeCounter';
import './tabs.css';

export const tabsVariants = ['primary', 'secondary'] as const;
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
  /** Figma "Type": Primary (filled primary active tab) or Secondary (white). */
  variant?: TabsVariant;
  /** Controlled selected value. */
  value?: string;
  /** Initially selected value (uncontrolled); defaults to the first enabled tab. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Tabs — the Figma `tabs` bar of `tab-button`s (Components › Tabs): a
 * `bg/tertiary` track (2px padding and gap, 12px radius, inner shadow) holding
 * 32px tabs — optional 20px icon, 14/20 Medium label and a Badge Counter. Default
 * tabs are transparent, Hover `bg/quarternary`, Disabled white with muted text;
 * the Active tab is primary with white text (`variant="primary"`) or white with
 * body text (`"secondary"`), lifted by Shadow/Default, and its badge turns
 * Primary / Ghost. WAI-ARIA tabs: `tablist` / `tab` with roving focus —
 * ←/→/Home/End move and select, skipping disabled tabs.
 */
export function Tabs({
  items,
  variant = 'primary',
  value,
  defaultValue,
  onValueChange,
  className,
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
    <div role="tablist" data-variant={variant} className={cn('sikat-tabs', className)} {...rest}>
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
            {tab.icon ? <span className="sikat-tabs__icon">{tab.icon}</span> : null}
            <span className="sikat-tabs__label">{tab.label}</span>
            {tab.badge != null ? (
              <BadgeCounter
                intent={active ? 'primary' : 'default'}
                variant={active ? 'ghost' : 'solid'}
              >
                {tab.badge}
              </BadgeCounter>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
