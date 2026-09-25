import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import chevronRight from './assets/keyboard-arrow-right.svg';
import chevronDown from './assets/keyboard-arrow-down.svg';
import connectorActive from './assets/connector-active.svg';
import dividerLine from './assets/divider.svg';
import './side-nav.css';

export const sideNavOrientations = ['expanded', 'compact'] as const;
export type SideNavOrientation = (typeof sideNavOrientations)[number];

export interface SideNavItem {
  id: string;
  label: string;
  /** 20px leading icon (e.g. `<SideNavIcon src={…} />`). */
  icon?: ReactNode;
  /** Renders the row as a link. */
  href?: string;
  /** One level of sub-items: the row becomes a module that opens a submenu. */
  items?: SideNavItem[];
}

export interface SideNavSection {
  id: string;
  /** Section header (e.g. "Operations"); expanded only. */
  title?: string;
  items: SideNavItem[];
}

export interface SideNavProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  sections: SideNavSection[];
  /** Figma "Orientation": 260px Expanded or the Compact icon rail. */
  orientation?: SideNavOrientation;
  /** The current page's item id (marked Active, and its module too). */
  activeId?: string;
  /** Called with the chosen item (a leaf, or a module in the compact rail). */
  onNavigate?: (id: string, item: SideNavItem) => void;
  /** Controlled open module (its submenu is shown); `null` = none. */
  openId?: string | null;
  /** Initially open module (uncontrolled). Defaults to the active item's module. */
  defaultOpenId?: string | null;
  onOpenChange?: (id: string | null) => void;
}

/**
 * A Figma icon asset drawn in `currentColor` (used as a mask), so the Nav Item's
 * state color applies — as in Figma, where the icon-color variable overrides the
 * asset fill.
 */
export function SideNavIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="sikat-sidenav__glyph"
      style={{ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")` }}
    />
  );
}

const moduleOf = (sections: SideNavSection[], id?: string) => {
  if (!id) return undefined;
  for (const s of sections)
    for (const item of s.items)
      if (item.id === id || item.items?.some((sub) => sub.id === id)) return item;
  return undefined;
};

/** A row: `<a>` when it has an href, otherwise a `<button>`. */
function Row({
  item,
  className,
  children,
  ...attrs
}: {
  item: SideNavItem;
  className: string;
  children: ReactNode;
  onClick?: () => void;
  'aria-current'?: 'page';
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'data-active'?: boolean;
  'data-open'?: boolean;
}) {
  return item.href && !item.items ? (
    <a href={item.href} className={className} {...attrs}>
      {children}
    </a>
  ) : (
    <button type="button" className={className} {...attrs}>
      {children}
    </button>
  );
}

/**
 * SideNav — the Figma Side Navigation Bar (Components › Nav): a `bg/tertiary`
 * sidebar of Nav Items (Figma "Button-Navigation") in sections split by a divider.
 * Expanded (260px): 20px icon + 14/20 label; modules with sub-items show a chevron
 * and open — one at a time — into a white Submenu card listing their sub-items;
 * the current page is Active (primary on primary-subtle; a sub-item also gets the
 * └ connector). Compact: an icon rail with 10px labels. Rows are links when given
 * an `href`, otherwise buttons (`onNavigate`).
 */
export function SideNav({
  sections,
  orientation = 'expanded',
  activeId,
  onNavigate,
  openId: openIdProp,
  defaultOpenId,
  onOpenChange,
  className,
  'aria-label': ariaLabel = 'Sidebar',
  ...rest
}: SideNavProps) {
  const compact = orientation === 'compact';
  const activeModule = moduleOf(sections, activeId);
  const [openInternal, setOpenInternal] = useState<string | null>(
    defaultOpenId !== undefined ? defaultOpenId : activeModule?.items ? activeModule.id : null,
  );
  const openId = openIdProp !== undefined ? openIdProp : openInternal;
  const setOpen = (id: string | null) => {
    if (openIdProp === undefined) setOpenInternal(id);
    onOpenChange?.(id);
  };
  const navigate = (item: SideNavItem) => onNavigate?.(item.id, item);

  const icon = (item: SideNavItem) =>
    item.icon ? <span className="sikat-sidenav__icon">{item.icon}</span> : null;

  const renderItem = (item: SideNavItem) => {
    const isActive = item.id === activeId || activeModule?.id === item.id;

    if (compact) {
      return (
        <li key={item.id}>
          <Row
            item={item}
            className="sikat-sidenav__item"
            data-active={isActive || undefined}
            aria-current={item.id === activeId ? 'page' : undefined}
            onClick={() => navigate(item)}
          >
            {icon(item)}
            <span className="sikat-sidenav__label">{item.label}</span>
          </Row>
        </li>
      );
    }

    if (!item.items?.length) {
      return (
        <li key={item.id}>
          <Row
            item={item}
            className="sikat-sidenav__item"
            data-active={isActive || undefined}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => navigate(item)}
          >
            {icon(item)}
            <span className="sikat-sidenav__label">{item.label}</span>
          </Row>
        </li>
      );
    }

    const open = openId === item.id;
    const listId = `sikat-sidenav-${item.id}`;
    const header = (
      <Row
        item={item}
        className="sikat-sidenav__item"
        data-active={(!open && isActive) || undefined}
        data-open={open || undefined}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen(open ? null : item.id)}
      >
        {icon(item)}
        <span className="sikat-sidenav__label">{item.label}</span>
        <span className="sikat-sidenav__chevron">
          <SideNavIcon src={open ? chevronDown : chevronRight} />
        </span>
      </Row>
    );
    if (!open) return <li key={item.id}>{header}</li>;
    return (
      <li key={item.id} className="sikat-sidenav__submenu">
        {header}
        <ul id={listId} className="sikat-sidenav__subitems">
          {item.items.map((sub) => {
            const subActive = sub.id === activeId;
            return (
              <li key={sub.id}>
                <Row
                  item={sub}
                  className="sikat-sidenav__item sikat-sidenav__item--sub"
                  data-active={subActive || undefined}
                  aria-current={subActive ? 'page' : undefined}
                  onClick={() => navigate(sub)}
                >
                  <span className="sikat-sidenav__connector" aria-hidden="true">
                    {subActive ? <img src={connectorActive} alt="" width={19} height={36} /> : null}
                  </span>
                  <span className="sikat-sidenav__label">{sub.label}</span>
                </Row>
              </li>
            );
          })}
        </ul>
      </li>
    );
  };

  return (
    <nav
      aria-label={ariaLabel}
      data-orientation={orientation}
      className={cn('sikat-sidenav', className)}
      {...rest}
    >
      <div className="sikat-sidenav__content">
        {sections.map((section, i) => [
          i > 0 ? (
            <img
              key={`${section.id}-divider`}
              className="sikat-sidenav__divider"
              src={dividerLine}
              alt=""
            />
          ) : null,
          <div key={section.id} className="sikat-sidenav__section">
            {section.title && !compact ? (
              <p className="sikat-sidenav__title">{section.title}</p>
            ) : null}
            <ul className="sikat-sidenav__list" aria-label={section.title}>
              {section.items.map(renderItem)}
            </ul>
          </div>,
        ])}
      </div>
    </nav>
  );
}
