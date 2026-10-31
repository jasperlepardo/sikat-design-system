import { type LabelHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import '../../styles/components/field.css';
import './field.css';

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  /** Muted secondary text after the label (Figma "Sub Label"), e.g. "(optional)". */
  subLabel?: ReactNode;
  /** Info tooltip / lock reason — underlined on the label text normally; shown on a lock icon when disabled. */
  tooltip?: ReactNode;
  /** When true, shows a lock icon (with optional tooltip reason) and hides the required marker. */
  disabled?: boolean;
  children?: ReactNode;
}

export function FormLabel({
  required,
  subLabel,
  tooltip,
  disabled,
  className,
  children,
  htmlFor,
  ...rest
}: FormLabelProps) {
  const hasHoverTooltip = !disabled && tooltip != null;

  return (
    <span className={cn('sikat-field__label', className)}>
      {/* The <label> wraps the label content (text + markers + sub-label) and shrinks
          to fit it, so the click-to-focus hit area is the text — not the full-width
          row (stacked) or the fixed label column (inline) — while the accessible name
          still includes the sub-label. */}
      <label className="sikat-field__label-text" htmlFor={htmlFor} {...rest}>
        {hasHoverTooltip ? <Tooltip message={tooltip}>{children}</Tooltip> : children}
        {disabled ? (
          tooltip != null ? (
            <Tooltip message={tooltip} icon="lock" label="Why this field is locked" />
          ) : (
            <Icon size={12} label="Field is locked">
              lock
            </Icon>
          )
        ) : required ? (
          <span className="sikat-field__required"> *</span>
        ) : null}
        {subLabel != null ? <span className="sikat-field__sublabel">{subLabel}</span> : null}
      </label>
    </span>
  );
}
