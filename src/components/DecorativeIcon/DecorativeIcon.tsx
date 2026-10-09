import React, { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import './decorative-icon.css';

export const decorativeIconVariants = ['solid', 'subtle', 'outline'] as const;
export type DecorativeIconVariant = (typeof decorativeIconVariants)[number];

export const decorativeIconIntents = ['primary', 'default'] as const;
export type DecorativeIconIntent = (typeof decorativeIconIntents)[number];

export interface DecorativeIconProps extends HTMLAttributes<HTMLDivElement> {
  /** Color intent: `primary` (orange) or `default` (neutral gray). Default: primary. */
  intent?: DecorativeIconIntent;
  /** Visual style: filled / tinted / bordered. Default: solid. */
  variant?: DecorativeIconVariant;
  /** Material Symbol name (e.g. "home", "inventory_2"). Renders as a scaled icon. */
  icon?: string;
  /** Container size in px. Default: 80. The inner icon scales proportionally (60%). */
  size?: number;
  /** Shape — default is `circle` (full radius); `rounded` uses `--rounded-lg`. */
  shape?: 'circle' | 'rounded';
  /** Custom content override — use when you need something other than a Material Symbol. */
  children?: ReactNode;
}

/**
 * DecorativeIcon — circular icon container (Figma node 19410:78). Default 80px.
 * Pass `icon` with a Material Symbol name; `size` scales both container and icon.
 * `intent` picks the color palette; `variant` picks the fill style.
 */
export function DecorativeIcon({
  intent = 'primary',
  variant = 'solid',
  icon,
  size = 80,
  shape,
  className,
  style,
  children,
  ...rest
}: DecorativeIconProps) {
  const iconSize = Math.round(size * 0.6);
  return (
    <div
      className={cn('sikat-decorative-icon', className)}
      data-intent={intent}
      data-variant={variant}
      data-shape={shape}
      style={{ '--decorative-icon-size': `${size}px`, ...style } as React.CSSProperties}
      {...rest}
    >
      {icon ? <Icon size={iconSize}>{icon}</Icon> : children}
    </div>
  );
}
