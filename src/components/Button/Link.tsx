import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import './button.css';

// Mirrors the Figma "Link Button" › Type axis (node 8919:1847).
export const linkIntents = [
  'default',
  'primary',
  'success',
  'warning',
  'danger',
  'white',
  'black',
] as const;
export type LinkIntent = (typeof linkIntents)[number];

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Color intent (maps to the Figma Link Button type). */
  intent?: LinkIntent;
  /** Leading icon — an `<Icon>` (or any node). */
  leadingIcon?: ReactNode;
  /** Trailing icon — an `<Icon>` (or any node). */
  trailingIcon?: ReactNode;
  /** Render as a non-interactive, muted link (no `href`, `aria-disabled`). */
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * Link — a navigational `<a>` styled as the Figma Link Button: medium 14/20
 * intent-colored text (text/<intent>) with optional 20px leading / trailing icons
 * (fg/<intent>); underlines on hover/focus (a code addition), no hover color change. Colors
 * resolve through semantic CSS vars, so it re-themes.
 * `white`/`black` intents are for placing links on dark/colored surfaces.
 *
 * When `disabled`, it renders without `href` (not focusable or navigable) and is
 * marked `aria-disabled`. `target="_blank"` auto-adds `rel="noopener noreferrer"`.
 */
export function Link({
  intent = 'primary',
  leadingIcon,
  trailingIcon,
  disabled = false,
  href,
  target,
  rel,
  className,
  onClick,
  children,
  ...rest
}: LinkProps) {
  const resolvedRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined);
  return (
    <a
      className={cn('sikat-link', className)}
      data-intent={intent}
      data-state={disabled ? 'disabled' : undefined}
      href={disabled ? undefined : href}
      target={disabled ? undefined : target}
      rel={resolvedRel}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {leadingIcon ? <span className="sikat-link__icon">{leadingIcon}</span> : null}
      <span className="sikat-link__label">{children}</span>
      {trailingIcon ? <span className="sikat-link__icon">{trailingIcon}</span> : null}
    </a>
  );
}
