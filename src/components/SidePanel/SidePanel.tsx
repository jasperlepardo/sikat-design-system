import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Panel } from '../Panel/Panel';
import { DecorativeIcon, type DecorativeIconVariant } from '../DecorativeIcon/DecorativeIcon';
import './side-panel.css';

/* ---------------------------------------------------------------- SidePanel */

export interface SidePanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Renders a semi-transparent backdrop behind the panel and fixes the panel
   * to the right edge of the viewport. Use `onOverlayClick` to close on click.
   */
  overlay?: boolean;
  /** Called when the backdrop is clicked (typically closes the panel). */
  onOverlayClick?: () => void;
  children?: ReactNode;
}

/**
 * SidePanel — right-edge drawer/modal (Figma node 18249:110237).
 * The outer shell handles positioning and an optional backdrop overlay.
 * The inner container uses `<Panel>` for the white box, shadow, and layout.
 *
 * Two body layouts via `SidePanel.Body`:
 * - **Single column** (default) — scrollable body with 16px padding.
 * - **Two columns** (`<SidePanel.Body columns>`) — fixed sidebar + flex main.
 *
 * Tab bar goes **above** the body — place `<SidePanel.Tabs>` between
 * `<SidePanel.Header>` and `<SidePanel.Body>`.
 *
 * Compound slots: `Header` · `Tabs` · `Body` · `Sidebar` · `Main` · `Summary`
 */
export function SidePanel({
  overlay,
  onOverlayClick,
  className,
  children,
  ...rest
}: SidePanelProps) {
  return (
    <>
      {overlay ? (
        <div
          className="sikat-side-panel__backdrop"
          onClick={onOverlayClick}
          aria-hidden="true"
        />
      ) : null}
      <div
        className={cn('sikat-side-panel', overlay && 'sikat-side-panel--overlay', className)}
        {...rest}
      >
        <Panel className="sikat-side-panel__panel">{children}</Panel>
      </div>
    </>
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

/* --------------------------------------------------------- SidePanel.Tabs */

export interface SidePanelSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Tab bar slot — place this **between** `SidePanel.Header` and `SidePanel.Body`
 * so tabs appear at the top of the panel content.
 */
function SidePanelTabs({ className, children, ...rest }: SidePanelSlotProps) {
  return (
    <div className={cn('sikat-side-panel__tab-bar', className)} {...rest}>
      {children}
    </div>
  );
}

/* --------------------------------------------------------- SidePanel.Body */

export interface SidePanelBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Two-column layout: places `SidePanel.Sidebar` and `SidePanel.Main`
   * side by side instead of a single scrollable column.
   */
  columns?: boolean;
  children?: ReactNode;
}

/**
 * Scrollable content area. Default: single column with 16px padding and gap.
 * Pass `columns` for the sidebar + main two-column layout.
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
 * Entity identity block for the top of `SidePanel.Sidebar`.
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
SidePanel.Tabs = SidePanelTabs;
SidePanel.Body = SidePanelBody;
SidePanel.Sidebar = SidePanelSidebar;
SidePanel.Main = SidePanelMain;
SidePanel.Summary = SidePanelSummary;
