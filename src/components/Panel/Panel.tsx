import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { PanelHeader } from './PanelHeader';
import { DecorativeIcon, type DecorativeIconVariant } from '../DecorativeIcon/DecorativeIcon';
import './panel.css';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Panel — full page-level container (Figma node 9474:6174). White shadowed shell
 * with three layout slots: `Panel.Header` (`<PanelHeader>`), `Panel.Body`
 * (grows to fill; holds section cards), and `Panel.Footer` (action buttons row).
 */
export function Panel({ className, children, ...rest }: PanelProps) {
  return (
    <div className={cn('sikat-panel', className)} {...rest}>
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

/** Content area — grows to fill available height; 8px inner padding. */
function PanelBody({ columns, className, children, ...rest }: PanelBodyProps) {
  return (
    <div className={cn('sikat-panel__body', columns && 'sikat-panel__body--columns', className)} {...rest}>
      {children}
    </div>
  );
}

/** Bottom action row — full-width buttons separated by 8px. */
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
