import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import './card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * Card — section container (Figma node 20725:85540). A bordered, rounded-2xl
 * white shell (no padding, clips its children) wrapping a tinted `Card.Header`
 * and a 12px-padded `Card.Content` area. Compose with `Card.Header` (media +
 * title + actions) and `Card.Content` (inner content area).
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
  /**
   * Leading media shown in a framed container — an `<Icon>`, `<DecorativeIcon>`,
   * or `<Avatar>`.
   */
  media?: ReactNode;
  /** @deprecated Use `media`. */
  icon?: ReactNode;
  /** Trailing slot — e.g. an action or dropdown button. */
  actions?: ReactNode;
  /** Pin the header to the top of the nearest scroll container while content scrolls past. */
  sticky?: boolean;
  children?: ReactNode;
}

/** Header row: framed media + semibold title on the left, optional actions on the right. */
function CardHeader({ media, icon, actions, sticky, className, children, ...rest }: CardHeaderProps) {
  const leadingMedia = media ?? icon;
  return (
    <div
      className={cn('sikat-card__header', sticky && 'sikat-card__header--sticky', className)}
      {...rest}
    >
      <div className="sikat-card__header-leading">
        {leadingMedia != null ? (
          <span className="sikat-card__header-media">{leadingMedia}</span>
        ) : null}
        <span className="sikat-card__header-title">{children}</span>
      </div>
      {actions != null ? <div className="sikat-card__header-actions">{actions}</div> : null}
    </div>
  );
}

/** Inner content area: 12px padding, 24px gap between children. */
function CardContent({ className, children, ...rest }: CardSlotProps) {
  return (
    <div className={cn('sikat-card__content', className)} {...rest}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Content = CardContent;
