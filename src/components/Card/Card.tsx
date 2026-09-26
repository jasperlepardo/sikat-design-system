import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import './card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Card — section container (Figma node 18266:140530). A `bg-tertiary` outer
 * shell (2px padding, rounded-lg-plus) around a `bg-default` white content box.
 * Compose with `Card.Header` (icon + title) and `Card.Content` (white inner area).
 */
export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cn('sikat-card', className)} {...rest}>
      {children}
    </div>
  );
}

export interface CardSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Leading icon (e.g. `<Icon size={24}>…</Icon>`). */
  icon?: ReactNode;
  /** Trailing slot — e.g. an action button. */
  actions?: ReactNode;
  children?: ReactNode;
}

/** Header row: icon + semibold title on the left, optional actions on the right. */
function CardHeader({ icon, actions, className, children, ...rest }: CardHeaderProps) {
  return (
    <div className={cn('sikat-card__header', className)} {...rest}>
      <div className="sikat-card__header-leading">
        {icon != null ? <span className="sikat-card__header-icon">{icon}</span> : null}
        <span className="sikat-card__header-title">{children}</span>
      </div>
      {actions != null ? (
        <div className="sikat-card__header-actions">{actions}</div>
      ) : null}
    </div>
  );
}

/** White inner content area: 14px padding, 24px gap between children. */
function CardContent({ className, children, ...rest }: CardSlotProps) {
  return (
    <div className={cn('sikat-card__content', className)} {...rest}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Content = CardContent;
