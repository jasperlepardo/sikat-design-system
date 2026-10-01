import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Panel } from '../Panel/Panel';
import './side-panel.css';

/* ---------------------------------------------------------------- SidePanel */

export interface SidePanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Renders a semi-transparent backdrop and fixes the panel to the right edge
   * of the viewport. Locks body scroll while open.
   * Control width via `--sikat-side-panel-width` and nav offset via
   * `--sikat-nav-height` (default: 64px).
   */
  overlay?: boolean;
  /** Called when the backdrop is clicked. */
  onOverlayClick?: () => void;
  children?: ReactNode;
}

/**
 * SidePanel — overlay/positioning wrapper for a right-edge drawer.
 * Handles backdrop, scroll lock, and fixed positioning only; compose `Panel`,
 * `PanelHeader`, `Panel.Body`, `Panel.Sidebar`, `Panel.Main`, and
 * `Panel.Summary` inside.
 */
export function SidePanel({
  overlay,
  onOverlayClick,
  className,
  children,
  ...rest
}: SidePanelProps) {
  useEffect(() => {
    if (!overlay) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [overlay]);

  return (
    <>
      {overlay ? (
        <div className="sikat-side-panel__backdrop" onClick={onOverlayClick} aria-hidden="true" />
      ) : null}
      <div
        className={cn('sikat-side-panel', overlay && 'sikat-side-panel--overlay', className)}
        {...rest}
      >
        <Panel>{children}</Panel>
      </div>
    </>
  );
}
