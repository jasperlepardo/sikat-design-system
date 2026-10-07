import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { PanelHeader } from './PanelHeader';
import { DecorativeIcon, type DecorativeIconVariant } from '../DecorativeIcon/DecorativeIcon';
import './panel.css';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Lay content and footer out side by side (Figma `is Horizontal`). Omit the header. */
  horizontal?: boolean;
  children?: ReactNode;
}

/**
 * Panel — full page-level container (Figma Panel set: 9474:6174, 9474:6501).
 * Shadowed shell with three layout slots: `Panel.Header` (`<PanelHeader>`),
 * `Panel.Body` (grows to fill; holds section cards), and `Panel.Footer`
 * (action buttons). `horizontal` puts body and footer side by side.
 * Always rendered in the light theme (`data-theme="light"`), whatever the page's.
 */
export function Panel({ horizontal, className, children, ...rest }: PanelProps) {
  return (
    <div
      className={cn('sikat-panel', className)}
      data-theme="light"
      data-horizontal={horizontal || undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface PanelSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface PanelBodyProps extends PanelSlotProps {
  /** Two-column layout: removes body padding/scroll so columns handle their own. */
  columns?: boolean;
}

/** Content area — grows to fill available height; 12px inner padding, 16px gap. */
function PanelBody({ columns, className, children, ...rest }: PanelBodyProps) {
  return (
    <div
      className={cn('sikat-panel__body', columns && 'sikat-panel__body--columns', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Action row — equal-width buttons 8px apart (stacked when the panel is `horizontal`). */
function PanelFooter({ className, children, ...rest }: PanelSlotProps) {
  return (
    <div className={cn('sikat-panel__footer', className)} {...rest}>
      {children}
    </div>
  );
}

/** Fixed-width left column inside `Panel.Body columns`. Scrollable. */
function PanelSidebar({ className, children, ...rest }: PanelSlotProps) {
  return (
    <aside className={cn('sikat-panel__sidebar', className)} {...rest}>
      {children}
    </aside>
  );
}

/** Flex-1 right column inside `Panel.Body columns`. Scrollable. */
function PanelMain({ className, children, ...rest }: PanelSlotProps) {
  return (
    <div className={cn('sikat-panel__main', className)} {...rest}>
      {children}
    </div>
  );
}

export interface PanelSummaryProps extends HTMLAttributes<HTMLDivElement> {
  /** Material Symbol name for the leading DecorativeIcon. */
  icon?: string;
  /** DecorativeIcon variant. Default: outline. */
  iconVariant?: DecorativeIconVariant;
  /** DecorativeIcon size in px. Default: 40. */
  iconSize?: number;
  /** Entity name — primary bold text. */
  name?: ReactNode;
  /** Entity code or sub-label — muted caption text. */
  code?: ReactNode;
}

/** Entity identity block: DecorativeIcon + name + muted code. Use at the top of `Panel.Sidebar`. */
function PanelSummary({
  icon,
  iconVariant = 'outline',
  iconSize = 40,
  name,
  code,
  className,
  ...rest
}: PanelSummaryProps) {
  return (
    <div className={cn('sikat-panel__summary', className)} {...rest}>
      {icon ? <DecorativeIcon icon={icon} variant={iconVariant} size={iconSize} /> : null}
      <div className="sikat-panel__summary-text">
        {name != null ? <span className="sikat-panel__summary-name">{name}</span> : null}
        {code != null ? <span className="sikat-panel__summary-code">{code}</span> : null}
      </div>
    </div>
  );
}

Panel.Header = PanelHeader;
Panel.Body = PanelBody;
Panel.Footer = PanelFooter;
Panel.Sidebar = PanelSidebar;
Panel.Main = PanelMain;
Panel.Summary = PanelSummary;
