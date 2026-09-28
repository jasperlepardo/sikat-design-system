import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import './tooltip.css';

/** Side of the trigger the bubble opens on (Figma "Position"). */
export const tooltipPositions = ['top', 'bottom', 'left', 'right'] as const;
export type TooltipPosition = (typeof tooltipPositions)[number];

/**
 * Which edge the bubble lines up with (Figma "Alignment"): `start` = Left for
 * top/bottom, Top for left/right; `end` = Right / Bottom.
 */
export const tooltipAligns = ['start', 'end'] as const;
export type TooltipAlign = (typeof tooltipAligns)[number];

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** Bubble content. */
  message: ReactNode;
  /** Side the bubble opens on. Default: `top`. */
  position?: TooltipPosition;
  /** Edge the bubble aligns to. Default: `start`. */
  align?: TooltipAlign;
  /** Accessible name of the info trigger. Default: "More information". */
  label?: string;
  /** Controlled open state (Figma "Show Tooltip"). */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next open state. */
  onOpenChange?: (open: boolean) => void;
}

/** Grace period so the pointer can cross the gap between trigger and bubble. */
const CLOSE_DELAY = 100;

/**
 * Tooltip — 16px Material Symbols `info` trigger with a message bubble (Figma node
 * 10140:5533). Opens on hover and keyboard focus, closes on leave, blur, or
 * Escape. The bubble is `role="tooltip"` and describes the trigger.
 */
export function Tooltip({
  message,
  position = 'top',
  align = 'start',
  label = 'More information',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: TooltipProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const id = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const setOpen = (next: boolean) => {
    clearTimeout(closeTimer.current);
    if (next === open) return;
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  return (
    <span
      className={cn('sikat-tooltip', className)}
      data-position={position}
      data-align={align}
      onMouseEnter={(e) => {
        setOpen(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        scheduleClose();
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      <button
        type="button"
        className="sikat-tooltip__trigger"
        aria-label={label}
        aria-describedby={id}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && open) {
            e.stopPropagation();
            setOpen(false);
          }
        }}
      >
        <Icon size={16}>info</Icon>
      </button>
      <span id={id} role="tooltip" className="sikat-tooltip__bubble" hidden={!open}>
        {message}
      </span>
    </span>
  );
}
