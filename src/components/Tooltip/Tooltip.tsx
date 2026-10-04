import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
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
  /** Material Symbol name for the icon trigger. Default: `'info'`. */
  icon?: string;
  /** Controlled open state (Figma "Show Tooltip"). */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next open state. */
  onOpenChange?: (open: boolean) => void;
  /**
   * When provided, renders children as an inline underlined trigger instead of
   * the info icon — intended for use inside a `<label>`.
   */
  children?: ReactNode;
}

/** Grace period so the pointer can cross the gap between trigger and bubble. */
const CLOSE_DELAY = 100;
/** Bubble offset from the trigger, and overhang past its aligned edge (8px). */
const GAP = 8;

/**
 * Fixed-position anchor point for the bubble. The CSS translates the bubble
 * from this point by position/alignment (e.g. `top` shifts it up by its own
 * height), so the bubble's size never needs measuring.
 */
function anchorPoint(rect: DOMRect, position: TooltipPosition, align: TooltipAlign) {
  const vertical = position === 'top' || position === 'bottom';
  if (vertical) {
    return {
      x: align === 'start' ? rect.left - GAP : rect.right + GAP,
      y: position === 'top' ? rect.top - GAP : rect.bottom + GAP,
    };
  }
  return {
    x: position === 'left' ? rect.left - GAP : rect.right + GAP,
    y: align === 'start' ? rect.top - GAP : rect.bottom + GAP,
  };
}

/**
 * Tooltip — 16px Material Symbols `info` trigger with a message bubble (Figma node
 * 10140:5533). Opens on hover and keyboard focus, closes on leave, blur, or
 * Escape. The bubble is `role="tooltip"` and describes the trigger. It is
 * portaled to `document.body` with `position: fixed`, so `overflow: hidden`
 * ancestors (panels, cards, scroll areas) can't clip it; it follows the
 * trigger on scroll and resize while open.
 */
export function Tooltip({
  message,
  position = 'top',
  align = 'start',
  label = 'More information',
  icon = 'info',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  onMouseEnter,
  onMouseLeave,
  children,
  ...rest
}: TooltipProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const id = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rootRef = useRef<HTMLSpanElement>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  // Portal target exists only after mount (keeps SSR output trigger-only).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => clearTimeout(closeTimer.current);
  }, []);

  // Track the trigger while open: scroll (any ancestor, via capture) and resize.
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const el = rootRef.current;
      if (el) setAnchor(anchorPoint(el.getBoundingClientRect(), position, align));
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, position, align]);

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

  const bubble = (
    <span
      id={id}
      role="tooltip"
      className="sikat-tooltip__bubble"
      data-position={position}
      data-align={align}
      hidden={!open}
      style={
        anchor
          ? ({
              '--sikat-tooltip-x': `${anchor.x}px`,
              '--sikat-tooltip-y': `${anchor.y}px`,
            } as CSSProperties)
          : undefined
      }
      // The bubble lives outside the trigger's DOM; keep it open while hovered.
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={scheduleClose}
    >
      {message}
    </span>
  );

  return (
    <span
      ref={rootRef}
      className={cn('sikat-tooltip', children ? 'sikat-tooltip--label' : undefined, className)}
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
      {children ? (
        <span className="sikat-tooltip__trigger--label" aria-describedby={id}>
          {children}
        </span>
      ) : (
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
          <Icon size={16}>{icon}</Icon>
        </button>
      )}
      {mounted ? createPortal(bubble, document.body) : null}
    </span>
  );
}
