import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols icon name, e.g. "home", "close", "info". */
  children: string;
  /** Square pixel size — sets font-size and opsz axis. Default 24. */
  size?: number;
  /** Fill axis: 0 = outlined (default), 1 = filled. */
  fill?: 0 | 1;
  /** Weight axis: 100–700. Default 400. */
  weight?: number;
  /** Accessible label. When omitted the icon is hidden from the a11y tree. */
  label?: string;
}

/**
 * Icon — Material Symbols Outlined glyph. Pass the symbol name as children
 * (e.g. "home", "close"). Colored with `currentColor`; sized via `size` (px).
 * Requires the Material Symbols Outlined web font to be loaded.
 */
export function Icon({
  children,
  size = 24,
  fill = 0,
  weight = 400,
  label,
  className,
  style,
  ...rest
}: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined sikat-icon', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{
        fontSize: size,
        width: size,
        height: size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
