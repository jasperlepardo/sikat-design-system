import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { DecorativeIcon, type DecorativeIconVariant } from '../DecorativeIcon/DecorativeIcon';
import './side-panel.css';

/* ---------------------------------------------------------------- SidePanel */

export interface SidePanelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * SidePanel — right-edge drawer/modal (Figma nodes 18266:113403, 18259:112874).
 * White outer shell with left-only rounded corners, border, and drop shadow.
 *
 * Two layout variants via `SidePanel.Body`:
 * - **Single column** (default) — header / scrollable body / optional tab bar.
 * - **Two columns** (`<SidePanel.Body columns>`) — header / sidebar + main / optional tab bar.
 *
 * Compound slots: `Header` · `Body` · `Tabs` · `Sidebar` · `Main` · `Summary`
 */
export function SidePanel({ className, children, ...rest }: SidePanelProps) {
  return (
    <div className={cn('sikat-side-panel', className)} {...rest}>
      <div className="sikat-side-panel__inner">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------- SidePanel.Header */

export interface SidePanelHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Leading slot — typically an `<IconButton>` with a context icon. */
  leading?: ReactNode;
  /** Panel title. */
  title?: ReactNode;
  /** Core action buttons on the right (e.g. Discard + Save). */
  actions?: ReactNode;
}

/** Top bar: leading icon button + title on the left, action buttons on the right. */
function SidePanelHeader({ leading, title, actions, className, ...rest }: SidePanelHeaderProps) {
  return (
    <header className={cn('sikat-side-panel__header', className)} {...rest}>
      <div className="sikat-side-panel__header-bar">
        <div className="sikat-side-panel__header-start">
          {leading != null ? (
            <div className="sikat-side-panel__header-leading">{leading}</div>
          ) : null}
          {title != null ? (
            <h2 className="sikat-side-panel__header-title">{title}</h2>
          ) : null}
        </div>
        {actions != null ? (
          <div className="sikat-side-panel__header-actions">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}

/* --------------------------------------------------------- SidePanel.Body */

export interface SidePanelBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Two-column layout: places `SidePanel.Sidebar` and `SidePanel.Main` side by
   * side instead of stacking content in a single scrollable column.
   */
  columns?: boolean;
  children?: ReactNode;
}

/**
 * Scrollable content area. Default: single column with 16px padding and gap.
 * Pass `columns` to switch to a sidebar + main two-column layout.
 */
function SidePanelBody({ columns, className, children, ...rest }: SidePanelBodyProps) {
  return (
    <div
      className={cn('sikat-side-panel__body', className)}
      data-layout={columns ? 'columns' : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------- SidePanel.Tabs */

export interface SidePanelSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Bottom tab bar — pinned below the body, never scrolls. */
function SidePanelTabs({ className, children, ...rest }: SidePanelSlotProps) {
  return (
    <div className={cn('sikat-side-panel__tab-bar', className)} {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------- SidePanel.Sidebar */

/** Fixed-width left column (two-column mode). Scrollable. */
function SidePanelSidebar({ className, children, ...rest }: SidePanelSlotProps) {
  return (
    <aside className={cn('sikat-side-panel__sidebar', className)} {...rest}>
      {children}
    </aside>
  );
}

/* --------------------------------------------------------- SidePanel.Main */

/** Flex-1 right column (two-column mode). Scrollable. */
function SidePanelMain({ className, children, ...rest }: SidePanelSlotProps) {
  return (
    <div className={cn('sikat-side-panel__main', className)} {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------- SidePanel.Summary */

export interface SidePanelSummaryProps extends HTMLAttributes<HTMLDivElement> {
  /** Material Symbol name for the leading DecorativeIcon. */
  icon?: string;
  /** DecorativeIcon variant. Default: outline. */
  iconVariant?: DecorativeIconVariant;
  /** DecorativeIcon size in px. Default: 40. */
  iconSize?: number;
  /** Entity name — primary bold text (e.g. "Customer Name"). */
  name?: ReactNode;
  /** Entity code or sub-label — muted caption text (e.g. "BP-00001"). */
  code?: ReactNode;
}

/**
 * Entity identity block — typically the first child of `SidePanel.Sidebar`.
 * Shows a DecorativeIcon, the entity name, and a muted code/subtitle.
 */
function SidePanelSummary({
  icon,
  iconVariant = 'outline',
  iconSize = 40,
  name,
  code,
  className,
  ...rest
}: SidePanelSummaryProps) {
  return (
    <div className={cn('sikat-side-panel__summary', className)} {...rest}>
      {icon ? <DecorativeIcon icon={icon} variant={iconVariant} size={iconSize} /> : null}
      <div className="sikat-side-panel__summary-text">
        {name != null ? (
          <span className="sikat-side-panel__summary-name">{name}</span>
        ) : null}
        {code != null ? (
          <span className="sikat-side-panel__summary-code">{code}</span>
        ) : null}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Attach */

SidePanel.Header = SidePanelHeader;
SidePanel.Body = SidePanelBody;
SidePanel.Tabs = SidePanelTabs;
SidePanel.Sidebar = SidePanelSidebar;
SidePanel.Main = SidePanelMain;
SidePanel.Summary = SidePanelSummary;
