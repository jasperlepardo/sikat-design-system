import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hover intent across one or more elements (e.g. a trigger and the panel it
 * peeks): `hovering` turns on at once and turns off only after `delay` ms with
 * no element hovered, so the pointer can cross the gap between them. Wire
 * `onHover(true)` / `onHover(false)` to each element's mouse enter / leave.
 */
export function useHoverIntent(delay = 150) {
  const [hovering, setHovering] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onHover = useCallback(
    (next: boolean) => {
      clearTimeout(timer.current);
      if (next) setHovering(true);
      else timer.current = setTimeout(() => setHovering(false), delay);
    },
    [delay],
  );
  /** Ends hover intent immediately (e.g. when the panel is pinned open). */
  const reset = useCallback(() => {
    clearTimeout(timer.current);
    setHovering(false);
  }, []);
  return { hovering, onHover, reset };
}
