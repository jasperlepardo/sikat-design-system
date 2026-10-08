import React, { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import {
  decorativeIconIntents,
  decorativeIconStyles,
  decorativeIconRoundeds,
  type DecorativeIconIntent,
  type DecorativeIconStyle,
  type DecorativeIconRounded,
} from '../../tokens/generated/decorative-icon.manifest';
import '../../styles/components/decorative-icon.css'; // generated box, colors + radius

/** Figma `Style` axis — kept under its historical `variant` name. */
export const decorativeIconVariants = decorativeIconStyles;
/** `subtle` is the pre-Figma name of `ghost`, still accepted. */
export type DecorativeIconVariant = DecorativeIconStyle | 'subtle';
export { decorativeIconIntents, decorativeIconRoundeds };
export type { DecorativeIconIntent, DecorativeIconRounded };

export interface DecorativeIconProps extends HTMLAttributes<HTMLDivElement> {
  /** Color intent. Default: primary. */
  intent?: DecorativeIconIntent;
  /** Visual style: filled / tinted (ghost) / bordered (outline) / bare (link). Default: solid. */
  variant?: DecorativeIconVariant;
  /** Corner shape: circle (full), 24px corners (default) or square (none). Default: full. */
  rounded?: DecorativeIconRounded;
  /**
   * @deprecated Use `rounded`. `circle` is `rounded="full"`; `rounded` keeps its
   * original 8px (`--rounded-lg`) corners.
   */
  shape?: 'circle' | 'rounded';
  /** Material Symbol name (e.g. "home", "inventory_2"). Renders as a scaled icon. */
  icon?: string;
  /** Container size in px. Default: 80. The inner icon scales proportionally (70%). */
  size?: number;
  /** Custom content override — use when you need something other than a Material Symbol. */
  children?: ReactNode;
}

/**
 * DecorativeIcon — icon in a tinted container (Figma "Decorative Icons", node 19410:78).
 * Colors come from the `Icon/*` tokens across Intent × Style; `rounded` picks the
 * corner shape. Default 80px with a 56px icon; `size` scales both.
 */
export function DecorativeIcon({
  intent = 'primary',
  variant = 'solid',
  rounded = 'full',
  shape,
  icon,
  size = 80,
  className,
  style,
  children,
  ...rest
}: DecorativeIconProps) {
  const iconSize = Math.round(size * 0.7);
  return (
    <div
      className={cn('sikat-decorative-icon', className)}
      data-intent={intent}
      data-style={variant === 'subtle' ? 'ghost' : variant}
      data-rounded={rounded}
      style={
        {
          '--decorative-icon-size': `${size}px`,
          ...(shape === 'rounded' ? { borderRadius: 'var(--rounded-lg)' } : null),
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      {icon ? <Icon size={iconSize}>{icon}</Icon> : children}
    </div>
  );
}
