import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../Icon/Icon';
import './avatar.css';

export const avatarVariants = ['solid', 'subtle', 'outline'] as const;
export type AvatarVariant = (typeof avatarVariants)[number];

export const avatarIntents = ['primary', 'default'] as const;
export type AvatarIntent = (typeof avatarIntents)[number];

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Photo URL. When set, renders a clipped `<img>` filling the container. */
  src?: string;
  /** Alt text for the photo. Defaults to `''` (decorative). */
  alt?: string;
  /** Text fallback shown when there is no `src` (e.g. "JL"). */
  initials?: ReactNode;
  /** Material Symbol name, shown when there is no `src` or `initials`. */
  icon?: string;
  /** Color intent for the placeholder: `primary` or `default`. Default `primary`. */
  intent?: AvatarIntent;
  /** Placeholder fill style: `solid` / `subtle` / `outline`. Default `subtle`. */
  variant?: AvatarVariant;
  /** Shape — `circle` (default) or `rounded` (squircle). */
  shape?: 'circle' | 'rounded';
  /** Diameter in px. Default 32. */
  size?: number;
  /** Escape hatch — overrides `src`/`initials`/`icon` when provided. */
  children?: ReactNode;
}

/**
 * Avatar — a user/entity image. Shows a photo (`src`), falling back to
 * `initials`, then an `icon`. Clips the photo to the shape (circle by default;
 * `shape="rounded"` for a squircle) and scales initials to the container.
 * `intent` / `variant` pick the placeholder palette.
 *
 * Drops into any slot that takes a node — e.g. a Field's `leadingIcon` or a
 * Table cell — so the photo/initials recipe lives in one place.
 */
export function Avatar({
  src,
  alt = '',
  initials,
  icon,
  intent = 'primary',
  variant = 'subtle',
  shape,
  size = 32,
  className,
  style,
  children,
  ...rest
}: AvatarProps) {
  const hasContent = src != null || initials != null || children != null;
  const content = src ? (
    <img src={src} alt={alt} />
  ) : (
    (children ?? initials ?? (icon ? <Icon size={Math.round(size * 0.6)}>{icon}</Icon> : null))
  );
  return (
    <div
      className={cn('sikat-avatar', className)}
      data-intent={intent}
      data-variant={variant}
      data-shape={shape}
      aria-hidden={hasContent ? undefined : 'true'}
      style={{ '--avatar-size': `${size}px`, ...style } as CSSProperties}
      {...rest}
    >
      {content}
    </div>
  );
}
