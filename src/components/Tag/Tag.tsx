import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import {
  tagIntents,
  tagStyles,
  type TagIntent,
  type TagStyle,
} from '../../tokens/generated/tag.manifest';
import '../../styles/components/tag.css'; // generated colors
import './tag.css'; // structure

export { tagIntents, tagStyles };
export type { TagIntent, TagStyle };

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Color intent. */
  intent?: TagIntent;
  /** Visual style. */
  variant?: TagStyle;
  /** Leading icon slot — typically an `<Icon size={16}>…</Icon>`. */
  leadingIcon?: ReactNode;
  children?: ReactNode;
}

/**
 * Tag — a non-interactive categorization label applied to content (card, row,
 * article). Visually a squared pill; re-themes across light/dark via semantic
 * vars. For status/counts use `Badge`; for user-selectable/removable tokens use
 * `Chip`.
 */
export function Tag({
  intent = 'default',
  variant = 'outline',
  leadingIcon,
  className,
  children,
  ...rest
}: TagProps) {
  return (
    <span className={cn('sikat-tag', className)} data-intent={intent} data-style={variant} {...rest}>
      {leadingIcon ? <span className="sikat-tag__icon">{leadingIcon}</span> : null}
      {children != null ? <span className="sikat-tag__label">{children}</span> : null}
    </span>
  );
}
