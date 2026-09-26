import React, { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import './decorative-icon.css';

export const decorativeIconVariants = ['solid', 'subtle', 'outline'] as const;
export type DecorativeIconVariant = (typeof decorativeIconVariants)[number];

export interface DecorativeIconProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style: filled primary / tinted / bordered. Default: solid. */
  variant?: DecorativeIconVariant;
  /** Material Symbol name (e.g. "home", "inventory_2"). Renders as a scaled icon. */
  icon?: string;
  /** Container size in px. Default: 80. The inner icon scales proportionally (60%). */
  size?: number;
  /** Custom content override — use when you need something other than a Material Symbol. */
  children?: ReactNode;
}

/**
 * DecorativeIcon — circular icon container (Figma node 10716:174). Default 80px.
 * Pass `icon` with a Material Symbol name; `size` scales both container and icon.
 * Three variants driven by primary color tokens.
 */
export function DecorativeIcon({
  variant = 'solid',
  icon,
  size = 80,
  className,
  style,
  children,
  ...rest
}: DecorativeIconProps) {
  const iconSize = Math.round(size * 0.6);
  return (
    <div
      className={cn('sikat-decorative-icon', className)}
      data-variant={variant}
      style={{ '--decorative-icon-size': `${size}px`, ...style } as React.CSSProperties}
      {...rest}
    >
      {icon ? <Icon size={iconSize}>{icon}</Icon> : children}
    </div>
  );
}
