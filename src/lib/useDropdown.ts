import { useEffect, useRef, useState, type RefObject } from 'react';
import { themeAt } from './theme';

/** Max-height of .sikat-dropdown in px — keep in sync with dropdown.css. */
const DROPDOWN_MAX_HEIGHT = 256; // 16rem

/** Viewport-relative position of the trigger element, captured at open time. */
export interface DropdownAnchor {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  /** Explicit theme at the trigger — set it as the portaled panel's `data-theme`. */
  theme?: 'light' | 'dark';
}

/**
 * Open/close state for a portaled dropdown/popover: closes on outside
 * pointer-down and on Escape. Attach `rootRef` to the trigger container and
 * `panelRef` to the portaled panel so outside-click detection works for both.
 *
 * Returns `side` (`"bottom"` or `"top"`) and `hSide` (`"left"` or `"right"`) —
 * both recomputed at open time and on scroll/resize so callers can portal-position
 * the panel with `position: fixed`. Pass both to `<Dropdown anchor side hSide>`.
 */
export function useDropdown<T extends HTMLElement = HTMLDivElement>(): {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  rootRef: RefObject<T | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  side: 'top' | 'bottom';
  hSide: 'left' | 'right';
  anchor: DropdownAnchor | null;
} {
  const [open, setOpenState] = useState(false);
  const [side, setSide] = useState<'top' | 'bottom'>('bottom');
  const [hSide, setHSide] = useState<'left' | 'right'>('left');
  const [anchor, setAnchor] = useState<DropdownAnchor | null>(null);
  const rootRef = useRef<T>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);

  const computeAnchor = (): DropdownAnchor | null => {
    if (!rootRef.current) {
      setSide('bottom');
      setHSide('left');
      return null;
    }
    const rect = rootRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setSide(spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow ? 'top' : 'bottom');
    setHSide(window.innerWidth - rect.right < rect.left ? 'right' : 'left');
    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
      theme: themeAt(rootRef.current),
    };
  };

  const setOpen = (value: boolean) => {
    openRef.current = value;
    setAnchor(value ? computeAnchor() : null);
    setOpenState(value);
  };

  const toggle = () => setOpen(!openRef.current);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideRoot = rootRef.current?.contains(target) ?? false;
      const insidePanel = panelRef.current?.contains(target) ?? false;
      if (!insideRoot && !insidePanel) setOpenState(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        openRef.current = false;
        setOpenState(false);
      }
    };
    const onReposition = () => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setSide(spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow ? 'top' : 'bottom');
      setHSide(window.innerWidth - rect.right < rect.left ? 'right' : 'left');
      setAnchor({
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        theme: themeAt(rootRef.current),
      });
    };
    // Guarded: ResizeObserver is missing in jsdom and some older/SSR environments;
    // scroll + resize listeners still keep the panel positioned there.
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onReposition) : undefined;
    if (rootRef.current) resizeObserver?.observe(rootRef.current);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onReposition, { passive: true, capture: true });
    window.addEventListener('resize', onReposition, { passive: true });
    return () => {
      resizeObserver?.disconnect();
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onReposition, { capture: true });
      window.removeEventListener('resize', onReposition);
    };
  }, [open]);

  return { open, setOpen, toggle, rootRef, panelRef, side, hSide, anchor };
}
