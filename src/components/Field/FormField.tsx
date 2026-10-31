import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { labelWidthStyle, type LabelWidth } from '../../lib/labelWidth';
import { FormLabel } from './FormLabel';

export interface FormFieldProps {
  /**
   * Label placement: `stacked` (default) puts the label above the control;
   * `inline` puts it in a fixed column beside the control; `responsive` is
   * inline when wide and stacked when narrow. (Matches the Figma "Orientation"
   * variant: Stacked / Inline.)
   */
  orientation?: 'stacked' | 'inline' | 'responsive';
  /**
   * Width of the side-label column for `inline` / `responsive` orientation.
   * Number = px; string = any CSS length (e.g. `'10rem'`). Defaults to `12.5rem`.
   * No effect on `stacked`. Set it on `Form.Group` to size a whole column at once.
   */
  labelWidth?: LabelWidth;
  label?: ReactNode;
  /** Muted text after the label (Figma "Sub Label"), e.g. "(optional)". */
  subLabel?: ReactNode;
  /** Info tooltip / lock reason — see FormLabel. */
  tooltip?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Marks the field as disabled: shows a lock icon on the label and passes `disabled` to the control. */
  disabled?: boolean;
  className?: string;
  /**
   * Render-prop receiving the wired a11y props for the control — or plain
   * ReactNode for controls that don't need them (e.g. a Button).
   */
  children:
    | ((controlProps: {
        id: string;
        'aria-describedby'?: string;
        'aria-invalid'?: boolean;
        'aria-required'?: boolean;
        invalid?: boolean;
        disabled?: boolean;
        required?: boolean;
      }) => ReactNode)
    | ReactNode;
}

/**
 * FormField — composes a label, control, and hint/error text, wiring `id`,
 * `aria-describedby`, and `aria-invalid` for you via a render prop.
 */
export function FormField({
  orientation = 'stacked',
  labelWidth,
  label,
  subLabel,
  tooltip,
  hint,
  error,
  required,
  disabled,
  className,
  children,
}: FormFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = cn(hint ? hintId : undefined, error ? errorId : undefined) || undefined;

  return (
    <div
      className={cn('sikat-field-group', className)}
      data-orientation={orientation}
      style={labelWidthStyle(labelWidth)}
    >
      {label ? (
        <FormLabel
          htmlFor={id}
          required={required}
          subLabel={subLabel}
          tooltip={tooltip}
          disabled={disabled}
        >
          {label}
        </FormLabel>
      ) : null}
      <div className="sikat-field__fieldset">
        {typeof children === 'function'
          ? children({
              id,
              'aria-describedby': describedBy,
              'aria-invalid': error ? true : undefined,
              'aria-required': required || undefined,
              invalid: !!error,
              disabled,
              required,
            })
          : children}
        {error ? (
          <p id={errorId} role="alert" className="sikat-field__error">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="sikat-field__hint">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
