import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import {
  buttonIntents,
  buttonStyles,
  buttonSizes,
  type ButtonIntent,
  type ButtonStyle,
  type ButtonSize,
} from '../../tokens/generated/button.manifest';
import '../../styles/components/button.css'; // generated colors + sizing vars
import './button.css'; // structure
import { ToggleGroup, Toggle } from './ButtonToggle';

export { buttonIntents, buttonStyles, buttonSizes };
export type { ButtonIntent, ButtonStyle, ButtonSize };

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Color intent. */
  intent?: ButtonIntent;
  /** Visual style. */
  variant?: ButtonStyle;
  /** Size. */
  size?: ButtonSize;
  /** Shape — `pill` overrides the radius to fully rounded (border-radius: 9999px). */
  shape?: 'pill';
  /** Leading icon slot. */
  leadingIcon?: ReactNode;
  /** Trailing icon slot. */
  trailingIcon?: ReactNode;
  children?: ReactNode;
}

/**
 * Button — driven by the component-token tier. `intent`, `variant`, and `size`
 * become data-attributes that select generated CSS rules; every value resolves
 * through themed CSS vars, so the button re-themes across light/dark and has
 * real :hover / :focus-visible / :disabled states.
 */
export function Button({
  intent = 'primary',
  variant = 'solid',
  size = 'medium',
  shape,
  type = 'button',
  className,
  leadingIcon,
  trailingIcon,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn('sikat-btn', className)}
      data-intent={intent}
      data-style={variant}
      data-size={size}
      data-shape={shape}
      {...rest}
    >
      {leadingIcon ? <span className="sikat-btn__icon">{leadingIcon}</span> : null}
      {children != null ? <span className="sikat-btn__content">{children}</span> : null}
      {trailingIcon ? <span className="sikat-btn__icon">{trailingIcon}</span> : null}
    </button>
  );
}

Button.ToggleGroup = ToggleGroup;
Button.Toggle = Toggle;
