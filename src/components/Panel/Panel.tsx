import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { PanelHeader } from './PanelHeader';
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

/** Content area — grows to fill available height; 8px inner padding. */
function PanelBody({ className, children, ...rest }: PanelSlotProps) {
  return (
    <div className={cn('sikat-panel__body', className)} {...rest}>
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

Panel.Header = PanelHeader;
Panel.Body = PanelBody;
Panel.Footer = PanelFooter;
