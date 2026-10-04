import { useRef, useState, type LabelHTMLAttributes, type ReactNode } from 'react';
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
  ...rest
}: FormLabelProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setTooltipOpen(false), 100);
  };

  const hasHoverTooltip = !disabled && tooltip != null;

  return (
    <label
      className={cn('sikat-field__label', className)}
      onMouseOver={
        hasHoverTooltip
          ? () => {
              if (!tooltipOpen) setTooltipOpen(true);
            }
          : undefined
      }
      onMouseLeave={hasHoverTooltip ? scheduleClose : undefined}
      {...rest}
    >
      {hasHoverTooltip ? (
        <Tooltip
          message={tooltip}
          open={tooltipOpen}
          onOpenChange={(next) => {
            if (!next) scheduleClose();
          }}
        >
          {children}
        </Tooltip>
      ) : (
        children
      )}
      {disabled ? (
        tooltip != null ? (
          <Tooltip message={tooltip} icon="lock" label="Why this field is locked" />
        ) : (
          <Icon size={12}>lock</Icon>
        )
      ) : required ? (
        <span className="sikat-field__required"> *</span>
      ) : null}
      {subLabel != null ? <span className="sikat-field__sublabel">{subLabel}</span> : null}
    </label>
  );
}
