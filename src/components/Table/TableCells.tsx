import type { HTMLAttributes, ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import dragIndicator from './assets/drag-indicator.svg';
import chevronRight from './assets/chevron-right.svg';
import dividerLine from '../PageHeader/assets/divider-line.svg';

/*
 * Cell content for the Figma Table Cell types (Components › Table, 17239:6211).
 * Use them in a column's `cell` renderer. Hover is handled by the Table row
 * (rule → border/primary-subtle, handle / checkbox → fg/quarternary-solid).
 */

const mask = (src: string) => ({ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")` });

/** Type=Link/ID: Body/sm Semibold, underlined, text/body. */
export function TableLink({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return href ? (
    <a className="sikat-table-cell__link" href={href} onClick={onClick}>
      {children}
    </a>
  ) : (
    <button type="button" className="sikat-table-cell__link" onClick={onClick}>
      {children}
    </button>
  );
}

/** Type=Media: a 24px image + content. */
export function TableMedia({
  src,
  alt = '',
  children,
}: {
  src: string;
  alt?: string;
  children: ReactNode;
}) {
  return (
    <span className="sikat-table-cell__row">
      <img className="sikat-table-cell__media" src={src} alt={alt} width={24} height={24} />
      <span>{children}</span>
    </span>
  );
}

/** Type=Subcontent: content (Body/sm) over a subcopy (Body/xs, text/muted). */
export function TableSubcontent({
  children,
  subcopy,
}: {
  children: ReactNode;
  subcopy?: ReactNode;
}) {
  return (
    <span className="sikat-table-cell__stack">
      <span>{children}</span>
      {subcopy != null ? <span className="sikat-table-cell__subcopy">{subcopy}</span> : null}
    </span>
  );
}

/** Type=User: 32px avatar (image, or initials on primary-subtle) + name / subcopy. */
export function TableUser({
  name,
  subcopy,
  initials,
  src,
}: {
  name: ReactNode;
  subcopy?: ReactNode;
  /** Shown when there's no image (Figma: "ST", Body/xs Semibold, text/primary). */
  initials?: string;
  src?: string;
}) {
  return (
    <span className="sikat-table-cell__row sikat-table-cell__user">
      <span className="sikat-table-cell__avatar" aria-hidden={src ? undefined : 'true'}>
        {src ? <img src={src} alt="" /> : initials}
      </span>
      <TableSubcontent subcopy={subcopy}>{name}</TableSubcontent>
    </span>
  );
}

/** Type=Badge: a Success / Ghost / Small status Badge with a dot. */
export function TableStatus({
  intent = 'success',
  children,
}: {
  intent?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  children: ReactNode;
}) {
  return (
    <Badge intent={intent} variant="ghost" size="small" dot>
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

/** Type=Action CTA: action buttons (Figma: Button Default / Ghost / Medium) split by
 * the Figma 20px divider. */
export function TableActions({ children }: { children: ReactNode[] }) {
  return (
    <span className="sikat-table-cell__row sikat-table-cell__actions">
      {children.map((child, i) => (
        <span key={i} className="sikat-table-cell__row">
          {i > 0 ? (
            <span className="sikat-table-cell__divider" aria-hidden="true">
              <img src={dividerLine} alt="" width={20} height={2} />
            </span>
          ) : null}
          {child}
        </span>
      ))}
    </span>
  );
}

/** Type=Item: the drag_indicator handle (fg/quarternary; darker on row hover). */
export function TableDragHandle({
  label = 'Drag to reorder',
  ...rest
}: { label?: string } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="sikat-table-cell__drag" role="img" aria-label={label} {...rest}>
      <span
        className="sikat-table__glyph"
        style={{ width: 20, height: 20, ...mask(dragIndicator) }}
      />
    </span>
  );
}

/** Type=Dropdown: the chevron-right expand button. */
export function TableExpand({
  expanded,
  onToggle,
  label = 'Expand row',
}: {
  expanded?: boolean;
  onToggle?: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="sikat-table__icon-btn sikat-table-cell__expand"
      aria-label={label}
      aria-expanded={expanded}
      onClick={onToggle}
    >
      <span
        className="sikat-table__glyph"
        style={{ width: 20, height: 20, ...mask(chevronRight) }}
      />
    </button>
  );
}
