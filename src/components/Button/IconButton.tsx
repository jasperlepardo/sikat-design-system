import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import {
  iconButtonIntents,
  iconButtonStyles,
  iconButtonSizes,
  type IconButtonIntent,
  type IconButtonStyle,
  type IconButtonSize,
} from '../../tokens/generated/icon-button.manifest';
import '../../styles/components/icon-button.css'; // generated colors + sizing vars
import './button.css'; // structure

export { iconButtonIntents, iconButtonStyles, iconButtonSizes };
export type { IconButtonIntent, IconButtonStyle, IconButtonSize };

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** The icon glyph — typically an `<Icon>…</Icon>`. */
  children: ReactNode;
  /** Accessible label — required, since the button has no visible text. */
  label: string;
  /** Color intent. */
  intent?: IconButtonIntent;
  /** Visual style. */
  variant?: IconButtonStyle;
  /** Size (Figma): extra-large 40 / large 36 / medium 32 / small 28 / extra-small 24 / 2xs 20px, a square around a 20px glyph. */
  size?: IconButtonSize;
}

/**
 * IconButton — the square, icon-only counterpart of `Button`. It shares Button's
 * intent × style × size color matrix (the generated `.sikat-icon-btn` rules), so
 * it re-themes across light/dark and has real :hover / :focus-visible / :disabled
 * states. `label` is required and becomes the accessible name.
 */
export function IconButton({
  children,
  label,
  intent = 'primary',
  variant = 'solid',
  size = 'medium',
  type = 'button',
  disabled,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn('sikat-icon-btn', className)}
      data-intent={intent}
      data-style={variant}
      data-size={size}
      aria-label={label}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
