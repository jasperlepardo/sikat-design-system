import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import checkedMark from './assets/checkbox-checked.svg';
import indeterminateMark from './assets/checkbox-indeterminate.svg';
import './choice.css';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Shows the mixed (dash) mark, e.g. a "select all" over a partial selection. */
  indeterminate?: boolean;
  /** Inline label rendered after the box. */
  children?: ReactNode;
}

/**
 * Checkbox — the Figma Checkbox (20855:130206): a 20px, 6px-rounded native checkbox
 * (Default / Hover / Active / Disable / Read-Only) with an optional inline label.
 * `readOnly` keeps the value visible but blocks changes.
 */
export function Checkbox({
  indeterminate,
  readOnly,
  children,
  className,
  disabled,
  style,
  onClick,
  ...rest
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex select-none items-center gap-2',
        disabled ? 'cursor-not-allowed' : !readOnly && 'cursor-pointer',
        className,
      )}
    >
      <input
        type="checkbox"
        className="sikat-checkbox"
        disabled={disabled}
        aria-readonly={readOnly || undefined}
        data-readonly={readOnly || undefined}
        ref={(el) => {
          if (el) el.indeterminate = !!indeterminate;
        }}
        style={{
          ...style,
          ['--sikat-checkbox-checked' as string]: `url("${checkedMark}")`,
          ['--sikat-checkbox-indeterminate' as string]: `url("${indeterminateMark}")`,
        }}
        onClick={readOnly ? (e) => e.preventDefault() : onClick}
        {...rest}
      />
      {children != null ? (
        <span className={cn('text-sm', disabled ? 'text-disabled' : 'text-body')}>{children}</span>
      ) : null}
    </label>
  );
}
