import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import dividerLine from './assets/divider-line.svg';
import arrowDownward from './assets/arrow-downward.svg';
import arrowUpward from './assets/arrow-upward.svg';
import rotateRight from './assets/rotate-right.svg';
import pix from './assets/pix.svg';
import keyboardArrowDown from './assets/keyboard-arrow-down.svg';
import './page-header.css';

export const pageHeaderTypes = ['table', 'forms'] as const;
export type PageHeaderType = (typeof pageHeaderTypes)[number];

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Figma "Page Type": Table (title + subcopy, tabs below) or Forms (one row). */
  type?: PageHeaderType;
  /** Figma "Page Title" (Body/lg/Medium, rendered as an h1). */
  title: ReactNode;
  /** Figma "Subcopy" under the title (Table). */
  subcopy?: ReactNode;
  /** Before the title: Table's icon tile, Forms' previous / next buttons. */
  leading?: ReactNode;
  /** After the title (Forms): e.g. a status Badge. */
  status?: ReactNode;
  /** After the status (Forms): e.g. a sync / refresh indicator icon. */
  titleIcon?: ReactNode;
  /** Figma slot "Operation Buttons" (icon buttons). */
  operations?: ReactNode;
  /** Figma slot "Core Action Button" (the main buttons). */
  actions?: ReactNode;
  /** Below the top bar (Table): e.g. `<Tabs>`. */
  tabs?: ReactNode;
}

/** A Figma icon asset drawn in `currentColor` (mask), 20px like every Figma icon. */
export function PageHeaderIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden="true"
      className="sikat-page-header__glyph"
      style={{ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")` }}
    />
  );
}

/** The Figma icons the Header uses (Material Outlined), as `currentColor` glyphs. */
export const pageHeaderIcons = {
  arrowDownward: <PageHeaderIcon src={arrowDownward} />,
  arrowUpward: <PageHeaderIcon src={arrowUpward} />,
  rotateRight: <PageHeaderIcon src={rotateRight} />,
  pix: <PageHeaderIcon src={pix} />,
  keyboardArrowDown: <PageHeaderIcon src={keyboardArrowDown} />,
};

/**
 * PageHeader — the Figma Header (Components › Headers): a `bg/secondary` card
 * (16px radius, bottom `border/default`, 14px / 16px padding) with the page title
 * on the left and actions on the right — the "Operation Buttons" and "Core Action
 * Button" slots, split by a 20px divider. `type="table"`: title over a subcopy,
 * optional `tabs` below; `type="forms"`: one row with a status after the title.
 * Compose it from the library: IconButton / Button (extra-large), Badge, Tabs.
 */
export function PageHeader({
  type = 'table',
  title,
  subcopy,
  leading,
  status,
  titleIcon,
  operations,
  actions,
  tabs,
  className,
  ...rest
}: PageHeaderProps) {
  const isTable = type === 'table';
  return (
    <header data-type={type} className={cn('sikat-page-header', className)} {...rest}>
      <div className="sikat-page-header__bar">
        <div className="sikat-page-header__start">
          {leading != null ? <div className="sikat-page-header__leading">{leading}</div> : null}
          <div className="sikat-page-header__titles">
            <div className="sikat-page-header__title-row">
              <h1 className="sikat-page-header__title">{title}</h1>
              {!isTable && status != null ? status : null}
            </div>
            {isTable && subcopy != null ? (
              <p className="sikat-page-header__subcopy">{subcopy}</p>
            ) : null}
          </div>
          {!isTable && titleIcon != null ? (
            <span className="sikat-page-header__title-icon">{titleIcon}</span>
          ) : null}
        </div>
        {operations != null || actions != null ? (
          <div className="sikat-page-header__end">
            {operations != null ? (
              <div className="sikat-page-header__group">{operations}</div>
            ) : null}
            {operations != null && actions != null ? (
              <span className="sikat-page-header__divider" aria-hidden="true">
                <img src={dividerLine} alt="" width={20} height={2} />
              </span>
            ) : null}
            {actions != null ? <div className="sikat-page-header__group">{actions}</div> : null}
          </div>
        ) : null}
      </div>
      {isTable && tabs != null ? <div className="sikat-page-header__tabs">{tabs}</div> : null}
    </header>
  );
}
