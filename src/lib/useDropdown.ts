import { useEffect, useRef, useState, type RefObject } from 'react';

/** Max-height of .sikat-dropdown in px — keep in sync with dropdown.css. */
const DROPDOWN_MAX_HEIGHT = 256; // 16rem

/**
 * Open/close state for an in-flow dropdown/popover: closes on outside
 * pointer-down and on Escape. Attach `rootRef` to the element that wraps both
 * the trigger and the floating panel (so clicks inside either don't close it).
 *
 * Returns `side` — `"bottom"` (default) or `"top"` — computed at open time by
 * comparing viewport space above and below the trigger. Pass it as `data-side`
 * on the floating panel so CSS can flip the position.
 */
export function useDropdown<T extends HTMLElement = HTMLDivElement>(): {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  rootRef: RefObject<T | null>;
  side: 'top' | 'bottom';
} {
  const [open, setOpenState] = useState(false);
  const [side, setSide] = useState<'top' | 'bottom'>('bottom');
  const rootRef = useRef<T>(null);

  const computeSide = () => {
    if (!rootRef.current) { setSide('bottom'); return; }
    const rect = rootRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setSide(spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow ? 'top' : 'bottom');
  };

  const setOpen = (value: boolean) => {
    if (value) computeSide();
    setOpenState(value);
  };

  const toggle = () => {
    setOpenState((prev) => {
      if (!prev) computeSide();
      return !prev;
    });
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenState(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenState(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return { open, setOpen, toggle, rootRef, side };
}
