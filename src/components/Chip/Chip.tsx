import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import {
  chipIntents,
  chipStyles,
  chipSizes,
  type ChipIntent,
  type ChipStyle,
  type ChipSize,
} from '../../tokens/generated/chip.manifest';
import '../../styles/components/chip.css'; // generated colors + sizing + state vars
import './chip.css'; // structure

export { chipIntents, chipStyles, chipSizes };
export type { ChipIntent, ChipStyle, ChipSize };

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onSelect' | 'style'> {
  /** Color intent. */
  intent?: ChipIntent;
  /** Visual style. */
  variant?: ChipStyle;
  /** Size. */
  size?: ChipSize;
  /** Corner style — `pill` (fully rounded, default) or `rounded` (button radius). */
  shape?: 'pill' | 'rounded';
  /** Selected/pressed state — for filter & choice chips. */
  selected?: boolean;
  /**
   * Toggle/select handler. When provided, the chip body becomes a `<button>`
   * with `aria-pressed={selected}`.
   */
  onSelect?: () => void;
  /** When provided, renders a trailing remove (×) button — for input chips. */
  onRemove?: () => void;
  /** Accessible label for the remove button. */
  removeLabel?: string;
  /** Disables both the select body and remove button. */
  disabled?: boolean;
  /** Leading icon or avatar slot — typically an `<Icon size={16}>…</Icon>`. */
  leadingIcon?: ReactNode;
  children?: ReactNode;
}

/**
 * Chip — an interactive token the user selects and/or removes. Covers filter
 * chips (`selected` + `onSelect`), choice chips (single-select group), and input
 * chips (`onRemove`). One flexible component: pass `onSelect` to make the body
 * toggleable, `onRemove` to add a dismiss button, or both. For passive status use
 * `Badge`; for passive labels use `Tag`.
 */
export function Chip({
  intent = 'default',
  variant = 'outline',
  size = 'medium',
  shape = 'pill',
  selected = false,
  onSelect,
  onRemove,
  removeLabel = 'Remove',
  disabled = false,
  leadingIcon,
  className,
  children,
  ...rest
}: ChipProps) {
  const interactive = typeof onSelect === 'function';

  const body = (
    <>
      {leadingIcon ? <span className="sikat-chip__icon">{leadingIcon}</span> : null}
      {children != null ? <span className="sikat-chip__label">{children}</span> : null}
    </>
  );

  return (
    <span
      className={cn('sikat-chip', className)}
      data-intent={intent}
      data-style={variant}
      data-size={size}
      data-shape={shape}
      data-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {interactive ? (
        <button
          type="button"
          className="sikat-chip__content"
          aria-pressed={selected}
          onClick={onSelect}
          disabled={disabled}
        >
          {body}
        </button>
      ) : (
        <span className="sikat-chip__content">{body}</span>
      )}

      {onRemove ? (
        <button
          type="button"
          className="sikat-chip__remove"
          onClick={onRemove}
          disabled={disabled}
          aria-label={removeLabel}
        >
          <Icon size={16} aria-hidden>
            close
          </Icon>
        </button>
      ) : null}
    </span>
  );
}
