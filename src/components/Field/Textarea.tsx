import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';
import { useFilled } from './FieldShell';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Stop growing after this many lines of text; beyond it the textarea scrolls. */
  maxRows?: number;
}

/**
 * Textarea — a themed multi-line input (Figma Textarea). At rest it's one line,
 * the same height as a regular field. Grows with its content (typing, a new
 * `value`, or a width change that rewraps the text) up to `maxRows`, then
 * scrolls. Use standalone or inside <FormField>.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, rows = 1, maxRows, value, defaultValue, onChange, ...rest },
  ref,
) {
  const [filled, track] = useFilled(value, defaultValue);
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = 'auto';
    let height = el.scrollHeight;
    let overflow = 'hidden';
    if (maxRows) {
      const cs = getComputedStyle(el);
      const max =
        parseFloat(cs.lineHeight) * maxRows +
        parseFloat(cs.paddingTop) +
        parseFloat(cs.paddingBottom) +
        parseFloat(cs.borderTopWidth) +
        parseFloat(cs.borderBottomWidth);
      if (Number.isFinite(max) && height > max) {
        height = max;
        overflow = 'auto';
      }
    }
    el.style.height = `${height}px`;
    el.style.overflowY = overflow;
  }, [maxRows]);

  useLayoutEffect(resize, [resize, value]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let width = el.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (el.offsetWidth === width) return;
      width = el.offsetWidth;
      resize();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [resize]);

  return (
    <textarea
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      rows={rows}
      className={cn('sikat-field sikat-field--multiline', className)}
      data-size="md"
      data-filled={filled || undefined}
      aria-invalid={invalid || undefined}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => {
        track(e.currentTarget.value);
        onChange?.(e);
        resize();
      }}
      {...rest}
    />
  );
});
