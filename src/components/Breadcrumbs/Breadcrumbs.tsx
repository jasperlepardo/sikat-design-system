import { useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import './breadcrumbs.css';

/** One step in the trail. The last item is the current page. */
export interface BreadcrumbItem {
  /** Stable key (defaults to the index). */
  id?: string;
  label: ReactNode;
  /** Where the crumb goes. Without it (and `onClick`) an ancestor renders as text. */
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /**
   * Longer trails keep the first item and the last `maxItems - 2`, folding the
   * middle into a "…" button that expands the full trail. Default 4.
   */
  maxItems?: number;
  /**
   * Called when a linked ancestor (one with `href` / `onClick`) is clicked — for client-side routing, call
   * `event.preventDefault()` and navigate with your router.
   */
  onNavigate?: (item: BreadcrumbItem, event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Breadcrumbs — the page's location trail (`<nav aria-label="Breadcrumb">`
 * around an ordered list). Ancestors are links in `text/caption` (underlined and
 * `text/heading` on hover); the current page is `text/heading` Semibold with
 * `aria-current="page"`. Separators are 16px chevrons in `fg/quarternary`. Long
 * trails collapse their middle into a "…" (default / link / 2xs Button). Place it
 * above a `<Panel>`.
 */
export function Breadcrumbs({
  items,
  maxItems = 4,
  onNavigate,
  className,
  'aria-label': ariaLabel = 'Breadcrumb',
  ...rest
}: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);
  const collapse = !expanded && items.length > Math.max(maxItems, 2);
  const tail = Math.max(maxItems - 2, 1);
  const visible: (BreadcrumbItem | 'ellipsis')[] = collapse
    ? [items[0], 'ellipsis', ...items.slice(-tail)]
    : items;

  return (
    <nav aria-label={ariaLabel} className={cn('sikat-breadcrumbs', className)} {...rest}>
      <ol className="sikat-breadcrumbs__list">
        {visible.map((item, i) => {
          const separator =
            i > 0 ? (
              <span className="sikat-breadcrumbs__separator" aria-hidden="true">
                <Icon size={16}>chevron_right</Icon>
              </span>
            ) : null;
          if (item === 'ellipsis')
            return (
              <li key="ellipsis" className="sikat-breadcrumbs__item">
                {separator}
                <Button
                  intent="default"
                  variant="link"
                  size="2xs"
                  aria-label={`Show ${items.length - 1 - tail} more`}
                  onClick={() => setExpanded(true)}
                >
                  …
                </Button>
              </li>
            );
          const current = item === items[items.length - 1];
          const linked = !current && (item.href != null || item.onClick != null);
          return (
            // Keyed by position, not `id`: two crumbs may share an id (a module
            // link that points at its own first page), and duplicate keys leave
            // stale crumbs behind when the trail changes.
            <li key={items.indexOf(item)} className="sikat-breadcrumbs__item">
              {separator}
              {current ? (
                <span className="sikat-breadcrumbs__current" aria-current="page">
                  {item.label}
                </span>
              ) : linked ? (
                <a
                  className="sikat-breadcrumbs__link"
                  href={item.href}
                  onClick={(e) => {
                    item.onClick?.(e);
                    onNavigate?.(item, e);
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <span className="sikat-breadcrumbs__text">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
