import { Children, type ReactNode } from 'react';
import { Avatar, type AvatarProps } from '../Avatar/Avatar';
import { Badge, type BadgeProps } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { DecorativeIcon, type DecorativeIconProps } from '../DecorativeIcon/DecorativeIcon';
import { Icon } from '../Icon/Icon';
import { Link } from '../Button/Link';
import { Text, type TextProps } from '../Text/Text';

export type TableContentTextProps = TextProps;

/*
 * Cell content for the Figma Table Cell types (Components › Table, 17239:6211).
 * Use them in a column's `cell` renderer. Hover is handled by the Table row
 * (rule → border/primary-subtle, handle / checkbox → fg/quarternary-solid).
 */

/**
 * Unified cell content component. Props compose freely:
 * - `onClick`/`href` → link/button text
 * - `media`/`src` → 24px leading icon or image
 * - `initials`/`avatarSrc` → 32px user avatar
 * - `texts` → generic n-level text stack via the Text component
 * - `children` + `subcopy` → shorthand for single main + one sub line
 */
export function TableContent({
  href,
  onClick,
  media,
  src,
  alt = '',
  decorativeIcon,
  avatar,
  avatarSrc,
  initials,
  texts,
  subcopy,
  children,
}: {
  href?: string;
  onClick?: () => void;
  /** Leading ReactNode — for a plain icon or custom element. */
  media?: ReactNode;
  /** Leading image URL (renders a 24px img). */
  src?: string;
  alt?: string;
  /** Leading DecorativeIcon — full DecorativeIconProps; size defaults to 32. */
  decorativeIcon?: DecorativeIconProps;
  /** Avatar styling props — intent, variant, shape, icon. Defaults: primary/subtle/circle. */
  avatar?: Omit<AvatarProps, 'src' | 'alt' | 'initials' | 'size' | 'children'>;
  /** Avatar photo URL — rendered inside the avatar container. */
  avatarSrc?: string;
  /** Initials shown when there is no avatar photo. */
  initials?: string;
  /**
   * Generic multi-level text stack. Each item renders as `<Text as="span">`.
   * Use `<Link>` or `<Button>` inside `children` for linked levels.
   * When provided, `subcopy` is ignored.
   */
  texts?: TableContentTextProps[];
  /** Shorthand sub line below main text (xs, muted). Ignored when `texts` is set. */
  subcopy?: ReactNode;
  children?: ReactNode;
}) {
  const resolvedMedia =
    decorativeIcon != null ? <DecorativeIcon size={32} {...decorativeIcon} /> : media;

  const isUser = initials != null || avatarSrc != null || avatar != null;
  const hasMedia = !isUser && (resolvedMedia != null || src != null);
  const hasTexts = texts != null && texts.length > 0;
  const hasStack = isUser || hasTexts || subcopy != null;

  const mainContent =
    href != null ? (
      <Link href={href} intent="default" onClick={onClick}>
        {children}
      </Link>
    ) : onClick != null ? (
      <Button intent="default" variant="link" onClick={onClick}>
        {children}
      </Button>
    ) : (
      children
    );

  const textStack = (
    <span className="sikat-table-cell__stack">
      {hasTexts ? (
        texts!.map((item, i) => <Text key={i} as="span" {...item} />)
      ) : (
        <>
          <span>{mainContent}</span>
          {subcopy != null ? <span className="sikat-table-cell__subcopy">{subcopy}</span> : null}
        </>
      )}
    </span>
  );

  const content = hasStack ? textStack : mainContent;

  if (isUser) {
    return (
      <span className="sikat-table-cell__row sikat-table-cell__user">
        <Avatar size={32} {...avatar} src={avatarSrc} initials={initials} />
        {textStack}
      </span>
    );
  }

  if (hasMedia) {
    return (
      <span className="sikat-table-cell__row">
        {resolvedMedia ?? (
          <img className="sikat-table-cell__media" src={src} alt={alt} width={24} height={24} />
        )}
        <span>{content}</span>
      </span>
    );
  }

  return <>{content}</>;
}

/** Type=Badge: a Success / Ghost / Small status Badge with a dot. */
export function TableStatus({
  intent = 'success',
  variant = 'ghost',
  size = 'small',
  dot = true,
  children,
  ...rest
}: BadgeProps) {
  return (
    <Badge intent={intent} variant={variant} size={size} dot={dot} {...rest}>
      {children}
    </Badge>
  );
}

/** Type=Amount: a currency Badge (Default / Ghost / Small) + the Body/sm Bold amount. */
export function TableAmount({ currency, children }: { currency?: ReactNode; children: ReactNode }) {
  return (
    <span className="sikat-table-cell__row sikat-table-cell__amount">
      {currency != null ? (
        <Badge intent="default" variant="ghost" size="small">
          {currency}
        </Badge>
      ) : null}
      <span className="sikat-table-cell__amount-value">{children}</span>
    </span>
  );
}

export type TableActionItem =
  | { type: 'drag'; label?: string }
  | {
      type: 'expand';
      expanded?: boolean;
      onToggle?: () => void;
      label?: string;
      onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    }
  | { type: 'button'; icon: ReactNode; label: string; onClick: () => void; disabled?: boolean };

/** Unified action cell covering drag handles, expand toggles, and icon buttons.
 *  Pass `items` with typed entries, or `children` for fully custom content. */
export function TableActions({
  items,
  children,
}: {
  items?: TableActionItem[];
  children?: ReactNode;
}) {
  const nodes: ReactNode[] = items
    ? items.map((item, i) => {
        if (item.type === 'drag') {
          return (
            <Button
              key={i}
              intent="default"
              variant="link"
              size="extra-small"
              className="sikat-table-cell__drag"
              aria-label={item.label ?? 'Drag to reorder'}
              leadingIcon={<Icon size={20}>drag_indicator</Icon>}
            />
          );
        }
        if (item.type === 'expand') {
          return (
            <Button
              key={i}
              intent="default"
              variant="link"
              size="extra-small"
              className="sikat-table-cell__expand"
              aria-label={item.label ?? 'Expand row'}
              aria-expanded={item.expanded}
              onClick={item.onToggle}
              onKeyDown={item.onKeyDown}
              leadingIcon={<Icon size={20}>chevron_right</Icon>}
            />
          );
        }
        return (
          <Button
            key={item.label}
            intent="default"
            variant="link"
            size="extra-small"
            aria-label={item.label}
            onClick={item.onClick}
            disabled={item.disabled}
            leadingIcon={item.icon}
          />
        );
      })
    : Children.toArray(children);

  return (
    <span className="sikat-table-cell__row sikat-table-cell__actions">
      {nodes.map((node, i) => (
        <span key={i} className="sikat-table-cell__row">
          {i > 0 ? <span className="sikat-table-cell__divider" aria-hidden="true" /> : null}
          {node}
        </span>
      ))}
    </span>
  );
}
