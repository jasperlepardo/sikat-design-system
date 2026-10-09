import { useEffect, useRef, type RefObject } from 'react';

/**
 * Accessible name for a panel copy of a field's input: the field's own
 * `<label>` text (a FormField labels it via `htmlFor`, which the copy can't
 * share), else `fallback`.
 */
export function fieldLabelText(
  field: RefObject<HTMLInputElement | null>,
  fallback?: string,
): string | undefined {
  return field.current?.labels?.[0]?.textContent?.trim() || fallback;
}

/**
 * Focus handoff for a cover-mode panel whose header holds its own input (a
 * searchable Select, MultiSelect, Autocomplete): on open, focus `panelInput`
 * with the caret at the end; on close, call `onClose` and — only if focus was
 * left on the now-unmounted panel input — hand it back to `field`. Nothing
 * happens on mount, so the field never steals focus on page load.
 */
export function usePanelFocus(
  open: boolean,
  panelInput: RefObject<HTMLInputElement | null>,
  field: RefObject<HTMLElement | null>,
  onClose?: () => void,
) {
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      const el = panelInput.current;
      el?.focus();
      el?.setSelectionRange(el.value.length, el.value.length);
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    onClose?.();
    if (document.activeElement == null || document.activeElement === document.body) {
      field.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
