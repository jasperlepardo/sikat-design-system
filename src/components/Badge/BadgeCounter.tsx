import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import {
  badgeIntents,
  badgeStyles,
  type BadgeIntent,
  type BadgeStyle,
} from '../../tokens/generated/badge.manifest';
import '../../styles/components/badge.css';
import './badge.css';

// The Figma "Badge Counter" shares the Badge intent × style matrix, so it reuses
// the Badge manifest + the generated .sikat-badge[data-intent][data-style] rules.
// Figma defines it for five intents (no White/Black); those still render, but the
// documented set below mirrors Figma.
export const badgeCounterIntents = badgeIntents.filter(
  (i): i is Exclude<BadgeIntent, 'white' | 'black'> => i !== 'white' && i !== 'black',
);
export { badgeStyles as badgeCounterStyles };
export type { BadgeIntent as BadgeCounterIntent, BadgeStyle as BadgeCounterStyle };

export interface BadgeCounterProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Color intent (maps to the Figma Badge Counter intent). */
  intent?: BadgeIntent;
  /** Visual style (maps to the Figma Badge Counter style). */
  variant?: BadgeStyle;
  /** Numeric count; clamped to `${max}+` when it exceeds `max`. */
  count?: number;
  /** Cap before showing `${max}+` (e.g. 99 → "99+"). */
  max?: number;
  /** Custom content (overrides `count`). */
  children?: ReactNode;
}

/**
 * BadgeCounter — a fixed 20px circular count pill (e.g. unread notifications).
 * Shares the Badge color matrix via the `.sikat-badge` rules, so `intent`/`variant`
 * re-theme identically; it grows to a pill for multi-digit counts and shows
 * `${max}+` past the cap.
 */
export function BadgeCounter({
  intent = 'default',
  variant = 'solid',
  count,
  max,
  className,
  children,
  ...rest
}: BadgeCounterProps) {
  const content = children ?? (count != null && max != null && count > max ? `${max}+` : count);
  return (
    <span
      className={cn('sikat-badge', 'sikat-badge--counter', className)}
      data-intent={intent}
      data-style={variant}
      {...rest}
    >
      <span className="sikat-badge__label">{content}</span>
    </span>
  );
}
